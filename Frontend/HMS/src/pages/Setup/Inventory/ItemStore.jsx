import { useState, useEffect } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import ItemSidebarMenu from "../../../components/Setup/Inventory/ItemSidebarMenu";
import { Plus, Pencil, X, Trash2 } from "lucide-react";
import { getStores, createStore, updateStore, deleteStore } from "../../../api/inventoryApi";
import { useNotify } from "../../../context/NotificationContext";

export default function ItemStore() {
  const notify = useNotify();
  const [stores, setStores] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", code: "" });

  // Fetch stores
  const fetchStores = async () => {
    try {
      const res = await getStores();
      setStores(res.data);
    } catch (err) {
      notify("error", "Failed to fetch stores");
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Save or Update
  const save = async () => {
    try {
      if (form.id) {
        await updateStore(form.id, { store_name: form.name, store_code: form.code });
        notify("success", "Store updated successfully");
      } else {
        await createStore({ store_name: form.name, store_code: form.code });
        notify("success", "Store added successfully");
      }
      setOpen(false);
      fetchStores();
    } catch (err) {
      notify("error", "Operation failed");
    }
  };

  // Delete store
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;
    try {
      await deleteStore(id);
      notify("success", "Store deleted successfully");
      fetchStores();
    } catch (err) {
      notify("error", "Failed to delete store");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Item Store List</h2>
          <button
            onClick={() => {
              setForm({ id: null, name: "", code: "" });
              setOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-md
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2] transition hover:opacity-90"
          >
            <Plus size={16} /> Add Item Store
          </button>
        </div>

        <div className="flex gap-4">
          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <ItemSidebarMenu />
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow thin-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Store Name</th>
                  <th className="px-3 py-2 text-left">Stock Code</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {stores.map(row => (
                  <tr key={row.id} className="hover:bg-gray-100 border-b border-gray-200 ">
                    <td className="px-3 py-2">{row.store_name}</td>
                    <td className="px-3 py-2">{row.store_code}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setForm({ id: row.id, name: row.store_name, code: row.store_code });
                            setOpen(true);
                          }}
                          className="text-purple-600 hover:text-purple-800 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="text-red-600 hover:text-red-800 transition"
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
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-2">
          <div className="w-full max-w-lg bg-white rounded-md shadow-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 text-white
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h2 className="font-semibold">{form.id ? "Edit" : "Add"} Item Store</h2>
              <button onClick={() => setOpen(false)} className="hover:text-gray-200 transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Enter store name"
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Code
                </label>
                <input
                  placeholder="Enter stock code"
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
              <button
                onClick={save}
                className="px-6 py-2 text-white rounded-md
                bg-gradient-to-b from-[#6046B5] to-[#8A63D2] transition hover:opacity-90"
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
