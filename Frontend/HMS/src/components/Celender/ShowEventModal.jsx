import { X } from "lucide-react";

export default function ShowEventModal({ open, event, onClose, onEdit }) {
  if (!open || !event) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3" onClick={onClose}>
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h3 className="font-semibold text-lg">Event Details</h3>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4 text-sm">

          {/* TITLE */}
          <div>
            <label className="font-medium">Event Title</label>
            <p className="mt-1 p-2 border rounded bg-gray-50">{event.title || "N/A"}</p>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="font-medium">Event Description</label>
            <p className="mt-1 p-2 border rounded bg-gray-50">{event.description || "N/A"}</p>
          </div>

          {/* DATE RANGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-medium">Start Date</label>
              <p className="mt-1 p-2 border rounded bg-gray-50">{event.date ? new Date(event.date).toLocaleDateString() : "N/A"}</p>
            </div>
            <div>
              <label className="font-medium">End Date</label>
              <p className="mt-1 p-2 border rounded bg-gray-50">{event.endDate ? new Date(event.endDate).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>

          {/* TIME RANGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-medium">Start Time</label>
              <p className="mt-1 p-2 border rounded bg-gray-50">{event.start ? new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}</p>
            </div>
            <div>
              <label className="font-medium">End Time</label>
              <p className="mt-1 p-2 border rounded bg-gray-50">{event.end ? new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}</p>
            </div>
          </div>

          {/* COLOR */}
          <div>
            <label className="font-medium">Event Color</label>
            <div className="mt-1 flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full border"
                style={{ backgroundColor: event.color || "#2563EB" }}
              ></div>
              <span>{event.color || "#2563EB"}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded"
          >
            Edit
          </button>
        </div>

      </div>
    </div>
  );
}