import { X, Plus } from "lucide-react";

export default function PurchaseMedicineModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/40">
      {/* FULL SCREEN CONTAINER */}
      <div className="w-full h-full bg-white flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3
                        bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <select className="bg-white text-black px-3 py-1 rounded w-64">
            <option>Select Supplier</option>
            <option>SGS Pharmacy</option>
            <option>Anant Pharmacy</option>
            <option>VKS Pharmacy</option>
          </select>

          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100">

          {/* BILL INFO */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="font-medium">Bill No</label>
              <input
                className="border px-2 py-1 rounded"
                placeholder="Bill No"
              />
            </div>

            <div className="text-sm font-medium">
              Purchase Date&nbsp;
              <span className="font-semibold">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>

          {/* TABLE HEADER */}
          <div className="overflow-x-auto border rounded bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Medicine Category *</th>
                  <th className="p-2">Medicine Name *</th>
                  <th className="p-2">Batch No *</th>
                  <th className="p-2">Expiry Month *</th>
                  <th className="p-2">MRP ($) *</th>
                  <th className="p-2">Batch Amount ($)</th>
                  <th className="p-2">Sale Price ($) *</th>
                  <th className="p-2">Packing Qty</th>
                  <th className="p-2">Quantity *</th>
                  <th className="p-2">Purchase Price ($) *</th>
                  <th className="p-2">Tax *</th>
                  <th className="p-2">Amount ($) *</th>
                  <th className="p-2 text-center">
                    <Plus className="text-blue-600 cursor-pointer" />
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <td key={i} className="p-1">
                      <input
                        className="w-full border px-2 py-1 rounded"
                        placeholder={i < 2 ? "Select" : ""}
                      />
                    </td>
                  ))}
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* NOTE + TOTALS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

            {/* NOTE */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Note</label>
              <textarea
                className="w-full border rounded p-2 min-h-[100px]"
              />

              <label className="block font-medium mt-4">
                Attach Document
              </label>
              <div className="border border-dashed rounded p-4 text-center text-gray-500">
                Drop a file here or click
              </div>
            </div>

            {/* TOTALS */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total ($)</span>
                <span className="font-semibold">0.00</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Discount ($)</span>
                <input className="border px-2 py-1 w-24 rounded" />
              </div>

              <div className="flex justify-between items-center">
                <span>Tax ($)</span>
                <input className="border px-2 py-1 w-24 rounded" />
              </div>

              <div className="flex justify-between font-semibold text-lg">
                <span>Net Amount</span>
                <span>0.00</span>
              </div>

              <div className="mt-4">
                <label className="block mb-1">Payment Mode</label>
                <select className="border w-full px-2 py-1 rounded">
                  <option>Select</option>
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Card</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Payment Amount</label>
                <input className="border w-full px-2 py-1 rounded" />
              </div>

              <div>
                <label className="block mb-1">Payment Note</label>
                <textarea className="border w-full px-2 py-1 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t flex justify-end bg-gray-50">
          <button
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                       text-white px-6 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
