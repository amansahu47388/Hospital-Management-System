import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import MedicineSidebarMenu from "../../../components/Setup/Pharmacy/MedicineSidebarMenu";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function DoseInterval() {
  const [list, setList] = useState([
    { id: 1, name: "4 times a day" },
    { id: 2, name: "2 times a day" },
  ]);

  const [form, setForm] = useState({ id: null, name: "" });
  const [open, setOpen] = useState(false);

  const save = () => {
    if (form.id) {
      setList(list.map(i => i.id === form.id ? form : i));
    } else {
      setList([...list, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          <div className="lg:col-span-1">
            <MedicineSidebarMenu />
          </div>

          <div className="lg:col-span-3">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Dosage Interval List</h2>
              <button
                onClick={() => { setForm({ id: null, name: "" }); setOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 text-white rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
              >
                <Plus size={16} /> Add Dosage Interval
              </button>
            </div>

            <div className="bg-white rounded shadow">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Interval</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(row => (
                    <tr key={row.id} className="group hover:bg-gray-50">
                      <td className="px-3 py-2">{row.name}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => { setForm(row); setOpen(true); }}
                            className="p-1 bg-blue-500 text-white rounded"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setList(list.filter(i => i.id !== row.id))}
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
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
          <div className="bg-white w-full max-w-lg rounded">
            <div className="flex justify-between px-4 py-3 text-white rounded-t bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3>{form.id ? "Edit Dosage Interval" : "Add Dosage Interval"}</h3>
              <button onClick={() => setOpen(false)}><X /></button>
            </div>

            <div className="p-4">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Interval"
              />
            </div>

            <div className="flex justify-end p-4 border-t">
              <button
                onClick={save}
                className="px-6 py-2 text-white rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
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
