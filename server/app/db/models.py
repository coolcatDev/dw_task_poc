from typing import Optional
from sqlmodel import Field, SQLModel

class Task(SQLModel, table=True):
    """
    Database model for a single task.

    This class defines the SQL table structure.
    
    Setting 'table=True' registers this Task class and its fields
    with the global SQLModel.metadata object, allowing the application
    to create the physical table upon startup.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    description: Optional[str] = None
    is_done: bool = Field(default=False)