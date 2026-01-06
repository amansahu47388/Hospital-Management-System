import { X, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

/* ================= ROW STRUCTURE ================= */
const emptyRow = {
  category: "",
  medicine: "",
  batchNo: "",
  expiry: "",
  mrp: "",
  batchAmount: "",
  salePrice: "",
  packingQty: "",
  quantity: "",
  purchasePrice: "",
  tax: "",
  amount: "",
};

/* ================= DUMMY DATA (API READY) ================= */
const categories  = [
  { id: 1, name: "Tablet" },
  { id: 2, name: "Capsule" },
  { id: 3, name: "Syrup" },
];

const medicines = [
  { id: 1, name: "Paracetamol" },
  { id: 2, name: "Amoxicillin" },
  { id: 3, name: "Cough Syrup" },
];

export default function PurchaseMedicineModal({ open, onClose }) {
  const [rows, setRows] = useState([{ ...emptyRow }]);

  if (!open) return null;

  /* ================= ADD ROW ================= */
  const addRow = () => {
    setRows((prev) => [...prev, { ...emptyRow }]);
  };

  /* ================= REMOVE ROW ================= */
  const removeRow = (index) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/40">
      <div className="w-full h-full bg-white flex flex-col">

        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <select className="bg-white text-black px-3 py-1 rounded w-72">
            <option>Select Supplier</option>
            <option>SGS Pharmacy</option>
            <option>Anant Pharmacy</option>
            <option>VKS Pharmacy</option>
          </select>

          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100">

          {/* BILL INFO */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <label className="font-medium">Bill No</label>
              <input className="border px-2 py-1 rounded w-40" />
            </div>

            <div className="text-sm font-medium">
              Purchase Date&nbsp;
              <span className="font-semibold">
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto bg-white ">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  {[
                    "Medicine Category ",
                    "Medicine Name",
                    "Batch",
                    "Expiry",
                    "MRP",
                    "Batch Amt",
                    "Sale Price",
                    "Pack Qty",
                    "Qty",
                    "Purchase Price",
                    "Tax %",
                    "Amount",
                  ].map(h => <th key={h} className="px-4 py-1">{h}</th>)}
                  <th>
                    <Plus onClick={addRow} className="cursor-pointer text-purple-600" />
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="p-1">

                    {/* CATEGORY */}
                    <td className="p-1"> 
                      <select
                        className="border p-1 w-full rounded"
                        value={row.medicine_category_id}
                        onChange={(e) =>
                          updateRow(i, "medicine_category_id", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </td>

                    {/* MEDICINE */}
                    <td className="p-1">
                      <select
                        className="border p-1 w-full rounded"
                        value={row.medicine_id}
                        onChange={(e) =>
                          updateRow(i, "medicine_id", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {medicines
                          .filter(m => m.category_id == row.medicine_category_id)
                          .map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                      </select>
                    </td>

                    {/* INPUT FIELDS */}
                    {[
                      ["batch_no", "text"],
                      ["expiry_month", "month"],
                      ["mrp", "number"],
                      ["batch_amount", "number"],
                      ["sale_price", "number"],
                      ["packing_qty", "number"],
                      ["quantity", "number"],
                      ["purchase_price", "number"],
                      ["tax_percent", "number"],
                      ["amount", "number"],
                    ].map(([field, type]) => (
                      <td key={field} className="p-1" >
                        <input
                          type={type}
                          className="border p-1 w-full rounded"
                          value={row[field]}
                          onChange={(e) =>
                            updateRow(i, field, e.target.value)
                          }
                        />
                      </td>
                    ))}

                    <td>
                      <Trash2
                        onClick={() => removeRow(i)}
                        className="text-red-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= NOTE & TOTAL ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

            {/* NOTE */}
            <div className="md:col-span-2">
              <label className="block font-medium mb-1">Note</label>
              <textarea className="w-full border rounded p-2 min-h-[100px]" />

              <label className="block font-medium mt-4">
                Attach Document
              </label>
              <div className="border border-dashed rounded p-4 text-center text-gray-500">
                Drop a file here or click
              </div>
            </div>

            {/* TOTALS */}
            <div className="space-y-3">
              <TotalRow label="Total ($)" />
              <InputRow label="Discount ($)" />
              <InputRow label="Tax ($)" />
              <TotalRow label="Net Amount ($)" bold />

              <div>
                <label className="block mb-1">Payment Mode</label>
                <select className="border w-full px-2 py-1 rounded">
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Card</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Payment Amount ($)</label>
                <input className="border w-full px-2 py-1 rounded" />
              </div>

              <div>
                <label className="block mb-1">Payment Note</label>
                <textarea className="border w-full px-2 py-1 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="p-4 border-t flex justify-end bg-gray-50">
          <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE UI ================= */
const TotalRow = ({ label, bold }) => (
  <div className={`flex justify-between ${bold && "font-semibold text-lg"}`}>
    <span>{label}</span>
    <span>0</span>
  </div>
);

const InputRow = ({ label }) => (
  <div className="flex justify-between items-center">
    <span>{label}</span>
    <input className="border px-2 py-1 w-24 rounded" />
  </div>
);
