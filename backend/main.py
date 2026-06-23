from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, database, crud, auth
import httpx
import secrets

try:
    models.Base.metadata.create_all(bind=database.engine)
except Exception as db_err:
    print(f"DATABASE INITIALIZATION WARNING: Failed to initialize database tables on boot. Error: {db_err}")

app = FastAPI(title="Citexa API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://citexa.vercel.app",
        "https://citexa.online",
        "https://www.citexa.online",
        "https://citexa-app.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Citexa API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/users", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    user = crud.get_user_by_email(db, form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/google")
async def auth_google(token_data: schemas.GoogleToken, db: Session = Depends(database.get_db)):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {token_data.token}"}
        )
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid Google token")
        
        user_info = response.json()
        email = user_info.get("email")
        name = user_info.get("name", "Google User")
        
        if not email:
            raise HTTPException(status_code=400, detail="Email not provided by Google")
            
        user = crud.get_user_by_email(db, email)
        if not user:
            # Create a new user with a random placeholder password
            user_in = schemas.UserCreate(
                email=email,
                full_name=name,
                password=secrets.token_urlsafe(32)
            )
            user = crud.create_user(db, user_in)
            
        access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = auth.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    return current_user

from routers import audits, tools, websites, competitors

app.include_router(audits.router)
app.include_router(tools.router)
app.include_router(websites.router)
app.include_router(competitors.router)


