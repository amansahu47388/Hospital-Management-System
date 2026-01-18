import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import ItemSidebarMenu from "../../../components/Setup/Inventory/ItemSidebarMenu";
import { Plus, Pencil, X } from "lucide-react";

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

  return (
    <AdminLayout>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <ItemSidebarMenu />

        <div className="lg:col-span-3 bg-white rounded shadow p-4">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Item Store List</h2>
            <button
              onClick={() => {
                setForm({ id: null, name: "", code: "" });
                setOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-white rounded
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
            >
              <Plus size={16} /> Add Item Store
            </button>
          </div>

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
                <tr key={row.id} className="border-b">
                  <td className="px-3 py-2 text-blue-600">{row.name}</td>
                  <td className="px-3 py-2">{row.code}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => {
                        setForm(row);
                        setOpen(true);
                      }}
                      className="p-1 bg-blue-500 text-white rounded"
                    >
                      <Pencil size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded">
            <div className="flex justify-between px-4 py-3 text-white
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3>{form.id ? "Edit" : "Add"} Item Store</h3>
              <X onClick={() => setOpen(false)} />
            </div>

            <div className="p-4 space-y-3">
              <input
                placeholder="Store Name"
                className="w-full border px-3 py-2 rounded"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Stock Code"
                className="w-full border px-3 py-2 rounded"
                value={form.code}
                onChange={e => setForm({ ...form, code: e.target.value })}
              />
            </div>

            <div className="flex justify-end p-4 border-t">
              <button
                onClick={save}
                className="px-6 py-2 text-white rounded
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
