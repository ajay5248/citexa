from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import schemas, models, database, auth
import json

router = APIRouter(
    prefix="/audits",
    tags=["audits"],
    dependencies=[Depends(auth.get_current_user)],
)

from site_checker import CheckError, category_score, failed_checks, run_checks


def perform_real_audit(audit_id: int, url: str):
    """Runs the rule-based AI-readiness checks on the website's homepage and stores the scores."""
    db = database.SessionLocal()
    try:
        db_audit = db.query(models.Audit).filter(models.Audit.id == audit_id).first()
        if not db_audit: return

        try:
            result = run_checks(url)
        except CheckError as e:
            db_audit.status = "failed"
            db_audit.audit_data = json.dumps({"error": str(e)})
            db.commit()
            return

        db_audit.status = "completed"
        db_audit.overall_score = float(result["score"])
        db_audit.schema_score = category_score(result, "schema")
        db_audit.content_score = category_score(result, "content")
        # Stored in citation_score for compatibility; it measures AI crawler access, not citations
        db_audit.citation_score = category_score(result, "access")
        db_audit.audit_data = json.dumps({
            "recommendations": [c["fix"] for c in failed_checks(result)[:3]],
            "checks": result["checks"],
        })
        db.commit()
    except Exception as e:
        db.rollback()
        try:
            db_audit = db.query(models.Audit).filter(models.Audit.id == audit_id).first()
            if db_audit:
                db_audit.status = "failed"
                db_audit.audit_data = json.dumps({"error": str(e)})
                db.commit()
        except:
            pass
    finally:
        db.close()

@router.post("/", response_model=schemas.Audit)
def create_audit(audit: schemas.AuditCreate, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    # Verify ownership of the website
    website = db.query(models.Website).filter(models.Website.id == audit.website_id, models.Website.owner_id == current_user.id).first()
    if not website:
        raise HTTPException(status_code=404, detail="Website not found or not owned by current user")
        
    user_plan = current_user.plan or "free"
    
    # Check total audits run by this user
    user_websites = db.query(models.Website).filter(models.Website.owner_id == current_user.id).all()
    user_website_ids = [w.id for w in user_websites]
    
    total_audits = 0
    if user_website_ids:
        total_audits = db.query(models.Audit).filter(models.Audit.website_id.in_(user_website_ids)).count()
        
    audit_limit = 3
    if user_plan == "starter":
        audit_limit = 10
    elif user_plan in ["pro", "enterprise"]:
        audit_limit = 99999
        
    if total_audits >= audit_limit:
        raise HTTPException(
            status_code=400,
            detail=f"Audit limit reached. Your {user_plan.capitalize()} plan allows up to {audit_limit} audits. Please upgrade your plan."
        )
        
    db_audit = models.Audit(website_id=audit.website_id, status="pending")
    db.add(db_audit)
    db.commit()
    db.refresh(db_audit)
    
    background_tasks.add_task(perform_real_audit, db_audit.id, website.url)
    
    return db_audit

from typing import List

@router.get("/", response_model=List[schemas.Audit])
def get_audits(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    # Get all websites for the user
    websites = db.query(models.Website).filter(models.Website.owner_id == current_user.id).all()
    website_ids = [w.id for w in websites]
    
    # Get all audits for those websites
    if not website_ids:
        return []
        
    audits = db.query(models.Audit).filter(models.Audit.website_id.in_(website_ids)).order_by(models.Audit.created_at.desc()).all()
    return audits

@router.get("/{audit_id}", response_model=schemas.Audit)
def get_audit(audit_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_audit = db.query(models.Audit).filter(models.Audit.id == audit_id).first()
    if not db_audit:
        raise HTTPException(status_code=404, detail="Audit not found")
        
    # Verify ownership of the website associated with this audit
    website = db.query(models.Website).filter(models.Website.id == db_audit.website_id).first()
    if not website or website.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this audit")
        
    return db_audit

