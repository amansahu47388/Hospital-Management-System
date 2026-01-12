import { Eye, Pencil, Trash2 } from "lucide-react";

export default function ActionButtons({ row, onShow, onEdit, onDelete }) {
  return (
    <div className="flex gap-2 justify-center">
      <Eye
        size={16}
        className="cursor-pointer text-blue-600"
        onClick={() => onShow(row)}
      />

      <Pencil
        size={16}
        className="cursor-pointer text-green-600"
        onClick={() => onEdit(row)}
      />

      <Trash2
        size={16}
        className="cursor-pointer text-red-500"
        onClick={() => onDelete(row.id)}
      />
    </div>
  );
}
