import { X } from "lucide-react";

export default function EditUnitTypeModal({ open, onClose, unit }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-md bg-white rounded-md overflow-hidden">

        <div className="flex justify-between items-center px-4 py-3 text-white
        bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Edit Unit Type</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="p-4">
          <label className="text-sm font-medium">Unit *</label>
          <input
            defaultValue={unit}
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
          <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
          text-white px-6 py-2 rounded-md">
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
