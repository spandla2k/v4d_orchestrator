from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.db import SessionLocal, get_db
from app.models import Tasks
from app.schema import CreateTask, CreateTaskResponse, ListTasksResponse
from sqlalchemy.orm import Session
from sqlalchemy import select



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Create database tables
    from app.db import Base, engine
    Base.metadata.create_all(bind=engine)
    print("Database tables created")

@app.post("/tasks/create", response_model=CreateTaskResponse)
def create_task(payload: CreateTask, db: Session = Depends(get_db)):
    # Logic to create a task
    # Create task in database
    task = Tasks(
        name=payload.name,
        prompt=payload.prompt,
        scheduled_time=payload.scheduled_time,
        parent_id=payload.parent_id
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return {"message": "Task created", "task": task}

@app.get("/tasks/", response_model=ListTasksResponse)
def list_tasks(db: Session = Depends(get_db)):
    # Logic to list tasks
    with db as session:
        tasks = session.execute(select(Tasks).order_by(Tasks.id.desc())).scalars().all()
    return {"tasks": tasks}
