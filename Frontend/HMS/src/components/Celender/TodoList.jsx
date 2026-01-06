import { Plus, Trash2 } from "lucide-react";

export default function TodoList({ tasks, onAddClick, onDelete }) {
  return (
    <div className="bg-white rounded shadow p-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">To Do List</h3>
        <button
          onClick={onAddClick}
          className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white p-1 rounded"
        >
          <Plus size={16} />
        </button>
      </div>

      <ul className="space-y-2 text-sm">
        {tasks.map((t) => (
          <li key={t.id} className="flex justify-between items-center">
            <div>
              <p className="text-orange-600">{t.title}</p>
              <span className="text-xs text-gray-500">{t.date}</span>
            </div>
            <Trash2
              size={14}
              className="cursor-pointer text-gray-400 hover:text-red-500"
              onClick={() => onDelete(t.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
