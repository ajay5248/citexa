import os
import sys
import threading
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. Load environment variables
load_dotenv()

# We keep variables to store our lazy instances
_engine = None
_SessionLocal = None
_lock = threading.Lock()

# Type hints for editor support/type checkers (without namespace collision)
engine: Engine
SessionLocal: sessionmaker

# 6. Create a Base class for our declarative models (safe to do statically)
Base = declarative_base()

def _initialize_db():
    global _engine, _SessionLocal
    if _engine is not None:
        return
    with _lock:
        if _engine is not None:
            return

        # 2. Retrieve the PostgreSQL Database URL
        SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
        if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
            SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

        # 3. Handle Database Engine Creation with auto-fallback on connection failure
        engine_instance = None
        if SQLALCHEMY_DATABASE_URL and not SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
            try:
                # Create a temporary engine to verify connectivity (3 second timeout)
                temp_engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"connect_timeout": 3})
                with temp_engine.connect() as conn:
                    pass
                print("DATABASE: Successfully connected to PostgreSQL database.")
                engine_instance = create_engine(
                    SQLALCHEMY_DATABASE_URL,
                    pool_pre_ping=True,
                    pool_size=5,
                    max_overflow=10,
                    connect_args={"connect_timeout": 5}
                )
            except Exception as e:
                print(f"DATABASE WARNING: Failed to connect to PostgreSQL ({e}). Falling back to local SQLite database.")
                SQLALCHEMY_DATABASE_URL = "sqlite:///./citexa.db"

        if engine_instance is None:
            # Use SQLite engine
            if not SQLALCHEMY_DATABASE_URL:
                SQLALCHEMY_DATABASE_URL = "sqlite:///./citexa.db"
            engine_instance = create_engine(
                SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
            )

        _engine = engine_instance
        _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)

def __getattr__(name: str):
    if name == "engine":
        _initialize_db()
        return _engine
    elif name == "SessionLocal":
        _initialize_db()
        return _SessionLocal
    raise AttributeError(f"module {__name__} has no attribute {name}")

# 7. Dependency to get the database session for FastAPI routes
def get_db():
    _initialize_db()
    db = _SessionLocal()
    try:
        yield db
    finally:
        db.close()

