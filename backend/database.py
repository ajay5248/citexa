import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. Load environment variables
load_dotenv()

# 2. Retrieve the PostgreSQL Database URL
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# 3. Handle Database Engine Creation
if not SQLALCHEMY_DATABASE_URL:
    print("WARNING: DATABASE_URL not set. Falling back to local SQLite database.")
    SQLALCHEMY_DATABASE_URL = "sqlite:///./citexa.db"

if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,  # Automatically verifies connections before using them
        pool_size=5,         # Standard pool size
        max_overflow=10      # Allow temporary overflow for bursts of traffic
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
