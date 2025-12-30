from datetime import datetime, timezone
from app.db import Base
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column
class Tasks(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    prompt = Column(String)
    status: Mapped[str ]= mapped_column(String, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    result :Mapped[str] = mapped_column(String, nullable=True)
    scheduled_time = Column(DateTime(timezone=True), server_default=func.now())
    parent_id=Column(Integer, ForeignKey('tasks.id'), nullable=True)
    finished_at :Mapped[datetime]= mapped_column(DateTime(timezone=True), nullable=True)

    class Config:
        from_attributes = True

    def __repr__(self):
        return f"<Task(id={self.id}, name={self.name}, status={self.status})>"
