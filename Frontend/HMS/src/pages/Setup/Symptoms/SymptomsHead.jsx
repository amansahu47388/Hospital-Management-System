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
      <div className="min-h-screen p-1">
        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Symptoms Head</h2>

          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md"
          >
            <Plus size={16} /> Add Symptoms Head
          </button>
        </div>

        <div className="flex gap-4">
          {/* LEFT MENU */}
          <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
            <SymptomsSidebarMenu />
          </div>

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
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
                  <tr key={r.id} className="hover:bg-gray-50 border-b border-gray-50 last:border-b-0">
                    <td className="px-3 py-2">{r.head}</td>
                    <td className="px-3 py-2">{r.type}</td>
                    <td className="px-3 py-2">{r.desc}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEdit(r)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => remove(r.id)}
                          className="text-red-600 hover:text-red-800"
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
          <div className="bg-white w-full max-w-xl rounded-md shadow-lg overflow-hidden">
            <div className="px-4 py-3 text-white flex justify-between
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h2 className="font-semibold">{form.id ? "Edit" : "Add"} Symptoms Head</h2>
              <button
                onClick={() => setOpen(false)}
                className="hover:text-gray-200 transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms Head <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Symptoms Head"
                  value={form.head}
                  onChange={(e) => setForm({ ...form, head: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms Type <span className="text-red-500">*</span>
                </label>
                <input
                  placeholder="Symptoms Type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Description"
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end p-4 border-t bg-gray-50">
              <button
                onClick={save}
                className="px-6 py-2 text-white rounded-md
                bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 transition"
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
