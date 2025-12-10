from fastapi import FastAPI

# --- FastAPI App Setup ---
app = FastAPI(
    title="LLM Task List API",
    version="1.0.0",
    description="A concise FastAPI service with SQLite and an LLM summarization feature.",
)

@app.get("/", tags=["Healthcheck"])
async def read_root():
    return {"status": "ok", "message": "Welcome to the LLM Task List API. Go to /docs for API documentation."}

