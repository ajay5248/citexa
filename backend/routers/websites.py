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
    return crud.create_user_website(db=db, website=website, user_id=current_user.id)

@router.delete("/{website_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_website(website_id: int, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_website = db.query(models.Website).filter(models.Website.id == website_id, models.Website.owner_id == current_user.id).first()
    if not db_website:
        raise HTTPException(status_code=404, detail="Website not found")
    db.delete(db_website)
    db.commit()
    return None
