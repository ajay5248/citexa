from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import json
import schemas, models, database, auth
from site_checker import CheckError, failed_checks, run_checks

router = APIRouter(
    prefix="/competitors",
    tags=["competitors"],
    dependencies=[Depends(auth.get_current_user)],
)

class CompetitorResponse(schemas.Competitor):
    pass

@router.get("/{website_id}", response_model=List[CompetitorResponse])
def get_competitors(website_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    # Verify ownership
    website = db.query(models.Website).filter(models.Website.id == website_id, models.Website.owner_id == current_user.id).first()
    if not website:
        raise HTTPException(status_code=404, detail="Website not found")
        
    competitors = db.query(models.Competitor).filter(models.Competitor.website_id == website_id).all()
    return competitors

def analyze_competitor_bg(competitor_id: int, my_url: str, comp_url: str):
    """Runs the rule-based checks on both homepages and compares them."""
    db = database.SessionLocal()
    try:
        db_comp = db.query(models.Competitor).filter(models.Competitor.id == competitor_id).first()
        if not db_comp: return

        try:
            mine = run_checks(my_url)
            theirs = run_checks(comp_url)
        except CheckError as e:
            db_comp.analysis_data = json.dumps({"error": str(e)})
            db.commit()
            return

        my_passed = {c["id"] for c in mine["checks"] if c["passed"]}
        their_passed = {c["id"] for c in theirs["checks"] if c["passed"]}
        by_weight = sorted(theirs["checks"], key=lambda c: -c["weight"])

        strengths = [c["title"] for c in by_weight if c["id"] in their_passed][:2]
        weaknesses = [c["title"] for c in by_weight if c["id"] not in their_passed][:2]
        # Things the competitor does that you don't are the quickest wins
        opportunities = [c["fix"] for c in by_weight if c["id"] in their_passed and c["id"] not in my_passed][:2]
        if not opportunities:
            opportunities = [c["fix"] for c in failed_checks(mine)[:2]]

        analysis = {
            "visibility_score": float(theirs["score"]),
            "your_score": float(mine["score"]),
            "strengths": strengths,
            "weaknesses": weaknesses,
            "opportunities": opportunities,
        }
        db_comp.visibility_score = analysis["visibility_score"]
        db_comp.analysis_data = json.dumps(analysis)
        db.commit()
    except Exception as e:
        db.rollback()
        try:
            db_comp = db.query(models.Competitor).filter(models.Competitor.id == competitor_id).first()
            if db_comp:
                db_comp.analysis_data = json.dumps({"error": str(e)})
                db.commit()
        except:
            pass
    finally:
        db.close()

@router.post("/", response_model=CompetitorResponse)
def add_competitor(comp: schemas.CompetitorCreate, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    user_plan = current_user.plan or "free"
    if user_plan == "free":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Competitor tracking is not available on the Free plan. Please upgrade to a paid plan."
        )

    # Verify ownership
    website = db.query(models.Website).filter(models.Website.id == comp.website_id, models.Website.owner_id == current_user.id).first()
    if not website:
        raise HTTPException(status_code=404, detail="Website not found")
        
    db_comp = models.Competitor(
        website_id=comp.website_id,
        competitor_url=comp.competitor_url,
        visibility_score=0.0
    )
    db.add(db_comp)
    db.commit()
    db.refresh(db_comp)
    
    background_tasks.add_task(analyze_competitor_bg, db_comp.id, website.url, comp.competitor_url)
    
    return db_comp
