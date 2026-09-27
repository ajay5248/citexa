import os
import sys
import threading
import time
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

        # 3. Handle Database Engine Creation.
        # On Render the local disk is wiped on every deploy/restart, so a SQLite fallback loses all
        # users, audits and leads. It's only allowed until REQUIRE_DATABASE=true is set, and /health
        # reports which database is in use. SQLite is the normal choice for local development.
        engine_instance = None
        if SQLALCHEMY_DATABASE_URL and not SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
            engine_instance = create_engine(
                SQLALCHEMY_DATABASE_URL,
                pool_pre_ping=True,
                pool_size=5,
                max_overflow=10,
                connect_args={"connect_timeout": 10}
            )
            last_error = None
            for attempt in range(1, 4):
                try:
                    with engine_instance.connect():
                        pass
                    print("DATABASE: Successfully connected to PostgreSQL database.")
                    last_error = None
                    break
                except Exception as e:
                    last_error = e
                    print(f"DATABASE: PostgreSQL connection attempt {attempt}/3 failed: {e}")
                    time.sleep(2 * attempt)
            if last_error is not None:
                # Once production has a working database, set REQUIRE_DATABASE=true so an outage
                # stops the app instead of silently running on a temporary SQLite file.
                if os.getenv("REQUIRE_DATABASE", "").lower() == "true":
                    raise RuntimeError(
                        "Could not connect to the PostgreSQL database in DATABASE_URL. "
                        "Refusing to fall back to SQLite, which would lose data on every deploy."
                    ) from last_error
                print("DATABASE WARNING: PostgreSQL unreachable; using a TEMPORARY SQLite file. "
                      "Data will be lost on restart. Fix DATABASE_URL, then set REQUIRE_DATABASE=true.")
                engine_instance = None
                SQLALCHEMY_DATABASE_URL = "sqlite:///./citexa.db"

        if engine_instance is None:
            # Local development: SQLite file next to the backend
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

