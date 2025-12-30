from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
class CreateTask(BaseModel):
    name: str = Field(..., description="Name of the task")
    prompt: str = Field(..., description="Prompt for the task")
    scheduled_time: Optional[datetime] = Field(None, description="Schedule time for the task")
    parent_id: Optional[int] = Field(None, description="Parent task ID")




class TaskResponse(BaseModel):
    id: int
    name: str
    prompt: str
    status: str
    created_at: datetime
    updated_at: datetime
    result: Optional[str]
    scheduled_time: datetime
    parent_id: Optional[int]
    finished_at: Optional[datetime]

class CreateTaskResponse(BaseModel):
    message: str
    task: TaskResponse

class ListTasksResponse(BaseModel):
    tasks: List[TaskResponse]