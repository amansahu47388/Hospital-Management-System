import { Trash2, Plus, Upload, ShoppingCart } from "lucide-react";
import React ,{useState} from "react";
import { useNavigate } from "react-router-dom";
const buttonClass =
  "flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] " +
  "text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition";

export default function MedicineActions({
  selected,
  onAdd,
  onImport,
  onPurchase,
  onDelete,
})  
 {
  const navigate = useNavigate();
   //const [openAdd, setOpenAdd] = useState(false);
  return (
    <div className="flex flex-wrap gap-2 justify-end">
      {/* <button onClick={onImport} className={buttonClass}>
        <Upload size={16} />
        Import Medicines
      </button> */}

      <button onClick={onAdd} className={buttonClass}>
        <Plus size={16} />
        Add Medicine
      </button>

      <button onClick={() => navigate("/admin/pharmacy-bill/medicine-purchase-list")} className={buttonClass}>
        <ShoppingCart size={16} />
        Purchase
      </button>

      <button
        onClick={onDelete}
        disabled={selected.length === 0}
        className={`${buttonClass} ${
          selected.length === 0
            ? "opacity-50 cursor-not-allowed"
            : ""
        }`}
      >
        <Trash2 size={16} />
        Delete Selected
      </button>
    </div>

    
  );
}
