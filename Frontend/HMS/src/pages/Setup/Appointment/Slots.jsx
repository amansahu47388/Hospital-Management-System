import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../../../layout/AdminLayout";
import { useNotify } from "../../../context/NotificationContext";
import SlotsSidebarMenu from "../../../components/Setup/Appointment/SlotsSidebarMenu";
// import {
//   getAppointmentSlots,
//   createAppointmentSlot,
//   updateAppointmentSlot,
//   deleteAppointmentSlot,
//   getDoctors,
//   getShifts
// } from "../../../api/appointmentApi";
import { getHospitalCharges } from "../../../api/setupApi";

export default function Slots() {
  const notify = useNotify();

  const [rows, setRows] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    id: null,
    Doctor: "",
    shift: "",
    charges: "",
    time_interval: "",
    consultant_duration_minutes: ""
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [slotsRes, docsRes, shiftsRes, chargesRes] = await Promise.all([
        getAppointmentSlots(),
        getDoctors(),
        getShifts(),
        getHospitalCharges()
      ]);
      setRows(slotsRes.data);
      setDoctors(docsRes.data);
      setShifts(shiftsRes.data);
      setCharges(chargesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      notify("error", "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const response = await getAppointmentSlots();
      setRows(response.data);
    } catch (err) {
      console.error("Error fetching slots:", err);
    }
  };

  const save = async () => {
    if (!form.Doctor || !form.shift || !form.charges || !form.consultant_duration_minutes) {
      notify("error", "All fields are required");
      return;
    }

    try {
      const payload = {
        Doctor: parseInt(form.Doctor),
        shift: parseInt(form.shift),
        charges: parseInt(form.charges),
        consultant_duration_minutes: parseInt(form.consultant_duration_minutes)
      };

      if (form.id) {
        await updateAppointmentSlot(form.id, payload);
        notify("success", "Slot updated successfully");
      } else {
        await createAppointmentSlot(payload);
        notify("success", "Slot added successfully");
      }
      fetchSlots();
      setOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error saving slot:", err);
      notify("error", "Failed to save slot");
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Delete this slot configuration?")) return;
    try {
      await deleteAppointmentSlot(row.id);
      notify("success", "Slot deleted successfully");
      fetchSlots();
    } catch (err) {
      console.error("Error deleting slot:", err);
      notify("error", "Failed to delete slot");
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      Doctor: "",
      shift: "",
      charges: "",
      time_interval: "",
      consultant_duration_minutes: ""
    });
  };

  const getDoctorName = (id) => {
    return doctors.find(d => d.id === id)?.full_name || "Unknown Doctor";
  };

  const getShiftName = (id) => {
    return shifts.find(s => s.id === id)?.shift || "Unknown Shift";
  };

  const getChargeName = (id) => {
    return charges.find(c => c.id === id)?.name || "Unknown Charge";
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1">

        {/* HEADER */}
        <div className="bg-white rounded-md p-3 mb-4 flex justify-between items-center shadow">
          <h2 className="text-lg font-semibold">Slots</h2>

          <button
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
            className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md transition hover:opacity-90 shadow-md"
          >
            <Plus size={16} /> Add Slot
          </button>
        </div>

        <div className="flex gap-4">
          <SlotsSidebarMenu />

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-md overflow-x-auto shadow">
            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Doctor</th>
                    <th className="px-3 py-2 text-left">Shift</th>
                    <th className="px-3 py-2 text-left">Time From</th>
                    <th className="px-3 py-2 text-left">Time To</th>
                    <th className="px-3 py-2 text-left">Charge</th>
                    <th className="px-3 py-2 text-left">Doctor Charges</th>
                    <th className="px-3 py-2 text-left">Duration (Min)</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length > 0 ? (
                    rows.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 border-b border-gray-200">
                        <td className="px-3 py-2 text-left text-purple-600 font-medium">
                          {getDoctorName(r.Doctor)}
                        </td>
                        <td className="px-3 py-2 text-left">{getShiftName(r.shift)}</td>
                        <td className="px-3 py-2 text-left">{getChargeName(r.charges)}</td>
                        <td className="px-3 py-2 text-left">{r.consultant_duration_minutes}</td>
                        <td className="px-3 py-2 text-left">
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setForm({
                                  id: r.id,
                                  Doctor: r.Doctor,
                                  shift: r.shift,
                                  charges: r.charges,
                                  consultant_duration_minutes: r.consultant_duration_minutes
                                });
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
                      <td colSpan="5" className="text-center py-8 text-gray-400">
                        No slots found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* MODAL */}
        {open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-2">
            <div className="bg-white w-full max-w-lg rounded-md shadow-xl overflow-hidden">
              <div className="flex justify-between px-4 py-3 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
                <h3 className="font-semibold">{form.id ? "Edit Slot" : "Add Slot"}</h3>
                <X onClick={() => setOpen(false)} className="cursor-pointer hover:text-gray-200 transition" />
              </div>

              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Doctor *</label>
                    <select
                      className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                      value={form.Doctor}
                      onChange={e => setForm({ ...form, Doctor: e.target.value })}
                    >
                      <option value="">Select Doctor</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.full_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Consultation Duration (Min) *</label>
                    <input
                      type="number"
                      className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                      placeholder="e.g., 15"
                      value={form.consultant_duration_minutes}
                      onChange={e => setForm({ ...form, consultant_duration_minutes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Shift *</label>
                    <select
                      className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                      value={form.shift}
                      onChange={e => setForm({ ...form, shift: e.target.value })}
                    >
                      <option value="">Select Shift</option>
                      {shifts.map(s => (
                        <option key={s.id} value={s.id}>{s.shift}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Charge Category *</label>
                    <select
                      className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                      value={form.charges}
                      onChange={e => setForm({ ...form, charges: e.target.value })}
                    >
                      <option value="">Select Charge</option>
                      {charges.map(c => (
                        <option key={c.id} value={c.id}>{c.name} (${c.standard_charge})</option>
                      ))}
                    </select>
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-4">

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Charge name *</label>
                    <select
                      className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition"
                      value={form.charges}
                      onChange={e => setForm({ ...form, charges: e.target.value })}
                    >
                      <option value="">Select Charge</option>
                      {charges.map(c => (
                        <option key={c.id} value={c.id}>{c.name} (${c.standard_charge})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Amount*</label>
                    <input type="text" className="w-full border p-2 rounded mt-1 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition" value={form.charges} onChange={e => setForm({ ...form, charges: e.target.value })} />
                  </div>
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

