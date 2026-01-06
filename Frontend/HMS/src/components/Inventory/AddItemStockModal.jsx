import { X, UploadCloud } from "lucide-react";
import { useState } from "react";

export default function AddItemStockModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    category: "",
    item: "",
    supplier: "",
    store: "",
    quantity: 1,
    purchasePrice: "",
    date: "",
    description: "",
    document: null,
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, document: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Add Item Stock</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Item Category *"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
            <Select
              label="Item *"
              name="item"
              value={form.item}
              onChange={handleChange}
            />
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Supplier *"
              name="supplier"
              value={form.supplier}
              onChange={handleChange}
            />
            <Select
              label="Store"
              name="store"
              value={form.store}
              onChange={handleChange}
            />
          </div>

          {/* ROW 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Quantity *"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
            />
            <Input
              label="Purchase Price *"
              name="purchasePrice"
              value={form.purchasePrice}
              onChange={handleChange}
            />
            <Input
              label="Date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          {/* DESCRIPTION */}
          <Textarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          {/* FILE */}
          <FileUpload label="Attach Document" onChange={handleFileChange} />

          {/* ACTION */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]  text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* ---------- SMALL REUSABLE INPUTS ---------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        {...props}
        className="w-full border rounded-md px-3 py-2 mt-1"
      />
    </div>
  );
}

function Select({ label, ...props }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <select
        {...props}
        className="w-full border rounded-md px-3 py-2 mt-1"
      >
        <option value="">Select</option>
        <option>Medical Equipment</option>
        <option>Uniforms</option>
        <option>Cotton Packs</option>
      </select>
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <textarea
        {...props}
        className="w-full border rounded-md px-3 py-2 mt-1 h-24 resize-none"
      />
    </div>
  );
}

function FileUpload({ label, onChange }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <label className="mt-1 border rounded-md px-3 py-2 flex items-center gap-2 cursor-pointer text-gray-500">
        <UploadCloud size={16} /> Drop a file here or click
        <input type="file" hidden onChange={onChange} />
      </label>
    </div>
  );
}
