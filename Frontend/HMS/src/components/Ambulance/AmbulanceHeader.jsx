import { Plus, List, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function AmbulanceHeader({
  search,
  setSearch,
  onAdd,
  onList,
}) {
  const navigate = useNavigate();
  return (
    <div className="w-full rounded-lg bg-gradient-to-b from-[#6046B5] to-[#8A63D2] p-4 md:p-6 shadow-md">
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        {/* TITLE SECTION */}
        <div>
          <h2  className="text-xl md:text-2xl font-semibold text-white">
            Ambulance Call List
          </h2>
          <p className="text-sm text-white/80">
            Manage and track ambulance service calls
          </p>
        </div>

        {/* ACTION SECTION */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full md:w-auto">
          
          {/* SEARCH */}
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search Bill No / Patient"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-md text-sm outline-none border border-gray-300 focus:ring-2 focus:ring-purple-300"
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={onAdd}
              className="flex items-center gap-1 bg-white text-[#6046B5] hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium shadow"
            >
              <Plus size={16} />
              Add Ambulance
            </button>

            <button
             
              onClick={() => navigate('/admin/ambulance-list')}
              className="flex items-center gap-1 bg-[#4B35A4] hover:bg-[#3F2D8C] text-white px-4 py-2 rounded-md text-sm shadow"
            >
              <List size={16} />
              View List
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
