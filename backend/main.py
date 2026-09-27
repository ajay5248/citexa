from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import os
import sys

# Ensure local backend modules are importable regardless of working directory
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

import models, schemas, database, crud, auth
import httpx
import secrets

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        models.Base.metadata.create_all(bind=database.engine)
        from sqlalchemy import inspect, text
        try:
            inspector = inspect(database.engine)
            
            # Auto-migrate competitors table
            comp_columns = [col['name'] for col in inspector.get_columns('competitors')]
            with database.engine.begin() as conn:
                if 'analysis_data' not in comp_columns:
                    print("DATABASE AUTO-MIGRATION: Adding 'analysis_data' column to 'competitors' table.")
                    conn.execute(text("ALTER TABLE competitors ADD COLUMN analysis_data TEXT"))
            
            # Auto-migrate users table
            user_columns = [col['name'] for col in inspector.get_columns('users')]
            with database.engine.begin() as conn:
                if 'plan' not in user_columns:
                    print("DATABASE AUTO-MIGRATION: Adding 'plan' column to 'users' table.")
                    conn.execute(text("ALTER TABLE users ADD COLUMN plan VARCHAR DEFAULT 'free'"))
                if 'stripe_customer_id' not in user_columns:
                    print("DATABASE AUTO-MIGRATION: Adding 'stripe_customer_id' column to 'users' table.")
                    conn.execute(text("ALTER TABLE users ADD COLUMN stripe_customer_id VARCHAR"))
                if 'stripe_subscription_id' not in user_columns:
                    print("DATABASE AUTO-MIGRATION: Adding 'stripe_subscription_id' column to 'users' table.")
                    conn.execute(text("ALTER TABLE users ADD COLUMN stripe_subscription_id VARCHAR"))
                if 'subscription_status' not in user_columns:
                    print("DATABASE AUTO-MIGRATION: Adding 'subscription_status' column to 'users' table.")
                    conn.execute(text("ALTER TABLE users ADD COLUMN subscription_status VARCHAR"))

            # Auto-migrate contact_messages table
            contact_columns = [col['name'] for col in inspector.get_columns('contact_messages')]
            with database.engine.begin() as conn:
                if 'phone' not in contact_columns:
                    print("DATABASE AUTO-MIGRATION: Adding 'phone' column to 'contact_messages' table.")
                    conn.execute(text("ALTER TABLE contact_messages ADD COLUMN phone VARCHAR"))
                if 'source' not in contact_columns:
                    print("DATABASE AUTO-MIGRATION: Adding 'source' column to 'contact_messages' table.")
                    conn.execute(text("ALTER TABLE contact_messages ADD COLUMN source VARCHAR DEFAULT 'contact'"))
        except Exception as mig_err:
            print(f"DATABASE AUTO-MIGRATION WARNING: Failed to auto-migrate. Error: {mig_err}")
    except RuntimeError:
        # Database unreachable: stop the app so the deploy fails visibly instead of running without data
        raise
    except Exception as db_err:
        print(f"DATABASE INITIALIZATION WARNING: Failed to initialize database tables on startup. Error: {db_err}")
    yield

app = FastAPI(title="Citexa API", lifespan=lifespan)

# Configure CORS
allowed_origins = [
    "http://localhost:3000",
    "https://citexa.vercel.app",
    "https://citexa.online",
    "https://www.citexa.online",
    "https://citexa-app.vercel.app"
]
env_origins = os.getenv("ALLOWED_ORIGINS")
if env_origins:
    allowed_origins = [origin.strip() for origin in env_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Citexa API"}

@app.get("/health")
def health_check():
    # Reports which database engine is in use so a silent SQLite deployment is easy to spot
    return {"status": "ok", "database": database.engine.dialect.name}

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

@app.put("/users/me", response_model=schemas.User)
def update_user_me(user_update: schemas.UserUpdate, db: Session = Depends(database.get_db), current_user: schemas.User = Depends(auth.get_current_user)):
    db_user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if user_update.full_name is not None:
        db_user.full_name = user_update.full_name
    if user_update.company is not None:
        db_user.company = user_update.company
    db.commit()
    db.refresh(db_user)
    return db_user

from routers import audits, tools, websites, competitors, reports, billing, admin, contact, payments, mini_audit

app.include_router(audits.router)
app.include_router(tools.router)
app.include_router(websites.router)
app.include_router(competitors.router)
app.include_router(reports.router)
app.include_router(billing.router)
app.include_router(admin.router)
app.include_router(contact.router)
app.include_router(payments.router)
app.include_router(mini_audit.router)

@app.get("/debug-db")
def debug_db(current_user: schemas.User = Depends(auth.get_current_user)):
    # Exposes table contents, so admins only
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admins only")
    from sqlalchemy import text
    db = database.SessionLocal()
    try:
        # Check tables
        res = db.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"))
        tables = [row[0] for row in res]
        
        # Test query on competitors columns
        columns_res = db.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'competitors'
        """))
        columns = {row[0]: row[1] for row in columns_res}

        # Test query on competitors rows
        comp_err = None
        rows = []
        try:
            rows_res = db.execute(text("SELECT * FROM competitors"))
            for row in rows_res:
                r_dict = {}
                for k, v in row._mapping.items():
                    r_dict[k] = v.isoformat() if hasattr(v, "isoformat") else v
                rows.append(r_dict)
        except Exception as e:
            comp_err = str(e)
            
        return {
            "database_url_configured": os.getenv("DATABASE_URL") is not None,
            "database_url_startswith": os.getenv("DATABASE_URL")[:15] if os.getenv("DATABASE_URL") else None,
            "tables": tables,
            "columns": columns,
            "rows": rows,
            "competitors_query_error": comp_err
        }
    except Exception as e:
        return {"error": str(e)}
    finally:
        db.close()



