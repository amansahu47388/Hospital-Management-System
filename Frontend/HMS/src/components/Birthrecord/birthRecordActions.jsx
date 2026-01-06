import { Eye, Pencil, Trash2 } from "lucide-react";

export default function BirthRecordActions({ onView, onEdit, onDelete ,item}) {
  return (
    <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition duration-300">
      <Eye
        className="w-4 h-4 text-blue-600 cursor-pointer"
        title="Show"
        onClick={() => onView(item)}
      />
      <Pencil
        className="w-4 h-4 text-green-600 cursor-pointer"
        title="Edit"
        onClick={() => onEdit(item)}
      />
      <Trash2
        className="w-4 h-4 text-red-600 cursor-pointer"
        title="Delete"
       onClick={() => onDelete(item)}
      />
    </div>
  );
}
