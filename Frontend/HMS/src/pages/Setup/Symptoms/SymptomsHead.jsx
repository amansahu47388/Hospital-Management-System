import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import SymptomsSidebarMenu from "../../../components/Setup/Symptoms/SymptomsSidebarMenu";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function SymptomsHead() {
  const [rows, setRows] = useState([
    {
      id: 1,
      head: "Thirst",
      type: "Eating or weight problems",
      desc: "Thirst is the feeling of needing to drink something."
    },
    {
      id: 2,
      head: "Feeling sad or down",
      type: "Emotional problems",
      desc: "Personality change in a way that seems different."
    }
  ]);

  const [form, setForm] = useState({ id: null, head: "", type: "", desc: "" });
  const [open, setOpen] = useState(false);

  const openAdd = () => {
    setForm({ id: null, head: "", type: "", desc: "" });
    setOpen(true);
  };

  const openEdit = (row) => {
    setForm(row);
    setOpen(true);
  };

  const save = () => {
    if (form.id) {
      setRows((p) => p.map((r) => (r.id === form.id ? form : r)));
    } else {
      setRows((p) => [...p, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };

  const remove = (id) => {
    setRows((p) => p.filter((r) => r.id !== id));
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <SymptomsSidebarMenu  />

          <div className="lg:col-span-3">
            <div className="flex justify-between mb-4">
              <h1 className="text-xl font-semibold">Symptoms Head List</h1>
              <button
        onClick={openAdd}
          className="
      flex items-center justify-center gap-2
      w-full sm:w-auto
      px-4 py-2
      text-sm sm:text-base
      text-white rounded
      bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
      hover:opacity-90 transition
    "
  >
  <Plus size={16} className="shrink-0" />
  <span>Add Symptoms Head</span>
</button>

            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Symptoms Head</th>
                    <th className="px-3 py-2 text-left">Symptoms Type</th>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className="group hover:bg-gray-50">
                      <td className="px-3 py-2">{r.head}</td>
                      <td className="px-3 py-2">{r.type}</td>
                      <td className="px-3 py-2">{r.desc}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => openEdit(r)}
                            className="p-1 bg-blue-500 text-white rounded"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => remove(r.id)}
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl rounded shadow">
            <div className="px-4 py-3 text-white flex justify-between
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h2>{form.id ? "Edit" : "Add"} Symptoms Head</h2>
              <button onClick={() => setOpen(false)}><X /></button>
            </div>

            <div className="p-4 space-y-3">
              <input
                placeholder="Symptoms Head"
                value={form.head}
                onChange={(e) => setForm({ ...form, head: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                placeholder="Symptoms Type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border px-3 py-2 rounded"
              />
              <textarea
                placeholder="Description"
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
                className="w-full border px-3 py-2 rounded"
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
