import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import MedicineSidebarMenu from "../../../components/Setup/Pharmacy/MedicineSidebarMenu";
import { Plus, Pencil, Trash2, X } from "lucide-react";

export default function MedicineDosage() {
  const [list, setList] = useState([
    { id: 1, category: "Syrup", dosage: "1", unit: "CT" },
    { id: 2, category: "Tablet", dosage: "1/2", unit: "HVL" },
  ]);

  const emptyForm = { id: null, category: "", dosage: "", unit: "" };
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);

  const save = () => {
    if (form.id) {
      setList(list.map((i) => (i.id === form.id ? form : i)));
    } else {
      setList([...list, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <MedicineSidebarMenu />
          </div>

          {/* CONTENT */}
          <div className="lg:col-span-3">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">Medicine Dosage List</h2>
              <button
                onClick={() => { setForm(emptyForm); setOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 text-white rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
              >
                <Plus size={16} /> Add Medicine Dosage
              </button>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {["Category", "Dosage", "Unit", "Action"].map(h => (
                      <th key={h} className="px-3 py-2 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {list.map(row => (
                    <tr key={row.id} className="group hover:bg-gray-50">
                      <td className="px-3 py-2">{row.category}</td>
                      <td className="px-3 py-2">{row.dosage}</td>
                      <td className="px-3 py-2">{row.unit}</td>
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
          <div className="bg-white w-full max-w-xl rounded">
            <div className="flex justify-between px-4 py-3 text-white rounded-t bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3>{form.id ? "Edit Medicine Dosage" : "Add Medicine Dosage"}</h3>
              <button onClick={() => setOpen(false)}><X /></button>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {["category", "dosage", "unit"].map(f => (
                <input
                  key={f}
                  placeholder={f}
                  value={form[f]}
                  onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                  className="border px-3 py-2 rounded"
                />
              ))}
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
