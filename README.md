# 🚀 Full-Stack Task Manager with AI Summarization

This project is a full-stack application demonstrating a Task Manager with a **FastAPI** backend, a **React/Vite** frontend, and **OpenAI API** integration for task summarization.

## ⚡ Quick Start

Follow these steps to get the application running quickly using Docker Compose.

1.  **Configure Environment Variables**
    * Rename the template file:
        ```bash
        cp .env.template .env
        ```
    * Add your OpenAI API key to the new `.env` file:
        ```ini
        OPENAI_API_KEY=*****
        ```

2.  **Build and Run**
    * Run both the server and client containers for the first time:
        ```bash
        docker-compose up --build -d
        ```
    * For subsequent runs (if containers are already built):
        ```bash
        docker-compose up -d
        ```

3.  **Stop Containers**
    * To stop and remove the containers and network:
        ```bash
        docker-compose down
        ```

---

## 💻 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend Framework** | FastAPI | Async-first, ideal for mixed I/O (DB + OpenAI API). |
| **ORM** | SQLModel | Type-safe models, tight integration with Pydantic. |
| **Database** | SQLite | Simple, file-based database used for local Proof-of-Concept (POC). |
| **Data Validation** | Pydantic | Used for API request/response validation and LLM output schemas. |
| **LLM Integration** | OpenAI Python SDK | Integrated via a reusable client wrapper with robust engine logic. |
| **Frontend** | React + Vite | Modern, fast client-side development. |
| **Containerization** | Docker | Used for both the server and client environments. |

---

## 🏗️ Architecture Overview

The application consists of two primary services (`server` and `client`) running via Docker Compose.

### Key Backend Components

1.  **Lifespan Context Manager**
    * The application uses an `asynccontextmanager` to centralize and manage resource initialization and cleanup (e.g., initializing the async SQLModel engine and setting up a reusable OpenAI client). This ensures deterministic startup and proper shutdown.

2.  **Robust LLM Summarization Pipeline**
    * The LLM subsystem is designed for reliability and includes several layers:
        * **Retry Logic:** Implemented in the engine to handle transient API failures.
        * **Pydantic Validation:** Strict schema validation of the LLM's output is performed to catch potential hallucinations or schema violations.
        * **Graceful Fallback:** If the OpenAI API ultimately fails, the system provides deterministic placeholder data, ensuring the API always responds successfully.

### Key Frontend Components

1.  **Centralized API Wrapper (`useTaskApi.js`)**
    * A custom hook encapsulates all API interaction logic (CRUD, summary fetch, error handling, notifications), decoupling the UI components from the underlying API client.

2.  **Simple State Management**
    * The application opts for simplicity by **refetching the entire task list** after any Create, Update, or Delete operation. This avoids complex local state synchronization logic, ensuring maximum consistency for a demo application.

---

## ⚖️ Key Design Decisions & Trade-offs

| Decision | Rationale/Benefit | Trade-off/Limitation |
| :--- | :--- | :--- |
| **FastAPI Choice** | Async-first design is an ideal fit for I/O-bound workloads mixing DB interaction and external API calls (OpenAI). | N/A |
| **Robust LLM Engine** | Separated concerns (client, engine, validator, service) ensures production-quality reliability for AI integration. | Adds complexity compared to a single naive API call. |
| **No Caching Layer (e.g., Redis)** | Avoided to prevent invalidation complexity and cross-layer coupling. | No speed benefit for repeated summary requests; dramatically simpler architecture. |
| **Simple Client State Model** | Refreshing the full list after CRUD ensures a consistent UI and avoids complex state reconciliation. | Inefficient due to increased network round-trips; perfect for a POC. |
| **Single Global CSS (`App.css`)** | Keeps the repository simple and readable. | Not scalable for large applications. |
| **Docker Anonymous Volume** | Mounts `/app/node_modules` for hot reloading, ensuring dependencies live inside the container. | An empty `node_modules` directory appears on the host side (benign). |
| **Client-Only Dev Approach** | Avoids complexity of server-side rendering (Jinja2, Nginx sidecar) and associated DevOps complexity. | Client runs as its own container, simple and isolated. |
| **Docker-First Environment** | Provides consistency, prevents global dependency pollution, and ensures reliable onboarding. | Requires using Docker and Docker Compose. |
