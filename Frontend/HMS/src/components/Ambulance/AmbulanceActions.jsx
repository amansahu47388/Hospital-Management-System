import { Eye, Pencil, Trash2, Printer } from "lucide-react";

export default function AmbulanceActions({ onView, onEdit, onDelete, onPrint }) {
  return (
    <div className="flex items-center gap-2">
      {/* VIEW */}
      <button
        onClick={onView}
        title="View"
        className="p-1 rounded hover:bg-blue-100 text-blue-600"
      >
        <Eye size={16} />
      </button>

      {/* EDIT */}
      <button
        onClick={onEdit}
        title="Edit"
        className="p-1 rounded hover:bg-green-100 text-green-600"
      >
        <Pencil size={16} />
      </button>

      {/* PRINT */}
      <button
        onClick={onPrint}
        title="Print"
        className="p-1 rounded hover:bg-purple-100 text-purple-600"
      >
        <Printer size={16} />
      </button>

      {/* DELETE */}
      <button
        onClick={onDelete}
        title="Delete"
        className="p-1 rounded hover:bg-red-100 text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
