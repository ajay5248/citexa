from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field, model_validator
from sqlalchemy.orm import Session
import models, database
from ratelimit import RateLimiter

router = APIRouter(
    prefix="/contact",
    tags=["contact"],
)

# Max 5 submissions per IP every 10 minutes
contact_limiter = RateLimiter(limit=5, window_seconds=600)


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(default=None, max_length=30)
    company: Optional[str] = Field(default=None, max_length=150)
    website: Optional[str] = Field(default=None, max_length=300)
    message: Optional[str] = Field(default=None, max_length=2000)
    source: Literal["contact", "free-audit", "order"] = "contact"
    # Honeypot: hidden in the form, so only bots fill it in
    nickname: Optional[str] = None

    @model_validator(mode="after")
    def require_email_or_phone(self):
        if not self.email and not (self.phone and self.phone.strip()):
            raise ValueError("Please provide an email address or a phone/WhatsApp number.")
        if self.source == "free-audit" and not (self.website and self.website.strip()):
            raise ValueError("Please provide your website URL.")
        if self.website and not self.website.strip().lower().startswith(("http://", "https://")):
            raise ValueError("Please enter a website URL starting with http:// or https://.")
        return self


# Accept both /contact and /contact/ so proxies that strip trailing slashes still work
@router.post("", status_code=status.HTTP_201_CREATED)
@router.post("/", status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_contact_message(payload: ContactCreate, request: Request, db: Session = Depends(database.get_db)):
    # Pretend success for bots so they don't retry
    if payload.nickname:
        return {"status": "received"}

    if contact_limiter.is_limited(request):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many submissions. Please try again in a few minutes.",
        )

    db_message = models.ContactMessage(
        name=payload.name.strip(),
        email=payload.email,
        phone=payload.phone.strip() if payload.phone else None,
        company=payload.company,
        website=payload.website.strip() if payload.website else None,
        message=payload.message,
        source=payload.source,
    )
    db.add(db_message)
    db.commit()
    return {"status": "received"}
