import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import SlotsSidebarMenu from "../../../components/Setup/Appointment/SlotsSidebarMenu";
import { Plus, Pencil, X } from "lucide-react";

export default function AppointmentPriority() {
  const [rows, setRows] = useState([
    { id: 1, name: "Normal" },
    { id: 2, name: "Urgent" },
    { id: 3, name: "Very Urgent" },
    { id: 4, name: "Low" },
  ]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "" });

  const save = () => {
    if (form.id) {
      setRows(rows.map(r => (r.id === form.id ? form : r)));
    } else {
      setRows([...rows, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };

  return (
    <AdminLayout>
      <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <SlotsSidebarMenu />

        <div className="lg:col-span-3">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Appointment Priority</h2>
            <button
              onClick={() => {
                setForm({ id: null, name: "" });
                setOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-white rounded
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
            >
              <Plus size={16} /> Add Priority
            </button>
          </div>

          <div className="bg-white rounded shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Priority</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-2 text-blue-600">{r.name}</td>
                    <td className="p-2">
                      <button
                        onClick={() => {
                          setForm(r);
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
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2">
          <div className="bg-white w-full max-w-sm rounded shadow">
            <div className="flex justify-between items-center px-4 py-3 text-white
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3>{form.id ? "Edit Priority" : "Add Priority"}</h3>
              <X onClick={() => setOpen(false)} />
            </div>

            <div className="p-4">
              <input
                className="w-full border px-3 py-2 rounded"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
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
