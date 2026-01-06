import { Eye, Pencil, Trash2 } from "lucide-react";

export default function DeathRecordActions({ onDelete ,item, 
  onView,onEdit}) {
  return (
    <div className="flex justify-center gap-2">
      <button  onClick={() => onView(item)} className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
        <Eye size={16} />
      </button>

      <button onClick={() => onEdit(item)} className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200">
        <Pencil size={16} />
      </button>

      <button
        onClick={() => onDelete(item)}

        className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
