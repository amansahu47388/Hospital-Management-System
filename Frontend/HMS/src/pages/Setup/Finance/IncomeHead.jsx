import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import FinanceSidebarMenu from "../../../components/Setup/Finance/FinanceSidebarMenu";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function IncomeHead() {
  const [list, setList] = useState([
    { id: 1, name: "Hospital charges", desc: "Hospital charges" },
    { id: 2, name: "Special campaign", desc: "" },
    { id: 3, name: "Canteen Rent", desc: "" },
    { id: 4, name: "Vehicle Stand Charges", desc: "" },
  ]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", desc: "" });

  const openAdd = () => {
    setForm({ id: null, name: "", desc: "" });
    setOpen(true);
  };

  const openEdit = (row) => {
    setForm(row);
    setOpen(true);
  };

  const saveData = () => {
    if (form.id) {
      setList((p) => p.map((r) => (r.id === form.id ? form : r)));
    } else {
      setList((p) => [...p, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };

  const deleteRow = (id) => {
    setList((p) => p.filter((r) => r.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <FinanceSidebarMenu />

          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
              <h1 className="text-xl font-semibold">Income Head List</h1>

              <button
                onClick={openAdd}
                className="flex items-center justify-center gap-2
                w-full sm:w-auto px-4 py-2 text-white rounded
                bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
              >
                <Plus size={16} /> Add Income Head
              </button>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Income Head</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((row) => (
                    <tr key={row.id} className="group hover:bg-gray-50">
                      <td className="px-3 py-2 text-blue-600">{row.name}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => openEdit(row)}
                            className="p-1 bg-blue-500 text-white rounded"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => deleteRow(row.id)}
                            className="p-1 bg-red-500 text-white rounded"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-3 py-2 text-xs text-gray-600">
                Records: 1 to {list.length} of {list.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2">
          <div className="w-full max-w-lg bg-white rounded shadow">
            <div className="flex justify-between items-center px-4 py-3 text-white
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h2 className="font-semibold">
                {form.id ? "Edit Income Head" : "Add Income Head"}
              </h2>
              <button onClick={() => setOpen(false)}><X /></button>
            </div>

            <div className="p-4 space-y-3">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Income Head *"
                className="w-full px-3 py-2 border rounded"
              />
              <textarea
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                placeholder="Description"
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="flex justify-end px-4 py-3 border-t">
              <button
                onClick={saveData}
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
