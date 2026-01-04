import { Plus, Upload, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function MedicineHeader({ onAdd }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <h2 className="text-xl font-semibold text-white">
        Medicines Stock
      </h2>

      <div className="flex flex-wrap gap-2">
        {/* <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <Upload size={16} /> Import Medicines
        </button> */}

        <button    className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <Plus size={16} /> Add Medicine
        </button>

        <button onClick={() => navigate("/admin/pharmacy-bill/medicine-purchase-list")} className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <ShoppingCart size={16} /> Purchase
        </button>

        <button className="bg-gradient-to-b from-[#E74C3C] to-[#C0392B] text-white px-3 py-2 rounded text-sm hover:bg-red-700 flex items-center gap-2">
          <Trash2 size={16} /> Delete Selected
        </button>
      </div>
    </div>
  );
}
