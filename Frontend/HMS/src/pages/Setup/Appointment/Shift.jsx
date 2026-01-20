import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import { useNotify } from "../../../context/NotificationContext";
import SlotsSidebarMenu from "../../../components/Setup/Appointment/SlotsSidebarMenu";

export default function Shift() {
  const notify = useNotify();

  const [rows, setRows] = useState([
    { id: 1, name: "Morning", from: "10:00 AM", to: "12:30 PM" },
    { id: 2, name: "Evening", from: "04:00 PM", to: "07:00 PM" },
  ]);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, name: "", from: "", to: "" });

  const save = () => {
    if (!form.name.trim() || !form.from.trim() || !form.to.trim()) {
      notify("error", "All fields are required");
      return;
    }

    if (form.id) {
      setRows(rows.map(r => (r.id === form.id ? form : r)));
      notify("success", "Shift updated successfully");
    } else {
      setRows([...rows, { ...form, id: Date.now() }]);
      notify("success", "Shift added successfully");
    }
    setOpen(false);
    setForm({ id: null, name: "", from: "", to: "" });
  };

  const handleDelete = (row) => {
    if (!window.confirm(`Delete ${row.name} shift?`)) return;
    setRows(rows.filter(r => r.id !== row.id));
    notify("success", "Shift deleted successfully");
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Shift</h2>

          <button
            onClick={() => {
              setForm({ id: null, name: "", from: "", to: "" });
              setOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md transition hover:opacity-90"
          >
            <Plus size={16} /> Add Shift
          </button>
        </div>

        <div className="flex gap-4">

          <SlotsSidebarMenu />


          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Time From</th>
                  <th className="px-3 py-2 text-left">Time To</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 border-b last:border-0">
                      <td className="px-3 py-2 text-left text-purple-600 font-medium">{r.name}</td>
                      <td className="px-3 py-2 text-left">{r.from}</td>
                      <td className="px-3 py-2 text-left">{r.to}</td>
                      <td className="px-3 py-2 text-left">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setForm(r);
                              setOpen(true);
                            }}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(r)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-400">
                      No shifts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL */}
        {open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
            <div className="bg-white w-full max-w-md rounded-md shadow-xl overflow-hidden">
              <div className="flex justify-between px-4 py-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
                <h3 className="font-semibold">{form.id ? "Edit Shift" : "Add Shift"}</h3>
                <X onClick={() => setOpen(false)} className="cursor-pointer hover:text-gray-200 transition" />
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Shift Name *</label>
                  <input
                    className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                    placeholder="e.g., Morning, Evening"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Time From *</label>
                  <input
                    type="time"
                    className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                    value={form.from}
                    onChange={e => setForm({ ...form, from: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Time To *</label>
                  <input
                    type="time"
                    className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                    value={form.to}
                    onChange={e => setForm({ ...form, to: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end p-4 border-t bg-gray-50">
                <button
                  onClick={save}
                  className="px-8 py-2 text-white rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2] transition hover:opacity-90 shadow-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
