import { X } from "lucide-react";
import { useState } from "react";

export default function AddTaskModal({ open, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-lg rounded shadow">

        <div className="flex justify-between items-center px-4 py-3
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h3>Add Task</h3>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        <div className="p-4 space-y-3">
          <input
            placeholder="Title"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end p-4 border-t">
          <button
            onClick={() => {
              onSave({ title, date });
              onClose();
            }}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
