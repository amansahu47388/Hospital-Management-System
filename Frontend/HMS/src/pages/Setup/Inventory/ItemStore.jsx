import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import ItemSidebarMenu from "../../../components/Setup/Inventory/ItemSidebarMenu";
import { Plus, Pencil, X, Trash2 } from "lucide-react";

export default function ItemStore() {
  const [stores, setStores] = useState([
    { id: 1, name: "SK Pharma", code: "4452" },
    { id: 2, name: "Vinay Pharmacy", code: "895" },
  ]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", code: "" });

  const save = () => {
    if (form.id) {
      setStores(stores.map(s => (s.id === form.id ? form : s)));
    } else {
      setStores([...stores, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };

  const deleteStore = (id) => {
    setStores(stores.filter(s => s.id !== id));
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
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
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
                  <tr key={row.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-b-0">
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.code}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setForm(row);
                            setOpen(true);
                          }}
                          className="text-purple-600 hover:text-purple-800 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteStore(row.id)}
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
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center px-4 py-3 text-white
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h2 className="font-semibold">{form.id ? "Edit" : "Add"} Item Store</h2>
              <button
                onClick={() => setOpen(false)}
                className="hover:text-gray-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
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

            {/* MODAL FOOTER */}
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
