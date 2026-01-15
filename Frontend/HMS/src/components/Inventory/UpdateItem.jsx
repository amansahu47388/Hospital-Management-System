import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories, updateItem } from "../../api/inventoryApi";
import { useNotify } from "../../context/NotificationContext";

export default function UpdateItem({ open, item, onClose, refresh }) {
  const notify = useNotify();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    item_name: "",
    category: "",
    unit: "",
    description: "",
  });

  /* Load categories */
  useEffect(() => {
    if (open) {
      getCategories().then(res => setCategories(res.data));
    }
  }, [open]);

  /* Prefill */
  useEffect(() => {
    if (item) {
      setForm({
        item_name: item.item_name,
        category: item.category,
        unit: item.unit,
        description: item.description || "",
      });
    }
  }, [item]);

  if (!open || !item) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.item_name || !form.category || !form.unit) {
      notify("warning", "All required fields must be filled");
      return;
    }

    setLoading(true);

    try {
      await updateItem(item.id, {
        item_name: form.item_name,
        category: Number(form.category),
        unit: Number(form.unit),
        description: form.description,
      });

      notify("success", "Item updated successfully");
      refresh();
      onClose();
    } catch (err) {
      const msg = err.response?.data
        ? Object.values(err.response.data)[0]
        : "Update failed";
      notify("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Edit Item</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div>
            <label className="text-sm font-medium">Item Name *</label>
            <input
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            >
              <option value="">Select</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Unit *</label>
            <input
              type="number"
              name="unit"
              min="1"
              value={form.unit}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded px-3 py-2 mt-1"
            />
          </div>

          <div className="flex justify-end pt-3">
            <button
              disabled={loading}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
