from typing import List
from app.schemas.summary import LLMSummaryResponse
from app.db.models import Task

class LLMSummaryValidator:

    def __init__(self, tasks: List[Task]):
        self.tasks = tasks

    def validate(self, data: LLMSummaryResponse) -> bool:
        """Check that the LLM counts match the real task list."""

        total_tasks = len(self.tasks)
        done_tasks = sum(1 for t in self.tasks if t.is_done)
        pending_tasks = total_tasks - done_tasks

        # Validate counts
        if data.count != total_tasks:
            return False
        if data.done_count != done_tasks:
            return False
        if data.pending_count != pending_tasks:
            return False

        # Validate suggested_order_of_priority contains only actual tasks
        task_titles = {t.title for t in self.tasks}
        for title in data.suggested_order_of_priority:
            if title not in task_titles:
                return False

        return True
