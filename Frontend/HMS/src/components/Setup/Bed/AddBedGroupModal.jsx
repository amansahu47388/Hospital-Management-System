import { X } from "lucide-react";

export default function AddBedGroupModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-md bg-white rounded-md shadow-lg overflow-hidden">

        {/* HEADER */}
        <div
          className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
        >
          <h3 className="font-semibold">Add Bed Group</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-3">

          <div>
            <label className="text-sm font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input className="w-full mt-1 border rounded px-3 py-2" />
          </div>

          <div>
            <label className="text-sm font-medium">
              Floor <span className="text-red-500">*</span>
            </label>
            <select className="w-full mt-1 border rounded px-3 py-2">
              <option>Select</option>
              <option>Ground Floor</option>
              <option>1st Floor</option>
              <option>2nd Floor</option>
              <option>3rd Floor</option>
              <option>4th Floor</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Color</label>
            <input type="color" className="w-full h-10 border rounded" />
          </div>

          <div>
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
