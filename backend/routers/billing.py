from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
import os
import stripe
import models, schemas, database, auth

router = APIRouter(
    prefix="/billing",
    tags=["billing"],
    dependencies=[Depends(auth.get_current_user)],
)

# Initialize Stripe (falls back to dummy key if not set)
stripe.api_key = os.getenv("STRIPE_SECRET_KEY") or "dummy_stripe_key"
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET") or "dummy_webhook_secret"

class CheckoutRequest(BaseModel):
    plan_name: str # starter, pro, enterprise

class UpgradeRequest(BaseModel):
    plan_name: str

class CheckoutResponse(BaseModel):
    checkout_url: str
    simulated: bool

class PlanStatus(BaseModel):
    plan: str
    subscription_status: str
    stripe_customer_id: Optional[str]
    stripe_subscription_id: Optional[str]

@router.get("/status", response_model=PlanStatus)
def get_billing_status(current_user: schemas.User = Depends(auth.get_current_user)):
    return PlanStatus(
        plan=current_user.plan or "free",
        subscription_status=current_user.subscription_status or "inactive",
        stripe_customer_id=current_user.stripe_customer_id,
        stripe_subscription_id=current_user.stripe_subscription_id
    )

@router.post("/create-checkout-session", response_model=CheckoutResponse)
def create_checkout_session(
    request: CheckoutRequest,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    plan_name = request.plan_name.lower()
    if plan_name not in ["starter", "pro", "enterprise"]:
        raise HTTPException(status_code=400, detail="Invalid plan name specified")

    # If Stripe API Key is not set or is dummy, return simulation checkout URL
    stripe_key = os.getenv("STRIPE_SECRET_KEY")
    if not stripe_key or stripe_key == "dummy_stripe_key":
        # Simulate local checkout redirecting back with success params
        # This allows testing the full checkout UI flow natively without Stripe keys
        success_url = f"/dashboard/billing?status=success&plan={plan_name}"
        return CheckoutResponse(checkout_url=success_url, simulated=True)

    # Stripe pricing map (replace with real Stripe Price IDs in production environment variables)
    price_map = {
        "starter": os.getenv("STRIPE_PRICE_STARTER", "price_starter_placeholder"),
        "pro": os.getenv("STRIPE_PRICE_PRO", "price_pro_placeholder"),
        "enterprise": os.getenv("STRIPE_PRICE_ENTERPRISE", "price_enterprise_placeholder")
    }

    price_id = price_map[plan_name]

    # Create user customer ID if not exist
    customer_id = current_user.stripe_customer_id
    if not customer_id:
        try:
            customer = stripe.Customer.create(
                email=current_user.email,
                name=current_user.full_name,
                metadata={"user_id": current_user.id}
            )
            customer_id = customer.id
            db_user = db.query(models.User).filter(models.User.id == current_user.id).first()
            if db_user:
                db_user.stripe_customer_id = customer_id
                db.commit()
        except Exception as stripe_err:
            raise HTTPException(status_code=500, detail=f"Failed to create Stripe customer: {str(stripe_err)}")

    # Frontend URL base (e.g. localhost:3000 or citexa-ai.online)
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")

    try:
        session = stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="subscription",
            success_url=f"{frontend_url}/dashboard/billing?status=success&plan={plan_name}&session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{frontend_url}/dashboard/billing?status=cancelled",
            metadata={"user_id": current_user.id, "plan": plan_name}
        )
        return CheckoutResponse(checkout_url=session.url, simulated=False)
    except Exception as stripe_err:
        # Fall back to simulation if Stripe rejects placeholder price IDs
        print(f"Stripe error: {stripe_err}. Falling back to simulation.")
        success_url = f"/dashboard/billing?status=success&plan={plan_name}"
        return CheckoutResponse(checkout_url=success_url, simulated=True)

@router.post("/simulate-checkout-success", response_model=schemas.User)
def simulate_checkout_success(
    request: UpgradeRequest,
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    plan_name = request.plan_name.lower()
    if plan_name not in ["free", "starter", "pro", "enterprise"]:
        raise HTTPException(status_code=400, detail="Invalid plan name")

    db_user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.plan = plan_name
    db_user.subscription_status = "active" if plan_name != "free" else "inactive"
    db.commit()
    db.refresh(db_user)
    return db_user

# Stripe Webhook endpoint (unauthenticated, Stripe will call this)
@router.post("/webhook", dependencies=[])
async def stripe_webhook(request: Request, db: Session = Depends(database.get_db)):
    # Verify Stripe webhook signature
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle events
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        metadata = session.get("metadata", {})
        user_id = metadata.get("user_id")
        plan_name = metadata.get("plan")
        subscription_id = session.get("subscription")
        customer_id = session.get("customer")

        if user_id and plan_name:
            db_user = db.query(models.User).filter(models.User.id == int(user_id)).first()
            if db_user:
                db_user.plan = plan_name.lower()
                db_user.subscription_status = "active"
                db_user.stripe_subscription_id = subscription_id
                if customer_id:
                    db_user.stripe_customer_id = customer_id
                db.commit()

    elif event["type"] in ["customer.subscription.updated", "customer.subscription.deleted"]:
        subscription = event["data"]["object"]
        subscription_id = subscription.get("id")
        status = subscription.get("status")

        db_user = db.query(models.User).filter(models.User.stripe_subscription_id == subscription_id).first()
        if db_user:
            if status == "active":
                db_user.subscription_status = "active"
            else:
                # Cancelled or expired
                db_user.subscription_status = status
                if status == "canceled":
                    db_user.plan = "free"
            db.commit()

    return {"status": "success"}
