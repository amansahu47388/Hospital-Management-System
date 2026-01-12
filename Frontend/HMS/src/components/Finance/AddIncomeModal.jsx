import { X } from "lucide-react";

export default function AddIncomeModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2 sm:px-4">
      <div className="w-full max-w-4xl bg-white rounded-md shadow-lg overflow-hidden max-h-[95vh] flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] sticky top-0 z-10">
          <h3 className="font-semibold">Add Income</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-medium">Income Head *</label>
              <select className="w-full mt-1 border rounded px-3 py-2">
                <option>Select</option>
                <option>Vehicle Stand Charges</option>
                <option>Canteen Rent</option>
                <option>Hospital Charges</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Name *</label>
              <input className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            <div>
              <label className="text-sm font-medium">Invoice Number</label>
              <input className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            <div>
              <label className="text-sm font-medium">Date *</label>
              <input
                type="date"
                className="w-full mt-1 border rounded px-3 py-2 bg-gray-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Amount ($) *</label>
              <input className="w-full mt-1 border rounded px-3 py-2" />
            </div>

            <div>
              <label className="text-sm font-medium">Attach Document</label>
              <input type="file" className="w-full mt-1" />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                rows={3}
                className="w-full mt-1 border rounded px-3 py-2"
              />
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 z-10 flex justify-end px-4 py-3 border-t bg-gray-50">
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
