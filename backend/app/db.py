from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

from .config import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME

# Use SQLite for development if PostgreSQL is not available
USE_SQLITE = os.getenv("USE_SQLITE", "true").lower() == "true"

if USE_SQLITE:
    DATABASE_URL = "sqlite:///./adahack2025.db"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},  # Only for SQLite
        future=True,
    )
else:
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(
        DATABASE_URL,
        future=True,
        pool_pre_ping=True,
    )

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
    future=True,
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
