from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.db.models import Task
from app.db.database import get_session
from app.llm.client import get_llm_client
from app.llm.service import generate_task_summary
from app.schemas.summary import LLMSummaryResponse

router = APIRouter(
    prefix="/llm",
    tags=["LLM Feature"]
)

@router.post("/summary", response_model=LLMSummaryResponse)
async def get_task_summary_endpoint(
    db: Session = Depends(get_session),
    llm_client = Depends(get_llm_client)
):
    tasks = db.exec(select(Task)).all()
    summary = await generate_task_summary(tasks, llm_client)
    return summary