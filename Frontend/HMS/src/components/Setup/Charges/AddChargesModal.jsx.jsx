import { X } from "lucide-react";

export default function AddChargesModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-5xl bg-white rounded-md shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
        bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Add Charges</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-medium">Charge Type *</label>
            <select className="w-full mt-1 border rounded px-3 py-2">
              <option>Select</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Charge Category *</label>
            <select className="w-full mt-1 border rounded px-3 py-2">
              <option>Select</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Unit Type *</label>
            <select className="w-full mt-1 border rounded px-3 py-2">
              <option>Select</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Charge Name *</label>
            <input className="w-full mt-1 border rounded px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium">Tax Category *</label>
            <select className="w-full mt-1 border rounded px-3 py-2">
              <option>Select</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Tax (%)</label>
            <input className="w-full mt-1 border rounded px-3 py-2 bg-gray-100" />
          </div>

          <div>
            <label className="text-sm font-medium">Standard Charge ($) *</label>
            <input className="w-full mt-1 border rounded px-3 py-2" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea className="w-full mt-1 border rounded px-3 py-2" />
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
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
