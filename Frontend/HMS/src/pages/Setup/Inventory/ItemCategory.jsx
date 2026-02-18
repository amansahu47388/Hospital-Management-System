import { useEffect, useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import ItemSidebarMenu from "../../../components/Setup/Inventory/ItemSidebarMenu";
import { Plus, Pencil, X, Trash2 } from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../api/inventoryApi";
import { useNotify } from "../../../context/NotificationContext";

export default function ItemCategory() {
  const notify = useNotify();

  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", description: "" });

  // 🔹 LOAD DATA
  const loadData = async () => {
    try {
      const res = await getCategories();
      setItems(res.data);
    } catch {
      notify("error", "Failed to load categories");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 🔹 SAVE
  const save = async () => {
    if (!form.name.trim()) {
      notify("error", "Category name is required");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || "",
    };

    try {
      if (form.id) {
        // Only update if name is changed OR no duplicates
        await updateCategory(form.id, payload);
        notify("success", "Category updated successfully");
      } else {
        await createCategory(payload);
        notify("success", "Category created successfully");
      }
      setOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.name || err.response?.data?.detail || "Error saving category";
      notify("error", msg);
    }
  };


  // 🔹 DELETE
  const remove = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      notify("success", "Category deleted successfully");
      loadData();
    } catch {
      notify("error", "Failed to delete category");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Item Category List</h2>
          <button
            onClick={() => {
              setForm({ id: null, name: "", description: "" });
              setOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-md
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
          >
            <Plus size={16} /> Add Item Category
          </button>
        </div>

        <div className="flex gap-4">
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <ItemSidebarMenu />
          </div>

          <div className="flex-1 bg-white rounded-md shadow overflow-x-auto thin-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Item Category</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-100 border-b border-gray-200">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setForm(row);
                            setOpen(true);
                          }}
                          className="text-purple-600 hover:text-purple-800 hover:bg-purple-200 p-1 rounded transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => remove(row.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-200 p-1 rounded transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-md">
            <div className="flex justify-between px-4 py-3 text-white
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h2>{form.id ? "Edit" : "Add"} Item Category</h2>
              <button onClick={() => setOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Category <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2"
                placeholder="Item Category"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2"
                placeholder="Description"
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end px-4 py-3 border-t border-gray-300 bg-gray-50">
              <button
                onClick={save}
                className="px-6 py-2 text-white rounded-md
                bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
