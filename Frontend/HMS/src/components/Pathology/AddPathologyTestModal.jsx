import React, { useState } from "react";
import { X } from "lucide-react";

export default function AddPathologyTestModal({ open, onClose }) {
 //const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSave = () => {
    setLoading(true);

    // simulate API call
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h2 className="text-lg font-semibold">Add Test Details</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 hover:opacity-80" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Row 1 */}
            <Input label="Test Name *" />
            <Input label="Short Name *" />
            <Input label="Test Type" />

            {/* Row 2 */}
            <Select label="Category Name *" />
            <Input label="Sub Category" />
            <Input label="Method" />

            {/* Row 3 */}
            <Input label="Report Days *" type="number" />
            <Select label="Charge Category *" />
            <Select label="Charge Name *" />

            {/* Row 4 */}
            <Input label="Tax (%)" type="number" />
            <Input label="Standard Charge ($) *" />
            <Input label="Amount ($) *" />
          </div>

          {/* PARAMETER SECTION */}
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Test Parameter
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <Select label="Test Parameter Name *" />
              <Input label="Reference Range *" />
              <Input label="Unit *" />

              <button className="h-10 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded hover:bg-blue-700">
                + Add
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            
            className="px-5 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded text-white flex items-center gap-2"
              
          >
              Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Small Reusable Inputs ---------- */

function Input({ label, type = "text" }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        className="border rounded px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
      />
    </div>
  );
}

function Select({ label }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select className="border rounded px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400 outline-none">
        <option>Select</option>
      </select>
    </div>
  );
}
