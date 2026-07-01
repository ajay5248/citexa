from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import datetime
import schemas, models, database, auth
from typing import List

router = APIRouter(
    prefix="/reports",
    tags=["reports"],
    dependencies=[Depends(auth.get_current_user)],
)

REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "static_reports")
os.makedirs(REPORTS_DIR, exist_ok=True)

@router.get("/", response_model=List[schemas.Report])
def get_reports(db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    return db.query(models.Report).filter(models.Report.owner_id == current_user.id).order_by(models.Report.created_at.desc()).all()

@router.post("/", response_model=schemas.Report)
def generate_report(report_in: schemas.ReportCreate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    # Create filename
    filename = f"report_{current_user.id}_{int(datetime.datetime.utcnow().timestamp())}.txt"
    file_path = os.path.join(REPORTS_DIR, filename)
    
    # Gather data for the report
    websites = db.query(models.Website).filter(models.Website.owner_id == current_user.id).all()
    
    report_content = []
    report_content.append(f"==================================================")
    report_content.append(f"CITEXA AI SEARCH VISIBILITY REPORT")
    report_content.append(f"Title: {report_in.title}")
    report_content.append(f"Type: {report_in.report_type.replace('_', ' ').title()}")
    report_content.append(f"Generated on: {datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}")
    report_content.append(f"User: {current_user.full_name} ({current_user.company or 'No Company'})")
    report_content.append(f"==================================================\n")
    
    if report_in.report_type == "executive_summary":
        report_content.append("EXECUTIVE SUMMARY OVERVIEW")
        report_content.append("--------------------------")
        report_content.append("This report summarizes your website search engine and LLM answer engine visibility indices.")
        report_content.append(f"Total Tracked Websites: {len(websites)}")
        for w in websites:
            # Get latest audit
            audit = db.query(models.Audit).filter(models.Audit.website_id == w.id).order_by(models.Audit.created_at.desc()).first()
            score_str = f"{audit.overall_score}/100" if audit else "No audits performed yet"
            report_content.append(f"- {w.url}: Latest Audit Score = {score_str}")
            
    elif report_in.report_type == "deep_dive":
        report_content.append("COMPETITOR LANDSCAPE DEEP DIVE")
        report_content.append("------------------------------")
        report_content.append("Comparative analysis of tracked competitor domains.")
        for w in websites:
            competitors = db.query(models.Competitor).filter(models.Competitor.website_id == w.id).all()
            report_content.append(f"Webpage: {w.url}")
            report_content.append(f"Tracked Competitors: {len(competitors)}")
            for c in competitors:
                report_content.append(f"  - {c.competitor_url}: Visibility Score = {c.visibility_score}/100")
                
    else: # technical_audit
        report_content.append("SCHEMA & TECHNICAL AUDIT DETAILS")
        report_content.append("--------------------------------")
        report_content.append("Evaluation of structured data (JSON-LD) and FAQ schemas.")
        for w in websites:
            audit = db.query(models.Audit).filter(models.Audit.website_id == w.id).order_by(models.Audit.created_at.desc()).first()
            if audit:
                report_content.append(f"Webpage: {w.url}")
                report_content.append(f"  - Overall Score: {audit.overall_score}")
                report_content.append(f"  - Schema Markup Score: {audit.schema_score}")
                report_content.append(f"  - Content Readiness Score: {audit.content_score}")
                report_content.append(f"  - Citation Velocity Score: {audit.citation_score}")
            else:
                report_content.append(f"Webpage: {w.url} (No technical audit run yet)")
                
    # Save file to disk
    with open(file_path, "w") as f:
        f.write("\n".join(report_content))
        
    # Create database entry
    db_report = models.Report(
        owner_id=current_user.id,
        title=report_in.title,
        report_type=report_in.report_type,
        file_path=file_path
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    return db_report

@router.get("/{report_id}/download")
def download_report(report_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_report = db.query(models.Report).filter(models.Report.id == report_id, models.Report.owner_id == current_user.id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    if not os.path.exists(db_report.file_path):
        raise HTTPException(status_code=404, detail="Report file not found on disk")
        
    return FileResponse(
        path=db_report.file_path,
        filename=f"{db_report.title.replace(' ', '_')}.txt",
        media_type="text/plain"
    )
