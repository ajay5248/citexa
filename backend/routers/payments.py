import hashlib
import hmac
import json
import os
from typing import Literal, Optional

import httpx
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
import models, database
from ratelimit import RateLimiter

router = APIRouter(
    prefix="/payments",
    tags=["payments"],
)

RAZORPAY_API = "https://api.razorpay.com/v1"

# Amounts charged, in paise. Keep in sync with frontend/src/lib/plans.ts.
PLANS = {
    "report": {"name": "AI Visibility Report", "amount_paise": 2999_00, "kind": "one_time"},
    "audit_fix": {"name": "AI Visibility Audit + Fix", "amount_paise": 14999_00, "kind": "one_time"},
    # Subscriptions: each needs a matching monthly plan created in Razorpay, referenced by plan_env
    "starter_monthly": {"name": "Monthly Starter", "amount_paise": 2499_00, "kind": "subscription", "plan_env": "RAZORPAY_STARTER_PLAN_ID"},
    "monthly": {"name": "Monthly AI Visibility Monitoring", "amount_paise": 7499_00, "kind": "subscription", "plan_env": "RAZORPAY_MONTHLY_PLAN_ID"},
}

# Monthly subscriptions renew for up to this many billing cycles (5 years); customers can cancel any time
SUBSCRIPTION_TOTAL_COUNT = 60

checkout_limiter = RateLimiter(limit=10, window_seconds=600)


def _key_id() -> str:
    return os.getenv("RAZORPAY_KEY_ID", "")


def _key_secret() -> str:
    return os.getenv("RAZORPAY_KEY_SECRET", "")


def _payments_enabled() -> bool:
    return bool(_key_id() and _key_secret())


def _razorpay_request(method: str, path: str, payload: Optional[dict] = None) -> dict:
    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.request(method, f"{RAZORPAY_API}{path}", json=payload, auth=(_key_id(), _key_secret()))
    except httpx.HTTPError as e:
        print(f"RAZORPAY: request to {path} failed: {e}")
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Payment provider is unreachable. Please try again.")
    if response.status_code >= 400:
        print(f"RAZORPAY: {path} returned {response.status_code}: {response.text[:500]}")
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="Could not start the payment. Please try again or contact us.")
    return response.json()


def _signature_matches(message: str, signature: str, secret: str) -> bool:
    expected = hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


class CheckoutRequest(BaseModel):
    plan_id: Literal["report", "audit_fix", "starter_monthly", "monthly"]
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=8, max_length=20)
    website: Optional[str] = Field(default=None, max_length=300)


class VerifyRequest(BaseModel):
    razorpay_payment_id: str = Field(max_length=100)
    razorpay_signature: str = Field(max_length=200)
    razorpay_order_id: Optional[str] = Field(default=None, max_length=100)
    razorpay_subscription_id: Optional[str] = Field(default=None, max_length=100)


@router.get("/config")
def get_payment_config():
    # The key id is public by design (it is sent to the browser for Checkout)
    return {"enabled": _payments_enabled(), "key_id": _key_id() if _payments_enabled() else None}


@router.post("/checkout")
def create_checkout(payload: CheckoutRequest, request: Request, db: Session = Depends(database.get_db)):
    if not _payments_enabled():
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Online payments are not set up yet. Please contact us.")
    if checkout_limiter.is_limited(request):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many attempts. Please try again in a few minutes.")

    website = payload.website.strip() if payload.website else None
    if website and not website.lower().startswith(("http://", "https://")):
        raise HTTPException(status_code=422, detail="Please enter a website URL starting with http:// or https://.")

    plan = PLANS[payload.plan_id]
    purchase = models.Purchase(
        plan_id=payload.plan_id,
        amount_paise=plan["amount_paise"],
        currency="INR",
        name=payload.name.strip(),
        email=payload.email,
        phone=payload.phone.strip(),
        website=website,
        status="created",
    )
    db.add(purchase)
    db.commit()
    db.refresh(purchase)

    notes = {"purchase_id": str(purchase.id), "plan": payload.plan_id, "website": (website or "")[:250]}

    if plan["kind"] == "one_time":
        order = _razorpay_request("POST", "/orders", {
            "amount": plan["amount_paise"],
            "currency": "INR",
            "receipt": f"purchase_{purchase.id}",
            "notes": notes,
        })
        purchase.razorpay_order_id = order["id"]
        db.commit()
        return {
            "key_id": _key_id(),
            "order_id": order["id"],
            "amount": plan["amount_paise"],
            "currency": "INR",
            "name": plan["name"],
        }

    plan_id = os.getenv(plan["plan_env"], "")
    if not plan_id:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="The monthly plan is not set up yet. Please contact us.")
    # Guard against the Razorpay plan's price drifting from the price we advertise
    razorpay_plan = _razorpay_request("GET", f"/plans/{plan_id}")
    item = razorpay_plan.get("item", {})
    if item.get("amount") != plan["amount_paise"] or item.get("currency") != "INR" or razorpay_plan.get("period") != "monthly":
        print(f"RAZORPAY: plan {plan_id} does not match advertised price: {razorpay_plan}")
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="The monthly plan is being updated. Please contact us.")

    subscription = _razorpay_request("POST", "/subscriptions", {
        "plan_id": plan_id,
        "total_count": SUBSCRIPTION_TOTAL_COUNT,
        "customer_notify": True,
        "notes": notes,
    })
    purchase.razorpay_subscription_id = subscription["id"]
    db.commit()
    return {
        "key_id": _key_id(),
        "subscription_id": subscription["id"],
        "amount": plan["amount_paise"],
        "currency": "INR",
        "name": plan["name"],
    }


