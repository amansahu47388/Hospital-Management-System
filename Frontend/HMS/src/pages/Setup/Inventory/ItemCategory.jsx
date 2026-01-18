import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import ItemSidebarMenu from "../../../components/Setup/Inventory/ItemSidebarMenu";
import { Plus, Pencil, X } from "lucide-react";

export default function ItemCategory() {
  const [items, setItems] = useState([
    { id: 1, name: "Syringe Packs", desc: "" },
    { id: 2, name: "Cotton Packs", desc: "" },
  ]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", desc: "" });

  const save = () => {
    if (form.id) {
      setItems(items.map(i => (i.id === form.id ? form : i)));
    } else {
      setItems([...items, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };

  return (
    <AdminLayout>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <ItemSidebarMenu />

        <div className="lg:col-span-3 bg-white rounded shadow p-4">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Item Category List</h2>
            <button
              onClick={() => {
                setForm({ id: null, name: "", desc: "" });
                setOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-white rounded
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
            >
              <Plus size={16} /> Add Item Category
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-3 py-2">Item Category</th>
                <th className="text-left px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(row => (
                <tr key={row.id} className="border-b">
                  <td className="px-3 py-2 text-blue-600">{row.name}</td>
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

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2">
          <div className="bg-white w-full max-w-lg rounded">
            <div className="flex justify-between items-center px-4 py-3 text-white
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3>{form.id ? "Edit" : "Add"} Item Category</h3>
              <X onClick={() => setOpen(false)} className="cursor-pointer" />
            </div>

            <div className="p-4 space-y-3">
              <input
                placeholder="Item Category"
                className="w-full border px-3 py-2 rounded"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full border px-3 py-2 rounded"
                value={form.desc}
                onChange={e => setForm({ ...form, desc: e.target.value })}
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
