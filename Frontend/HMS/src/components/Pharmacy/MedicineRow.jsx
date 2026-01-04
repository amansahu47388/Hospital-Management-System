import { X } from "lucide-react";

export default function MedicineRow({ row, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 gap-2 items-center">

      <select className="border p-2 rounded"
        value={row.category}
        onChange={(e) => onChange("category", e.target.value)}
      >
        <option>Select</option>
        <option>Tablet</option>
        <option>Syrup</option>
        <option>Injection</option>
      </select>

      <select className="border p-2 rounded"
        value={row.medicine}
        onChange={(e) => onChange("medicine", e.target.value)}
      >
        <option>Select</option>
        <option>Paracetamol</option>
        <option>Amoxicillin</option>
      </select>

      <select className="border p-2 rounded"
        value={row.batch}
        onChange={(e) => onChange("batch", e.target.value)}
      >
        <option>Select</option>
        <option>BATCH001</option>
        <option>BATCH002</option>
      </select>

      <input
        type="date"
        className="border p-2 rounded"
        value={row.expiry}
        onChange={(e) => onChange("expiry", e.target.value)}
      />

      <input
        type="number"
        className="border p-2 rounded"
        placeholder="Qty"
        value={row.qty}
        onChange={(e) => onChange("qty", e.target.value)}
      />

      <input
        type="number"
        className="border p-2 rounded"
        placeholder="Price"
        value={row.price}
        onChange={(e) => onChange("price", e.target.value)}
      />

      <input
        type="number"
        className="border p-2 rounded"
        placeholder="Tax %"
        value={row.tax}
        onChange={(e) => onChange("tax", e.target.value)}
      />

      <input
        type="number"
        className="border p-2 rounded"
        placeholder="Discount %"
        value={row.discount}
        onChange={(e) => onChange("discount", e.target.value)}
      />

      <input
        readOnly
        className="border p-2 bg-gray-100 rounded"
        value={row.amount}
      />

      <button
        onClick={onRemove}
        className="text-red-600 hover:bg-red-50 rounded p-1"
      >
        <X size={18} />
      </button>
    </div>
  );
}
