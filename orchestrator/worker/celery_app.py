from datetime import UTC, datetime
from celery import Celery
from sqlalchemy import func

from worker.llm_api import call_openai_api
celery_app = Celery('worker', broker='redis://localhost:6379/2', backend='redis://localhost:6379/2')


from app.db import SessionLocal
from app.models import Tasks
from sqlalchemy import select

celery_app.conf.timezone = 'UTC'
celery_app.conf.result_expires = 20




celery_app.conf.beat_schedule = {
    'add-every-5-seconds': {
        'task': 'worker.celery_app.enqueue_tasks',
        'schedule': 5.0,
    },
}

@celery_app.task
def enqueue_tasks():
    print("Enqueuing pending tasks...")
    
    
    db = SessionLocal()
    with db as session:
        pending_tasks = session.execute(
            select(Tasks).where(Tasks.status == "pending",
                                 Tasks.scheduled_time <= datetime.now(UTC))
        ).scalars().all()

        for task in pending_tasks:
            # Here you would enqueue the actual processing task
            print(f"Enqueuing task {task.id} - {task.name}")
            # For demonstration, we just update the status to 'queued'
            celery_app.send_task('worker.celery_app.execute_task', args=[task.id])
            task.status = "queued"
            session.add(task)
        session.commit() 

@celery_app.task
def execute_task(taksk_id):
    from app.db import SessionLocal
    from app.models import Tasks

    db = SessionLocal()
    try:
        task = db.get(Tasks, taksk_id)
        if not task:
            print(f"Task with id {taksk_id} not found")
            return
        if "FAIL_ME" in task.prompt:
            raise RuntimeError("Forced failure for testing")


        input_data = ""
        if task.parent_id:
            parent_task = db.get(Tasks, task.parent_id)
            if parent_task and parent_task.result:
                input_data = parent_task.result

        # Simulate task processing
        prompt = f"prompt: {task.prompt} \\n inout: {input_data}"
        response = call_openai_api(prompt)
        print(f"Executing task {task.id} - {task.name}")

        task.status = "completed"
        task.result = response
        task.finished_at = datetime.now(UTC)
        db.add(task)
        db.commit()
    except Exception as e:
        print(f"Error executing task {taksk_id}: {e}")
        if task:
            task.status = "failed"
            db.add(task)
            db.commit()
    finally:
        db.close()


# if __name__ == "__main__":
#     import sys

#     if len(sys.argv) != 2:
#         print("Usage: python -m app.worker.execute <task_id>")
#         sys.exit(1)

#     execute_task(int(sys.argv[1]))