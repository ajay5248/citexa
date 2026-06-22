from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import os
import json
import wikipedia
from openai import OpenAI
import schemas, models, database, auth

router = APIRouter(
    prefix="/competitors",
    tags=["competitors"],
    dependencies=[Depends(auth.get_current_user)],
)

client = OpenAI(api_key=os.getenv("LLM_API_KEY") or "dummy_key")

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

def analyze_competitor_bg(competitor_id: int, db: Session, my_url: str, comp_url: str):
    db_comp = db.query(models.Competitor).filter(models.Competitor.id == competitor_id).first()
    if not db_comp: return
    
    try:
        # Extract keywords
        my_keyword = my_url.replace("https://", "").replace("http://", "").replace("www.", "").split(".")[0]
        comp_keyword = comp_url.replace("https://", "").replace("http://", "").replace("www.", "").split(".")[0]
        
        try:
            my_wiki = wikipedia.summary(my_keyword, sentences=2)
        except:
            my_wiki = f"No direct Wikipedia entry found for {my_keyword}."
            
        try:
            comp_wiki = wikipedia.summary(comp_keyword, sentences=2)
        except:
            comp_wiki = f"No direct Wikipedia entry found for {comp_keyword}."

        prompt = f"""
        You are an Answer Engine Optimization (AEO) and SEO expert analyst.
        Compare these two entities based on their Wikipedia context:
        
        My Website: {my_url}
        Context: {my_wiki}
        
        Competitor: {comp_url}
        Context: {comp_wiki}
        
        Provide a JSON response with the following keys EXACTLY:
        "visibility_score": (float 0-100, estimating competitor's AI visibility),
        "strengths": (list of 2 strings: what competitor does well),
        "weaknesses": (list of 2 strings: competitor's AEO gaps),
        "opportunities": (list of 2 strings: how my website can beat them)
        """
        
        if not os.getenv("LLM_API_KEY"):
            response_json = {
                "visibility_score": 85.0,
                "strengths": ["Strong brand presence", "High citation count"],
                "weaknesses": ["No FAQ schema", "Poor entity structuring"],
                "opportunities": ["Implement JSON-LD", "Target long-tail AI queries"]
            }
        else:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                response_format={ "type": "json_object" }
            )
            response_json = json.loads(response.choices[0].message.content)

        db_comp.visibility_score = response_json.get("visibility_score", 0.0)
        db_comp.analysis_data = json.dumps(response_json)
        db.commit()
    except Exception as e:
        db_comp.analysis_data = json.dumps({"error": str(e)})
        db.commit()

@router.post("/", response_model=CompetitorResponse)
def add_competitor(comp: schemas.CompetitorCreate, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
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
    
    background_tasks.add_task(analyze_competitor_bg, db_comp.id, db, website.url, comp.competitor_url)
    
    return db_comp
