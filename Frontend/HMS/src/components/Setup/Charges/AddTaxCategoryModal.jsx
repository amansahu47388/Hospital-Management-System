import { X } from "lucide-react";

export default function AddTaxCategoryModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-md bg-white rounded-md overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Add Tax Category</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Name *</label>
            <input className="w-full mt-1 border rounded px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium">Percentage *</label>
            <div className="flex">
              <input className="w-full border rounded-l px-3 py-2" />
              <span className="border rounded-r px-3 py-2 bg-gray-100">%</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-4 py-3 border-t">
          <button
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-6 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
