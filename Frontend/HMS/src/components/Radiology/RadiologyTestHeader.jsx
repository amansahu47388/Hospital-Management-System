import { Plus } from "lucide-react";

export default function RadiologyTestHeader({ search, setSearch, onAdd }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">

      <h2 className="text-xl font-semibold text-white">
        Radiology Test
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded border text-sm"
        />

        <button
           onClick={onAdd}
          className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded flex items-center gap-1"
        >
          <Plus size={16} />
          Add Radiology Test
        </button>
      </div>
    </div>
  );
}
