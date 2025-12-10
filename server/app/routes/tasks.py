from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.db.database import get_session
from app.db.models import Task
from app.schemas.task import TaskCreate, TaskResponse

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task_endpoint(
    task_in: TaskCreate,
    db: Session = Depends(get_session)
):
    """Create a new task."""
    db_task = Task.model_validate(task_in)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[TaskResponse])
def read_tasks_endpoint(
    db: Session = Depends(get_session)
):
    """Retrieve all tasks."""
    return db.exec(select(Task)).all()

@router.put("/{task_id}", response_model=TaskResponse)
def update_task_endpoint(
    task_id: int,
    task_in: TaskCreate,
    db: Session = Depends(get_session)
):
    """Update an existing task."""
    db_task = db.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_task.sqlmodel_update(task_in.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task_endpoint(
    task_id: int,
    db: Session = Depends(get_session)
):
    """Delete a task by ID."""
    db_task = db.get(Task, task_id)
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return