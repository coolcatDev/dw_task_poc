from typing import Optional
from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    is_done: bool = False

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    is_done: bool = False
    
    # metadata and configuration options for the model itself
    class Config:
        # Enables ORM Mode.
        # read data from object attributes (like a database object). 
        # instead of only looking for keys in a dictionary (like JSON).
        # -> convert the ORM object into the validated JSON response format
        from_attributes = True