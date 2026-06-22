from sqlalchemy.orm import Session
import models, schemas, auth

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password, full_name=user.full_name, company=user.company)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_websites(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Website).offset(skip).limit(limit).all()

def create_user_website(db: Session, website: schemas.WebsiteCreate, user_id: int):
    db_website = models.Website(**website.dict(), owner_id=user_id)
    db.add(db_website)
    db.commit()
    db.refresh(db_website)
    return db_website
