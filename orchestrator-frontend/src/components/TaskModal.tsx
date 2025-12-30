import { useState } from "react";

type TaskModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; prompt: string; scheduledFor?: string; parent_id?: number }) => void;
  parentTask?: Task | null;
};

const getNowForDatetimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const TaskModal = ({ open, onClose, onSubmit, parentTask }: TaskModalProps) => {
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [scheduledFor, setScheduledFor] = useState(getNowForDatetimeLocal());

  if (!open) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
      <div className="relative bg-white p-6 rounded shadow-lg w-full max-w-md">
        <button onClick={onClose} aria-label="Close modal" className="absolute bg-white top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold button-bg">
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Task Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" placeholder="MorseCode gen" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Prompt</label>
          <textarea
            value={prompt}
            placeholder="Convert this to morsecode: Come home soon"
            onChange={(e) => {
              console.log(e.target.value);
              setPrompt(e.target.value);
            }}
            className="w-full p-2 border rounded"
            required
          ></textarea>
        </div>
        {parentTask && (
          <div className="mb-4 p-2 bg-gray-100 rounded">
            <p className="text-sm text-gray-700">
              <strong>Input:</strong> Result from {parentTask.name}
            </p>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Run At</label>
          <input type="datetime-local" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} className="w-full p-2 border rounded" required></input>
        </div>
        <button onClick={() => onSubmit({ name, prompt, scheduledFor: scheduledFor || new Date().toISOString(), parent_id: parentTask?.id })} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Create Task
        </button>
      </div>
    </div>
  );
};

export default TaskModal;