@router.post("/verify")
def verify_payment(payload: VerifyRequest, db: Session = Depends(database.get_db)):
    if not _payments_enabled():
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Online payments are not set up.")

    if payload.razorpay_order_id:
        purchase = db.query(models.Purchase).filter(models.Purchase.razorpay_order_id == payload.razorpay_order_id).first()
        message = f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}"
        paid_status = "paid"
    elif payload.razorpay_subscription_id:
        purchase = db.query(models.Purchase).filter(models.Purchase.razorpay_subscription_id == payload.razorpay_subscription_id).first()
        message = f"{payload.razorpay_payment_id}|{payload.razorpay_subscription_id}"
        paid_status = "active"
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing order or subscription id.")

    if not purchase or not _signature_matches(message, payload.razorpay_signature, _key_secret()):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Payment could not be verified. If you were charged, please contact us.")

    purchase.razorpay_payment_id = payload.razorpay_payment_id
    if purchase.status in ("created", "failed"):
        purchase.status = paid_status
    db.commit()
    return {"status": purchase.status, "plan_id": purchase.plan_id}


# Subscription webhook events and the purchase status they map to
SUBSCRIPTION_EVENT_STATUS = {
    "subscription.activated": "active",
    "subscription.charged": "active",
    "subscription.halted": "halted",
    "subscription.cancelled": "cancelled",
    "subscription.completed": "completed",
    "subscription.paused": "paused",
    "subscription.resumed": "active",
}


@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(default=""),
    db: Session = Depends(database.get_db),
):
    secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
    body = await request.body()
    if not secret or not x_razorpay_signature or not _signature_matches(body.decode(), x_razorpay_signature, secret):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signature")

    event = json.loads(body)
    event_type = event.get("event", "")
    entities = event.get("payload", {})

    # Handlers only move a purchase to a state, so replayed/duplicate events are harmless
    if event_type in ("order.paid", "payment.captured"):
        payment = entities.get("payment", {}).get("entity", {})
        order_id = payment.get("order_id") or entities.get("order", {}).get("entity", {}).get("id")
        purchase = db.query(models.Purchase).filter(models.Purchase.razorpay_order_id == order_id).first() if order_id else None
        if purchase:
            purchase.status = "paid"
            purchase.razorpay_payment_id = payment.get("id") or purchase.razorpay_payment_id
            db.commit()
    elif event_type == "payment.failed":
        payment = entities.get("payment", {}).get("entity", {})
        order_id = payment.get("order_id")
        purchase = db.query(models.Purchase).filter(models.Purchase.razorpay_order_id == order_id).first() if order_id else None
        if purchase and purchase.status == "created":
            purchase.status = "failed"
            db.commit()
    elif event_type in SUBSCRIPTION_EVENT_STATUS:
        subscription = entities.get("subscription", {}).get("entity", {})
        purchase = db.query(models.Purchase).filter(models.Purchase.razorpay_subscription_id == subscription.get("id")).first()
        if purchase:
            purchase.status = SUBSCRIPTION_EVENT_STATUS[event_type]
            payment_id = entities.get("payment", {}).get("entity", {}).get("id")
            if payment_id:
                purchase.razorpay_payment_id = payment_id
            db.commit()

    return {"status": "ok"}
