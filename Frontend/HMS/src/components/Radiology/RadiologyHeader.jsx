import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function RadiologyHeader({ search, setSearch,  }) {
    const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <h2 className="text-xl font-semibold text-black">
        Radiology Bill
      </h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {/* ✅ CONNECTED BUTTON */}
          <button
            onClick={() => navigate("/admin/radiology/Generate")}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded text-sm flex items-center gap-1"
          >
            <Plus size={16} />
            Generate Bill
          </button>

          <button onClick={() => navigate("/admin/radiology-tests")} className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded text-sm">
            Radiology Test
          </button>
        </div>
      </div>
    </div>
  );
}
