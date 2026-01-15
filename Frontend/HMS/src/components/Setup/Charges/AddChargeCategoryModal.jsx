import { X } from "lucide-react";

export default function AddChargeCategoryModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-3">
      <div className="w-full max-w-xl bg-white rounded-md overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
        bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Add Charge Category</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Charge Type *</label>
            <select className="w-full mt-1 border rounded px-3 py-2">
              <option>Select</option>
              <option>Others</option>
              <option>Operations</option>
              <option>Supplier</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Name *</label>
            <input className="w-full mt-1 border rounded px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium">Description *</label>
            <textarea className="w-full mt-1 border rounded px-3 py-2" />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-4 py-3 border-t">
          <button className="px-6 py-2 text-white rounded-md
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
