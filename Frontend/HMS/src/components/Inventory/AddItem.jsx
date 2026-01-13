import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories, createItem } from "../../api/inventoryApi";
import { useNotify } from "../../context/NotificationContext";

export default function AddItem({ open, onClose, refresh }) {
  const notify = useNotify();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    item_name: "",
    category: "",
    unit: "",
    description: "",
  });

  useEffect(() => {
    if (open) {
      getCategories()
        .then((res) => setCategories(res.data))
        .catch(() => notify("error","Failed to load categories"));
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.item_name || !form.category || !form.unit) {
      notify("warning","All required fields must be filled");
      return;
    }

    setLoading(true);

    try {
      await createItem({
        item_name: form.item_name,
        category: Number(form.category),   // 🔥 FIX
        unit: Number(form.unit),
        description: form.description,
      });
      notify("success","Item added successfully");
      refresh();
      onClose();

      setForm({
        item_name: "",
        category: "",
        unit: "",
        description: "",
      });

    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.data) {
        const msg = Object.values(err.response.data)[0];
        notify("error",msg);
      } else {
        notify("error","Failed to create item");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-3">
      <div className="bg-white w-full max-w-xl rounded-lg shadow overflow-hidden">

        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Add Item</h2>
          <X onClick={onClose} className="cursor-pointer" />
        </div>

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
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Unit *</label>
            <input
              type="number"
              name="unit"
              value={form.unit}
              onChange={handleChange}
              min="1"
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

          <div className="flex justify-end pt-2">
            <button
              disabled={loading}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
