import logging
from contextlib import asynccontextmanager, AsyncExitStack
from fastapi import FastAPI
from app.db.database import create_db_and_tables

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
async def main_lifespan(app: FastAPI):
    """Combined main lifespan using AsyncExitStack."""
    logger.info("Main Lifespan: Entering application startup sequence...")
    async with AsyncExitStack() as stack:
        try:
            # Initialize persistence layer
            await stack.enter_async_context(db_lifespan(app))

            logger.info("Main Lifespan: All resources initialized. Application ready.")
            yield 
        
        except Exception as e:
            logger.exception("Main Lifespan: CRITICAL - Failure during startup phase.")
            raise e 
        
        finally:
            logger.info("Main Lifespan: Application shutdown sequence complete.")