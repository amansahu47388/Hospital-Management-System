import { X } from "lucide-react";

export default function AddBedModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-md bg-white rounded-md shadow-lg overflow-hidden max-h-[95vh] flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Add Bed</h3>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded">
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4 overflow-y-auto">

          <div>
            <label className="text-sm font-medium">Name *</label>
            <input className="w-full mt-1 border rounded px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium">Bed Type *</label>
            <select className="w-full mt-1 border rounded px-3 py-2">
              <option>Select</option>
              <option>Standard</option>
              <option>VIP</option>
              <option>Normal</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Bed Group *</label>
            <select className="w-full mt-1 border rounded px-3 py-2">
              <option>Select</option>
              <option>VIP Ward</option>
              <option>Private Ward</option>
              <option>ICU</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm">Not available for use</span>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
          <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded-md">
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
