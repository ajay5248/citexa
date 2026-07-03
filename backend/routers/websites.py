from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, crud, auth, database

router = APIRouter(
    prefix="/websites",
    tags=["websites"],
    dependencies=[Depends(auth.get_current_user)],
)

@router.get("/", response_model=List[schemas.Website])
def read_websites(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    websites = db.query(models.Website).filter(models.Website.owner_id == current_user.id).offset(skip).limit(limit).all()
    return websites

@router.post("/", response_model=schemas.Website)
def create_website(website: schemas.WebsiteCreate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    user_plan = current_user.plan or "free"
    count = db.query(models.Website).filter(models.Website.owner_id == current_user.id).count()
    
    limit = 1
    if user_plan == "starter":
        limit = 2
    elif user_plan == "pro":
        limit = 10
    elif user_plan == "enterprise":
        limit = 99999
        
    if count >= limit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Tracking limit reached. Your {user_plan.capitalize()} plan allows tracking up to {limit} website(s). Please upgrade to add more."
        )
        
    return crud.create_user_website(db=db, website=website, user_id=current_user.id)

@router.delete("/{website_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_website(website_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_website = db.query(models.Website).filter(models.Website.id == website_id, models.Website.owner_id == current_user.id).first()
    if not db_website:
        raise HTTPException(status_code=404, detail="Website not found")
    db.delete(db_website)
    db.commit()
    return None
