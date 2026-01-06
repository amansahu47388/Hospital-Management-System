import { X, Search } from "lucide-react";

export default function GenerateAmbulanceBill({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      
      {/* MODAL */}
      <div className="w-[98%]  max-w-7xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER (MATCH IMAGE + GRADIENT) */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <select className="w-[35%] px-3 py-2 rounded text-sm text-black">
            <option>Select Patient</option>
          </select>

          {/* <button className="px-4 py-2 bg-white text-[#6046B5] rounded text-sm font-medium">
            + New Patient
          </button> */}

          <div className="relative flex-1">
            <input
              placeholder="Case ID"
              className="w-full px-3 py-2 rounded text-sm text-black"
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <button
            onClick={onClose}
            className="ml-2 hover:bg-white/20 p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto max-h-[75vh]">

          {/* FORM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            <div>
              <label className="label">Vehicle Model *</label>
              <select className="input">
                <option>Select</option>
              </select>
            </div>

            <div>
              <label className="label">Driver Name</label>
              <input className="input bg-gray-100" disabled />
            </div>

            <div>
              <label className="label">Date *</label>
              <input type="date" className="input" />
            </div>

            <div>
              <label className="label">Charge Category *</label>
              <select className="input">
                <option>Select</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label">Charge Name *</label>
              <select className="input">
                <option>Select</option>
              </select>
            </div>

            <div>
              <label className="label">Standard Charge ($) *</label>
              <input type="number" className="input" />
            </div>
          </div>

          {/* NOTE + BILL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">

            {/* NOTE */}
            <div>
              <label className="label">Note</label>
              <textarea
                rows={5}
                className="input resize-none"
              />
            </div>

            {/* BILL SUMMARY (MATCH IMAGE RIGHT SIDE) */}
            <div className="space-y-3">
              {[
                ["Total ($)", "Total"],
                ["Discount ($)", "Discount"],
                ["Tax ($)", "Tax"],
                ["Net Amount ($)", "Net Amount"],
              ].map(([left, right]) => (
                <div
                  key={left}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span className="text-sm">{left}</span>
                  <span className="font-semibold text-gray-400">
                    {right}
                  </span>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-3 mt-3">
                <select className="input">
                  <option>Payment Mode</option>
                </select>

                <input
                  type="number"
                  placeholder="Payment Amount ($)"
                  className="input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER (MATCH IMAGE BUTTONS) */}
        <div className="flex justify-end gap-3 px-6 py-3 bg-gray-100 border-t">
          <button className="px-4 py-2 rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-sm">
            💾 Save & Print
          </button>
          <button className="px-4 py-2 rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-sm">
            ✔ Save
          </button>
        </div>
      </div>
    </div>
  );
}
