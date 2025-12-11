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
        prompt = (
            "You are an AI assistant summarizing a user's to-do list.\n"
            "Respond ONLY in valid JSON matching the schema below:\n"
            "Fields: count, done_count, pending_count, description_done, description_pending, suggested_order_of_priority.\n\n"
            "TASK LIST:\n" + "\n".join(task_lines)
        )

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
        done_count = sum(1 for t in tasks if t.is_done)
        pending_count = len(tasks) - done_count
        return LLMSummaryResponse(
            count=len(tasks),
            done_count=done_count,
            pending_count=pending_count,
            description_done="Fallback: summary unavailable",
            description_pending="Fallback: summary unavailable",
            suggested_order_of_priority=[t.title for t in tasks],
        )
