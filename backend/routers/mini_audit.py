import json
import secrets
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
import models, database
from ratelimit import RateLimiter
from site_checker import CheckError, run_checks

router = APIRouter(
    prefix="/mini-audit",
    tags=["mini-audit"],
)

# Each check fetches up to 4 URLs from the visitor's site, so keep this tight
audit_limiter = RateLimiter(limit=5, window_seconds=600)
unlock_limiter = RateLimiter(limit=10, window_seconds=600)


class MiniAuditRequest(BaseModel):
    url: str = Field(min_length=4, max_length=300)


class UnlockRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = Field(default=None, max_length=100)


def _summary(audit_id: str, result: dict) -> dict:
    return {
        "id": audit_id,
        "url": result["url"],
        "score": result["score"],
        "grade": result["grade"],
        "passed_count": result["passed_count"],
        "total_count": result["total_count"],
        "top_issues": result["top_issues"],
    }


@router.post("")
@router.post("/", include_in_schema=False)
def create_mini_audit(payload: MiniAuditRequest, request: Request, db: Session = Depends(database.get_db)):
    if audit_limiter.is_limited(request):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="You've run several checks in a row. Please try again in a few minutes.")
    try:
        result = run_checks(payload.url)
    except CheckError as e:
        raise HTTPException(status_code=422, detail=str(e))

    audit = models.PublicAudit(id=secrets.token_urlsafe(16), url=result["url"], score=result["score"], result=json.dumps(result))
    db.add(audit)
    db.commit()
    return _summary(audit.id, result)


@router.post("/{audit_id}/unlock")
def unlock_full_report(audit_id: str, payload: UnlockRequest, request: Request, db: Session = Depends(database.get_db)):
    if unlock_limiter.is_limited(request):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many attempts. Please try again in a few minutes.")
    audit = db.query(models.PublicAudit).filter(models.PublicAudit.id == audit_id).first()
    if not audit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="This report has expired. Please run the check again.")

    if audit.email != payload.email:
        audit.email = payload.email
        db.add(models.ContactMessage(
            name=(payload.name or "").strip() or payload.email,
            email=payload.email,
            website=audit.url,
            message=f"Mini-audit score {audit.score}/100",
            source="mini-audit",
        ))
        db.commit()

    result = json.loads(audit.result)
    return {**_summary(audit.id, result), "checks": result["checks"]}
