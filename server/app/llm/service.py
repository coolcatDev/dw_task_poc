from typing import List
from openai import AsyncOpenAI
from app.db.models import Task
from app.llm.engine import LLMSummaryEngine
from app.schemas.summary import LLMSummaryResponse

async def generate_task_summary(tasks: List[Task], client: AsyncOpenAI) -> LLMSummaryResponse:
    engine = LLMSummaryEngine(client)
    return await engine.summarize(tasks)
