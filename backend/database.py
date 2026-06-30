import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. Load environment variables
load_dotenv()

# 2. Retrieve the PostgreSQL Database URL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. Handle Database Engine Creation with auto-fallback on connection failure
engine = None
if SQLALCHEMY_DATABASE_URL and not SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    try:
        # Create a temporary engine to verify connectivity (3 second timeout)
        temp_engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"connect_timeout": 3})
        with temp_engine.connect() as conn:
            pass
        print("DATABASE: Successfully connected to PostgreSQL database.")
        engine = create_engine(
            SQLALCHEMY_DATABASE_URL,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            connect_args={"connect_timeout": 5}
        )
    except Exception as e:
        print(f"DATABASE WARNING: Failed to connect to PostgreSQL ({e}). Falling back to local SQLite database.")
        SQLALCHEMY_DATABASE_URL = "sqlite:///./citexa.db"

if engine is None:
    # Use SQLite engine
    if not SQLALCHEMY_DATABASE_URL:
        SQLALCHEMY_DATABASE_URL = "sqlite:///./citexa.db"
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )

# 5. Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 6. Create a Base class for our declarative models
Base = declarative_base()

# 7. Dependency to get the database session for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
