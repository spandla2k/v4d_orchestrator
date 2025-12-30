import "./App.css";
import TaskList from "./components/TaskList";
import taskd from "./data/tasks.json";
import { useState, useEffect } from "react";
import TaskModal from "./components/TaskModal";

function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [parentTask, setParentTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch("http://localhost:8000/tasks");
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks);
      } else {
        console.error("Failed to fetch tasks");
      }
    };

    fetchTasks();
  }, []);

  const handleCreate = async (taskData) => {
    const res = await fetch("http://localhost:8000/tasks/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: taskData.name,
        prompt: taskData.prompt,
        scheduled_time: taskData.scheduledFor || null,
        parent_id: taskData.parent_id || null,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const createdTask = data.task;
      setTasks((prevTasks) => [createdTask, ...prevTasks]);
      setShowModal(false);
    } else {
      console.error("Failed to create task");
    }
  };

  const handleCreateChildTask = (parentTask) => {
    setParentTask(parentTask);
    setShowModal(true);
  };

  // const handleCreate = (taskData) => {
  //   const newTask = {
  //     id: tasks.length + 1,
  //     name: taskData.name,
  //     prompt: taskData.prompt,
  //     status: "pending",
  //     created_at: new Date().toISOString(),
  //     scheduled_time: taskData.scheduledFor || null,
  //     result: null,
  //   };

  //   setTasks((prevTasks) => [newTask, ...prevTasks]);
  //   console.log("Task Created:", taskData);
  //   setShowModal(false);
  // };

  return (
    <>
      <div>
        <h1>Task Orchestrator</h1>
        <button className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setShowModal(true)}>
          New Task
        </button>
      </div>
      <TaskModal open={showModal} onClose={() => setShowModal(false)} onSubmit={handleCreate} parentTask={parentTask} />
      <div className="container mx-auto p-4">
        <TaskList tasks={tasks} onCreateChildTask={handleCreateChildTask} />
      </div>
    </>
  );
}

export default App;
