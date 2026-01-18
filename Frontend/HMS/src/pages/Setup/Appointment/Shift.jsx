import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import SlotsSidebarMenu from "../../../components/Setup/Appointment/SlotsSidebarMenu";
import { Plus, Pencil, X } from "lucide-react";

export default function Shift() {
  const [rows, setRows] = useState([
    { id: 1, name: "Morning", from: "10:00 AM", to: "12:30 PM" },
    { id: 2, name: "Evening", from: "04:00 PM", to: "07:00 PM" },
  ]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", from: "", to: "" });

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
            <h2 className="text-xl font-semibold">Shift</h2>
            <button
              onClick={() => {
                setForm({ id: null, name: "", from: "", to: "" });
                setOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-white rounded
              bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
            >
              <Plus size={16} /> Add Shift
            </button>
          </div>

          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2">Time From</th>
                  <th className="p-2">Time To</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-2 text-blue-600">{r.name}</td>
                    <td className="p-2">{r.from}</td>
                    <td className="p-2">{r.to}</td>
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
          <div className="bg-white w-full max-w-md rounded shadow">
            <div className="flex justify-between items-center px-4 py-3 text-white
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
              <h3>{form.id ? "Edit Shift" : "Add Shift"}</h3>
              <X onClick={() => setOpen(false)} />
            </div>

            <div className="p-4 space-y-3">
              <input
                placeholder="Name"
                className="w-full border px-3 py-2 rounded"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                placeholder="Time From"
                className="w-full border px-3 py-2 rounded"
                value={form.from}
                onChange={e => setForm({ ...form, from: e.target.value })}
              />
              <input
                placeholder="Time To"
                className="w-full border px-3 py-2 rounded"
                value={form.to}
                onChange={e => setForm({ ...form, to: e.target.value })}
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
