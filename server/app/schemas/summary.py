from pydantic import BaseModel, Field
from typing import List

class LLMSummaryResponse(BaseModel):
    count: int = Field(..., description="Total number of tasks provided")
    done_count: int = Field(..., description="Number of completed tasks")
    pending_count: int = Field(..., description="Number of incomplete tasks")
    description_done: str = Field(..., description="LLM-generated summary of completed tasks")
    description_pending: str = Field(..., description="LLM-generated summary of pending tasks")
    suggested_order_of_priority: List[str] = Field(
        ..., description="List of task titles ordered by suggested priority"
    )
