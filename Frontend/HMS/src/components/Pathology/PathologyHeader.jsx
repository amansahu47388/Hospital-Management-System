import React  from "react";
import { useNavigate } from "react-router-dom";
 export default function PathologyHeader({ search, setSearch }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <h1 className="text-xl font-semibold text-white">Pathology Bill</h1>

      <div className="flex gap-2">
        

        <button  onClick={() => navigate("/admin/pathology-bill/generate-bill")} className="bg-white text-[#6046B5] px-3 py-2 rounded text-sm font-medium">
          + Generate Bill
        </button>

         <button onClick={() => navigate("/admin/pathology-tests")} className="bg-white text-[#6046B5] px-3 py-2 rounded text-sm font-medium">
          Pathology Test
        </button>

        


      </div>
    </div>
  );
}
