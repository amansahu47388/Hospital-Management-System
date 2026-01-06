import { Plus, Search } from "lucide-react";

export default function DeathRecordHeader({ search, setSearch, setOpenModal }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      <h2 className="text-black text-xl font-semibold">Death Record</h2>

      <div className="flex gap-2 w-full md:w-auto">
        

        <button onClick={() => setOpenModal(true)} className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center gap-1 text-sm">
          <Plus size={16} /> Add Death Record
        </button>
      </div>
    </div>
  );
}
