from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.lifespan import main_lifespan
from app.routes import tasks, summary
import logging

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- FastAPI App Setup ---
app = FastAPI(
    title="LLM Task List API",
    version="1.0.0",
    description="A concise FastAPI service with SQLite and an LLM summarization feature.",
    lifespan=main_lifespan
)

# --- CORS Middleware ---

# Split the string into a list of origins
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger.info(f"CORS middleware configured for origins: {origins}")


# Include API routers
app.include_router(tasks.router, prefix="/api/v1")
app.include_router(summary.router, prefix="/api/v1")
logger.info("API routers added successfully.")

@app.get("/", tags=["Healthcheck"])
async def read_root():
    return {"status": "ok", "message": "Welcome to the LLM Task List API. Go to /docs for API documentation."}

