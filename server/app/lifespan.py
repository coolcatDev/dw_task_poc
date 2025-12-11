import logging
from contextlib import asynccontextmanager, AsyncExitStack
from fastapi import FastAPI
from openai import AsyncOpenAI
from app.db.database import create_db_and_tables
from app.config import settings

logger = logging.getLogger(__name__)

@asynccontextmanager
async def db_lifespan(app: FastAPI):
    """Initializes database tables (synchronous)."""
    logger.info("Lifespan: Initializing database and creating tables...")
    create_db_and_tables() 
    try:
        yield 
    finally:
        logger.info("Lifespan: Database cleanup complete.")

@asynccontextmanager
async def llm_client_lifespan(app: FastAPI):
    """Initializes and closes the reusable AsyncOpenAI client (AsyncExitStack context)."""
    logger.info("Lifespan: Initializing AsyncOpenAI client...")
    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    app.state.llm_client = client
    try:
        yield
    finally:
        logger.info("Lifespan: Closing AsyncOpenAI client...")
        if hasattr(app.state, 'llm_client') and app.state.llm_client:
            await app.state.llm_client.close()

@asynccontextmanager
async def main_lifespan(app: FastAPI):
    """Combined main lifespan using AsyncExitStack."""
    logger.info("Main Lifespan: Entering application startup sequence...")
    async with AsyncExitStack() as stack:
        try:
            # Initialize external resource first
            await stack.enter_async_context(llm_client_lifespan(app))
            # Initialize persistence layer
            await stack.enter_async_context(db_lifespan(app))

            logger.info("Main Lifespan: All resources initialized. Application ready.")
            yield 
        
        except Exception as e:
            logger.exception("Main Lifespan: CRITICAL - Failure during startup phase.")
            raise e 
        
        finally:
            logger.info("Main Lifespan: Application shutdown sequence complete.")