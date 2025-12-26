import { X } from "lucide-react";

export default function TestRow({ row, onChange, onRemove }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
      <select
        className="border p-2 rounded"
        value={row.name}
        onChange={(e) => onChange("name", e.target.value)}
      >
        <option value="">Select</option>
        <option value="CBC">CBC</option>
        <option value="Blood Sugar">Blood Sugar</option>
        <option value="X-Ray">X-Ray</option>
      </select>

      <input
        className="border p-2 rounded"
        placeholder="Report Days"
        value={row.days}
        onChange={(e) => onChange("days", e.target.value)}
      />

      <input
        type="date"
        className="border p-2 rounded"
        value={row.date}
        onChange={(e) => onChange("date", e.target.value)}
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
        placeholder="Amount"
        value={row.amount}
        onChange={(e) => onChange("amount", e.target.value)}
      />

      <button
        onClick={onRemove}
        className="text-red-500 font-bold text-xl"
      >
        ✕
      </button>
    </div>
  );
}
