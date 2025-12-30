## Run locally

# Vinci4D Orchestrator

Task orchestration system built with:

- FastAPI
- Celery
- Redis
- Postgres
- React
- Docker

## Quick Start

Requirements:

- Docker
- Docker Compose

```bash
git clone <repo>
cd v4d_orchestrator
cp .env.example .env
#Edit .env and add your OpenAI API key (optional):
docker compose up --build
docker compose up --build



Frontend: http://localhost:5174
API docs: http://localhost:8000/docs

Example: Chained Tasks
taks1: Prompt: Create a morse code for the following: "Come Home Soon"
taks2 [taks1 output]:  Prompt: Convert the morse code into text


Notes:

If OPENAI_API_KEY is not set, the system will fall back to a mock LLM response (for local development).

Redis is used as the Celery broker and result backend.

PostgreSQL is used for task persistence.

Celery workers and beat scheduler are started automatically via Docker Compose.

```
