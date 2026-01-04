import React from "react";
import { X, Upload } from "lucide-react";

export default function AddMedicineModal({ open, onClose, onSave }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
      <div className="w-full max-w-5xl rounded-lg shadow-xl overflow-hidden bg-white">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 
                        bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Add Medicine Details</h2>

          <button onClick={onClose} className="hover:opacity-80">
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Medicine Name */}
            <div>
              <label className="text-sm font-medium">
                Medicine Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full mt-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-medium">
                Medicine Category <span className="text-red-500">*</span>
              </label>
              <select className="w-full mt-1 border rounded px-3 py-2">
                <option>Select</option>
              </select>
            </div>

            {/* Company */}
            <div>
              <label className="text-sm font-medium">Medicine Company</label>
              <select className="w-full mt-1 border rounded px-3 py-2">
                <option>Select</option>
              </select>
            </div>

            {/* Composition */}
            <div>
              <label className="text-sm font-medium">Medicine Composition</label>
              <input
                type="text"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            {/* Group */}
            <div>
              <label className="text-sm font-medium">Medicine Group</label>
              <select className="w-full mt-1 border rounded px-3 py-2">
                <option>Select</option>
              </select>
            </div>

            {/* Unit */}
            <div>
              <label className="text-sm font-medium">
                Unit <span className="text-red-500">*</span>
              </label>
              <select className="w-full mt-1 border rounded px-3 py-2">
                <option>Select</option>
              </select>
            </div>

            {/* Min Level */}
            <div>
              <label className="text-sm font-medium">Min Level</label>
              <input
                type="number"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            {/* Reorder Level */}
            <div>
              <label className="text-sm font-medium">Re-Order Level</label>
              <input
                type="number"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            {/* Tax */}
            <div>
              <label className="text-sm font-medium">Tax (%)</label>
              <input
                type="number"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            {/* Box Packing */}
            <div>
              <label className="text-sm font-medium">
                Box / Packing <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            {/* VAT */}
            <div>
              <label className="text-sm font-medium">VAT A/C</label>
              <input
                type="text"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            {/* Rack */}
            <div>
              <label className="text-sm font-medium">Rack Number</label>
              <input
                type="text"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            {/* Note */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium">Note</label>
              <input
                type="text"
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

            {/* Image Upload */}
            <div className="lg:col-span-2">
              <label className="text-sm font-medium">
                Medicine Photo (JPG | JPEG | PNG)
              </label>

              <label className="mt-1 flex items-center justify-center gap-2 border border-dashed rounded-md py-3 cursor-pointer text-gray-500 hover:bg-gray-50">
                <Upload size={18} />
                <span>Drop a file here or click</span>
                <input type="file" className="hidden" />
              </label>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-5 py-2 rounded text-white font-medium
                       bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                       hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
