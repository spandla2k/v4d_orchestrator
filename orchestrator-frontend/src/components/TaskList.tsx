type Taskx = {
  id: number;
  name: string;
  prompt: string;
  status: TaskStatus;
  created_at: string;
  start_at?: string;
  result?: string;
};

type Task = {
  id: number;
  name: string;
  prompt: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
  result?: string;
  scheduled_time?: string;
  parent_id?: number;
  finished_at?: string;
};

type TaskStatus = "pending" | "queued" | "running" | "completed" | "failed";

const statusStyles = {
  pending: "bg-gray-100 border-gray-300",
  queued: "bg-blue-50 border-blue-300",
  running: "bg-yellow-50 border-yellow-300",
  completed: "bg-green-50 border-green-300",
  failed: "bg-red-50 border-red-300",
};

type TaskListProps = {
  tasks: Task[];
  onCreateChildTask: (parentTask: Task) => void;
};

const TaskList = ({ tasks, onCreateChildTask }: TaskListProps) => {
  return (
    <div className="max-w-2xl mx-auto mt-8 ">
      <h2 className="text-xl font-bold mb-4">Task List</h2>
      {tasks.map((task) => (
        <div key={task.id} className={`p-4 border rounded shadow-md rounded-xl p-6 shadow-lg outline outline-black/5  mb-4 ${statusStyles[task.status]}`}>
          <h4 className="text-lg font-semibold">{task.name}</h4>
          <p className="text-gray-700">{task.prompt}</p>
          <p className="text-sm text-gray-500">Status: {task.status}</p>
          <p className="text-sm text-gray-500">Created At: {new Date(task.created_at).toLocaleString()}</p>
          {task.scheduled_time && <p className="text-sm text-gray-500">Scheduled For: {new Date(task.scheduled_time).toLocaleString()}</p>}
          <p className="text-sm text-gray-500">Result: {task.result || "N/A"}</p>
          <p className="text-sm text-gray-500">Finished At: {task.finished_at ? new Date(task.finished_at).toLocaleString() : "N/A"}</p>
          <button onClick={() => onCreateChildTask(task)} className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            Use Output as New Task Input
          </button>
        </div>
      ))}
    </div>
    // <ul>
    //   {tasks.map((task) => (
    //     <li key={task.id}>
    //       {task.id} - {task.name}
    //     </li>
    //   ))}
    // </ul>
  );
};
export default TaskList;
