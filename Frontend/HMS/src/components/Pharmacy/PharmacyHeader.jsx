import React from "react";
import { useNavigate } from "react-router-dom";
export default function PharmacyHeader({ search, setSearch, limit, setLimit }) {                        
  const navigate = useNavigate(); 
  return (
    <div className="border-b bg-white px-4 py-3">

      <div  className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Pharmacy Bill
        </h2>

        <div className="flex gap-2">
          <button  onClick={() => navigate("/admin/pharmacy-bill/generate-bill")} className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
            + Generate Bill
          </button>

          <button onClick={() => navigate("/admin/pharmacy-bill/medicine-stock")} className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
            Medicines
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="border px-3 py-2 rounded w-64"
        />

        <div className="flex items-center gap-2">
          <select
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>

          <button className="border px-2 py-1 rounded">📄</button>
          <button className="border px-2 py-1 rounded">📑</button>
          <button className="border px-2 py-1 rounded">🖨</button>
        </div>
      </div>
    </div>
  );
}
