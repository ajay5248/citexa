from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import models, schemas, database, auth

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(auth.get_current_user)],
)

# Request schemas for admin operations
class UserSummary(BaseModel):
    full_name: str
    email: str
    role: str
    plan: str
    subscription_status: Optional[str]
    created_at: datetime

class AdminStats(BaseModel):
    total_users: int
    total_websites: int
    total_audits: int
    total_revenue_usd: int
    users: List[UserSummary]

@router.get("/stats", response_model=AdminStats)
def get_admin_stats(
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    # Verify the current user is an admin
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view admin statistics"
        )

    # Gather totals
    total_users = db.query(models.User).count()
    total_websites = db.query(models.Website).count()
    total_audits = db.query(models.Audit).count()

    # Calculate estimated MRR based on current active plans
    starter_count = db.query(models.User).filter(models.User.plan == "starter", models.User.subscription_status == "active").count()
    pro_count = db.query(models.User).filter(models.User.plan == "pro", models.User.subscription_status == "active").count()
    enterprise_count = db.query(models.User).filter(models.User.plan == "enterprise", models.User.subscription_status == "active").count()
    
    total_revenue_usd = (starter_count * 49) + (pro_count * 99) + (enterprise_count * 299)

    # Fetch users list ordered by creation date
    db_users = db.query(models.User).order_by(models.User.created_at.desc()).all()
    
    user_summaries = []
    for user in db_users:
        user_summaries.append(UserSummary(
            full_name=user.full_name,
            email=user.email,
            role=user.role,
            plan=user.plan or "free",
            subscription_status=user.subscription_status or "inactive",
            created_at=user.created_at
        ))

    return AdminStats(
        total_users=total_users,
        total_websites=total_websites,
        total_audits=total_audits,
        total_revenue_usd=total_revenue_usd,
        users=user_summaries
    )


class LeadSummary(BaseModel):
    id: int
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    website: Optional[str]
    message: Optional[str]
    source: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/leads", response_model=List[LeadSummary])
def get_leads(
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view leads"
        )

    return db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).limit(500).all()


class PurchaseSummary(BaseModel):
    id: int
    plan_id: str
    amount_paise: int
    name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    website: Optional[str]
    status: str
    razorpay_payment_id: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("/purchases", response_model=List[PurchaseSummary])
def get_purchases(
    current_user: schemas.User = Depends(auth.get_current_user),
    db: Session = Depends(database.get_db)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view purchases"
        )

    return db.query(models.Purchase).order_by(models.Purchase.created_at.desc()).limit(500).all()
