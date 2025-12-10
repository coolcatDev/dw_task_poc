from sqlmodel import create_engine, SQLModel, Session
from app.config import settings
from typing import Generator

# Create the SQLite engine.
engine = create_engine(
    settings.DATABASE_URL, 
    echo=False,
    connect_args={"check_same_thread": False}
)

def create_db_and_tables():
    """Creates the database file and all tables defined by SQLModel classes."""
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """Provides a new database session for each request."""
    with Session(engine) as session:
        yield session