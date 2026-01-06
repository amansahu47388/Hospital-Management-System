import React from "react";
import { useNavigate } from "react-router-dom";
export default function ItemStockHeader({ search, setSearch ,openAdd, setOpenAdd}) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

      <h2 className="text-lg font-semibold text-black">Item Stock List</h2>

      <div className="flex gap-2">
        <button onClick={() => setOpenAdd(true)} className=" bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-1 rounded">
          + Add Item Stock
        </button>
        <button onClick={() => navigate("/admin/Inventory/Issue-Item")} className=" bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-1 rounded">
          Issue Item
        </button>
        <button onClick={() => navigate("/admin/Inventory/Item-List")} className=" bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-1 rounded">
          Item
        </button>
      </div>
    </div>
  );
}
