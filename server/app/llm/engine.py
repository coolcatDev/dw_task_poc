import asyncio
import json
from typing import List
from openai import AsyncOpenAI
from app.schemas.summary import LLMSummaryResponse
from app.llm.validator import LLMSummaryValidator
from app.db.models import Task

MAX_RETRIES = 3

class LLMSummaryEngine:
    """
    Engine to generate a summary of tasks using OpenAI LLM with structured JSON output.
    Fully stable, non-beta, validated with Pydantic and business logic.
    """

    def __init__(self, client: AsyncOpenAI):
        # Uses the client injected from FastAPI lifespan (app.state)
        self.client = client

    async def summarize(self, tasks: List[Task]) -> LLMSummaryResponse:

        # --- Prepare task prompt ---
        task_lines = [
            f"- [{'x' if t.is_done else ' '}] {t.title}: {t.description or 'No description'}"
            for t in tasks
        ]
        
        # FIX: Injecting the CRITICAL RULE into the prompt body.
        task_list_content = "\n".join(task_lines)
        
        prompt = f"""
        You are an AI assistant summarizing a user's to-do list.
        Respond ONLY in valid JSON matching the schema below:
        Fields: count, done_count, pending_count, description_done, description_pending, suggested_order_of_priority.

        CRITICAL RULE: The 'suggested_order_of_priority' list MUST contain ONLY the exact, unmodified task titles (e.g., "Stretch", not "Stretch: description"). Do not include any descriptions, numbers, or bullet points in that list.

        TASK LIST:
        {task_list_content}
        """

        # --- JSON Schema for structured output (include required 'name') ---
        json_schema = {
            "name": "task_summary",
            "schema": LLMSummaryResponse.model_json_schema()
        }

        # --- Retry loop ---
        for attempt in range(MAX_RETRIES):
            try:
                response = await self.client.chat.completions.create(
                    model="gpt-4o-2024-08-06",  # stable model + faster
                    messages=[
                        {"role": "system", "content": "You MUST respond only with valid JSON. No extra text."},
                        {"role": "user", "content": prompt},
                    ],
                    response_format={
                        "type": "json_schema",
                        "json_schema": json_schema
                    },
                    temperature=0.3
                )

                # --- Parse LLM output ---
                # string -> into a Python dictionary
                raw_content = response.choices[0].message.content
                summary_dict = json.loads(raw_content)

                # --- Pydantic validation ---
                # validate agains pydantic schema
                summary = LLMSummaryResponse(**summary_dict)

                # --- Business validation ---
                validator = LLMSummaryValidator(tasks)
                if validator.validate(summary):
                    return summary
                

                print(f"[LLM] Business validation failed on attempt {attempt+1}, retrying...")

            except (json.JSONDecodeError, ValueError) as e:
                print(f"[LLM] JSON parse / Pydantic validation failed on attempt {attempt+1}: {e}")

            except Exception as e:
                print(f"[LLM] API error on attempt {attempt+1}: {e}")

            # incremental backoff
            await asyncio.sleep(0.5 * (attempt + 1))

        # --- Fallback if all retries fail ---
        
        # Separate Tasks
        done_tasks = [t for t in tasks if t.is_done]
        pending_tasks = [t for t in tasks if not t.is_done]

        # Calculate Counts
        done_count = len(done_tasks)
        pending_count = len(pending_tasks)
        
        # Create Descriptive Fallback Text
        if pending_count > 0:
            pending_titles = [t.title for t in pending_tasks]
            pending_desc = f"[AI Summary Unavailable]: You have {pending_count} pending tasks: {', '.join(pending_titles)}."
        else:
            pending_desc = "[AI Summary Unavailable]: All tasks are complete!"

        if done_count > 0:
            done_titles = [t.title for t in done_tasks]
            done_desc = f"[AI Summary Unavailable]: You have completed {done_count} tasks: {', '.join(done_titles)}."
        else:
            done_desc = "[AI Summary Unavailable]: No tasks have been completed yet."

        # 4. Return the enhanced, data-driven fallback
        return LLMSummaryResponse(
            count=len(tasks),
            done_count=done_count,
            pending_count=pending_count,
            description_done=done_desc,
            description_pending=pending_desc,
            # Priority should only list pending tasks, ordered by their current DB ID/order
            suggested_order_of_priority=[t.title for t in pending_tasks],
        )
