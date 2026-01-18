import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import SymptomsSidebarMenu from "../../../components/Setup/Symptoms/SymptomsSidebarMenu";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function SymptomsType() {
  const [types, setTypes] = useState([
    { id: 1, name: "Eating or weight problems" },
    { id: 2, name: "Emotional problems" },
    { id: 3, name: "Skin problems" },
  ]);

  const [form, setForm] = useState({ id: null, name: "" });
  const [open, setOpen] = useState(false);

  const save = () => {
    if (form.id) {
      setTypes((p) => p.map((t) => (t.id === form.id ? form : t)));
    } else {
      setTypes((p) => [...p, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <SymptomsSidebarMenu />

          <div className="lg:col-span-3">
            <div className="flex justify-between mb-4">
              <h1 className="text-xl font-semibold">Symptoms Type List</h1>
              <button
  onClick={() => {
    setForm({ id: null, name: "" });
    setOpen(true);
  }}
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
  <span>Add Symptoms Type</span>
</button>

            </div>

            <div className="bg-white rounded shadow">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Symptoms Type</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {types.map((t) => (
                    <tr key={t.id} className="group hover:bg-gray-50">
                      <td className="px-3 py-2">{t.name}</td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => {
                              setForm(t);
                              setOpen(true);
                            }}
                            className="p-1 bg-blue-500 text-white rounded"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() =>
                              setTypes((p) => p.filter((x) => x.id !== t.id))
                            }
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

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white max-w-md w-full rounded shadow">
            <div className="px-4 py-3 text-white flex justify-between
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h2>{form.id ? "Edit" : "Add"} Symptoms Type</h2>
              <button onClick={() => setOpen(false)}><X /></button>
            </div>

            <div className="p-4">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Symptoms Type"
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
