import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import ItemSidebarMenu from "../../../components/Setup/Inventory/ItemSidebarMenu";
import { Plus, Pencil, X } from "lucide-react";

export default function ItemSupplier() {
  const [suppliers, setSuppliers] = useState([
    {
      id: 1,
      name: "VK Supplier",
      phone: "7468248735",
      email: "vk@gmail.com",
      contact: "Mr. Brajesh",
      address: "Gorakhpur",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});

  const save = () => {
    if (form.id) {
      setSuppliers(suppliers.map(s => (s.id === form.id ? form : s)));
    } else {
      setSuppliers([...suppliers, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };

  return (
    <AdminLayout>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <ItemSidebarMenu />

        <div className="lg:col-span-3 bg-white rounded shadow p-4">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Item Supplier List</h2>
            <button
              onClick={() => {
                setForm({});
                setOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-white rounded
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
            >
              <Plus size={16} /> Add Item Supplier
            </button>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Supplier</th>
                <th className="px-3 py-2 text-left">Contact</th>
                <th className="px-3 py-2 text-left">Address</th>
                <th className="px-3 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(row => (
                <tr key={row.id} className="border-b">
                  <td className="px-3 py-2 text-blue-600">{row.name}</td>
                  <td className="px-3 py-2">{row.contact}</td>
                  <td className="px-3 py-2">{row.address}</td>
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
          <div className="bg-white w-full max-w-xl rounded">
            <div className="flex justify-between px-4 py-3 text-white
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3>{form.id ? "Edit" : "Add"} Item Supplier</h3>
              <X onClick={() => setOpen(false)} />
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input placeholder="Name" className="border px-3 py-2 rounded"
                value={form.name || ""}
                onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Phone" className="border px-3 py-2 rounded"
                value={form.phone || ""}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input placeholder="Email" className="border px-3 py-2 rounded"
                value={form.email || ""}
                onChange={e => setForm({ ...form, email: e.target.value })} />
              <input placeholder="Contact Person" className="border px-3 py-2 rounded"
                value={form.contact || ""}
                onChange={e => setForm({ ...form, contact: e.target.value })} />
              <textarea placeholder="Address"
                className="border px-3 py-2 rounded md:col-span-2"
                value={form.address || ""}
                onChange={e => setForm({ ...form, address: e.target.value })} />
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
