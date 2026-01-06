import { X } from "lucide-react";
import { useState } from "react";

export default function AddItemModal({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    unit: "",
    description: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
    setForm({
      name: "",
      category: "",
      unit: "",
      description: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER */}
        <div
          className="flex justify-between items-center px-6 py-4
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white"
        >
          <h2 className="text-lg font-semibold">Add Item</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* ITEM */}
          <div>
            <label className="text-sm font-medium">
              Item <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-sm font-medium">
              Item Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            >
              <option value="">Select</option>
              <option>Medical Equipment</option>
              <option>Medical scissors</option>
              <option>Apparel</option>
              <option>Cardiology</option>
              <option>Surgical blades</option>
            </select>
          </div>

          {/* UNIT */}
          <div>
            <label className="text-sm font-medium">
              Unit <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          {/* ACTION */}
          <div className="flex justify-end pt-2">
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