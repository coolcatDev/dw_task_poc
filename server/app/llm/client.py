from fastapi import Request
from openai import AsyncOpenAI

def get_llm_client(request: Request) -> AsyncOpenAI:
    """Provides the single, application-scoped AsyncOpenAI client from app state."""
    return request.app.state.llm_client