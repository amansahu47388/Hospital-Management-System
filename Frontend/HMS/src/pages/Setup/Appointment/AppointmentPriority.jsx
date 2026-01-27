import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import { useNotify } from "../../../context/NotificationContext";
import SlotsSidebarMenu from "../../../components/Setup/Appointment/SlotsSidebarMenu";
import { getPriorities, createPriority, updatePriority, deletePriority } from "../../../api/appointmentApi";


export default function AppointmentPriority() {
  const notify = useNotify();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, priority: "" });

  useEffect(() => {
    fetchPriorities();
  }, []);

  const fetchPriorities = async () => {
    setLoading(true);
    try {
      const response = await getPriorities();
      setRows(response.data);
    } catch (err) {
      console.error("Error fetching priorities:", err);
      notify("error", "Failed to fetch priorities");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!form.priority.trim()) {
      notify("error", "Priority name is required");
      return;
    }

    try {
      if (form.id) {
        await updatePriority(form.id, { priority: form.priority });
        notify("success", "Priority updated successfully");
      } else {
        await createPriority({ priority: form.priority });
        notify("success", "Priority added successfully");
      }
      fetchPriorities();
      setOpen(false);
      setForm({ id: null, priority: "" });
    } catch (err) {
      console.error("Error saving priority:", err);
      notify("error", "Failed to save priority");
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete ${row.priority}?`)) return;
    try {
      await deletePriority(row.id);
      notify("success", "Priority deleted successfully");
      fetchPriorities();
    } catch (err) {
      console.error("Error deleting priority:", err);
      notify("error", "Failed to delete priority");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Appointment Priority</h2>

          <button
            onClick={() => {
              setForm({ id: null, priority: "" });
              setOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-b
            from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded-md transition hover:opacity-90"
          >
            <Plus size={16} /> Add Priority
          </button>
        </div>

        <div className="flex gap-4">
          <SlotsSidebarMenu />

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow thin-scrollbar">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Priority</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.length > 0 ? (
                  rows.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 border-b border-gray-200">
                      <td className="px-3 py-2 text-left text-purple-600 font-medium">{r.priority}</td>
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
                    <td colSpan="2" className="text-center py-8 text-gray-400">
                      No priorities found
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
            <div className="bg-white w-full max-w-sm rounded-md shadow-xl overflow-hidden">
              <div className="flex justify-between px-4 py-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
                <h3 className="font-semibold">{form.id ? "Edit Priority" : "Add Priority"}</h3>
                <X onClick={() => setOpen(false)} className="cursor-pointer hover:text-gray-200 transition" />
              </div>

              <div className="p-4">
                <label className="text-xs font-medium text-gray-500 uppercase">Priority Name *</label>
                <input
                  className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                  placeholder="Enter priority name"
                  value={form.priority}
                  onChange={e => setForm({ ...form, priority: e.target.value })}
                />
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
