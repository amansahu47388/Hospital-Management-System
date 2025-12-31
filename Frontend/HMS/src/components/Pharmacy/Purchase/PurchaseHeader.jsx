import { Plus } from "lucide-react";

export default function PurchaseHeader({ onAdd }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h2 className="text-xl font-semibold text-black">
        Medicine Purchase List
      </h2>

      <button
        onClick={onAdd}
        className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                   text-white px-3 py-2 rounded text-sm
                   hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus size={16} />
        Purchase Medicine
      </button>
    </div>
  );
}
