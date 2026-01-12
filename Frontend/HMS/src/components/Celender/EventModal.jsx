import { X } from "lucide-react";
import { useState, useEffect } from "react";

const COLORS = [
  "#2563EB", // blue
  "#EC4899", // pink
  "#6B7280", // gray
  "#7C3AED", // purple
  "#16A34A", // green
  "#F97316", // orange
  "#EF4444", // red
];

export default function EventModal({ open, event, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(event);

  useEffect(() => {
    if (event) {
      setForm(event);
    }
  }, [event]);

  if (!open || !form) return null;

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  const handleDelete = () => {
    onDelete(form.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h3 className="font-semibold text-lg">Edit Event</h3>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 text-sm">

          {/* TITLE */}
          <div>
            <label className="font-medium">Event Title *</label>
            <input
              className="w-full border px-3 py-2 rounded mt-1"
              value={form.title || ""}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-medium">Event Description</label>
            <textarea
              className="w-full border px-3 py-2 rounded mt-1"
              rows="3"
              value={form.description || ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* DATE RANGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-medium">Start Date *</label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded mt-1"
                value={form.date || ""}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="font-medium">End Date</label>
              <input
                type="date"
                className="w-full border px-3 py-2 rounded mt-1"
                value={form.endDate || ""}
                onChange={(e) =>
                  setForm({ ...form, endDate: e.target.value })
                }
              />
            </div>
          </div>

          {/* TIME RANGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-medium">Start Time *</label>
              <input
                type="time"
                className="w-full border px-3 py-2 rounded mt-1"
                value={form.start ? new Date(form.start).toTimeString().slice(0,5) : ""}
                onChange={(e) => {
                  const time = e.target.value;
                  const dateTime = form.date ? `${form.date}T${time}` : "";
                  setForm({ ...form, start: dateTime });
                }}
              />
            </div>
            <div>
              <label className="font-medium">End Time *</label>
              <input
                type="time"
                className="w-full border px-3 py-2 rounded mt-1"
                value={form.end ? new Date(form.end).toTimeString().slice(0,5) : ""}
                onChange={(e) => {
                  const time = e.target.value;
                  const dateTime = form.endDate ? `${form.endDate}T${time}` : form.date ? `${form.date}T${time}` : "";
                  setForm({ ...form, end: dateTime });
                }}
              />
            </div>
          </div>

          {/* COLOR */}
          <div>
            <label className="font-medium block mb-1">Event Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <span
                  key={c}
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-6 h-6 rounded-full cursor-pointer border-2
                    ${form.color === c ? "border-black" : "border-gray-300"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}