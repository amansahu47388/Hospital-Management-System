import { X } from "lucide-react";
import { useState } from "react";

const COLORS = [
  "#2563EB", // blue
  "#EC4899", // pink
  "#6B7280", // gray
  "#7C3AED", // purple
  "#16A34A", // green
  "#F97316", // orange
  "#EF4444", // red
];

export default function AddTaskModal({ open, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [description, setDescription] = useState("");

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
          <label className="font-medium">Event Title *</label>
          <input
            placeholder="Title"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="font-medium">Start Date *</label>
          <input
            type="date"
            placeholder="Date"
            className="w-full border px-3 py-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <label className="font-medium">End Date (optional) *</label>
          <input
            type="date"
            placeholder="End Date (optional)"
            className="w-full border px-3 py-2 rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <label className="font-medium">Start Time *</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="time"
              placeholder="Start Time"
              className="border px-3 py-2 rounded"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <label className="font-medium">End Time *</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="time"
              placeholder="End Time"
              className="border px-3 py-2 rounded"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
          <textarea
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div>
            <label className="block mb-1">Color</label>
            <div className="flex gap-2">
              {COLORS.map((c) => (
                <span
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full cursor-pointer border-2 ${color === c ? "border-black" : "border-gray-300"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t">
          <button
            onClick={() => {
              const startDateTime = date && start ? `${date}T${start}` : "";
              const endDateTime = (endDate || date) && end ? `${endDate || date}T${end}` : "";
              onSave({ title, date, endDate: endDate || date, start: startDateTime, end: endDateTime, color, description });
              onClose();
              setTitle("");
              setDate("");
              setEndDate("");
              setStart("");
              setEnd("");
              setColor(COLORS[0]);
              setDescription("");
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
