import { useState, useEffect } from "react";
import { getDoctors, rescheduleAppointment, getShifts, getPriorities } from "../../api/appointmentApi";

export default function RescheduleModal({ open, onClose, data, onSuccess }) {
  if (!open || !data) return null;

  const [doctors, setDoctors] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, shiftsRes, prioritiesRes] = await Promise.all([
          getDoctors(),
          getShifts(),
          getPriorities()
        ]);
        setDoctors(docsRes.data);
        setShifts(shiftsRes.data);
        setPriorities(prioritiesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (open) fetchData();
  }, [open]);

  const [form, setForm] = useState({
    doctor: "",
    fees: "",
    shift: "",
    slot: "",
    appointment_date: "",
    appontmet_priority: "",
    status: "",
    reason: "", // backend has 'reason', not 'message'
  });

  // Safe date formatter
  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 16);
  };

  // Load data when modal opens
  useEffect(() => {
    if (data) {
      setForm({
        doctor: data.doctor || "",
        fees: data.fees || "",
        shift: data.shift || "",
        slot: data.slot || "",
        appointment_date: formatDateTimeLocal(data.appointment_date),
        appontmet_priority: data.appontmet_priority || "",
        status: data.status || "",
        reason: data.reason || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Prepare data for backend
      const submitData = {
        ...form,
        doctor: parseInt(form.doctor) || null,
        shift: parseInt(form.shift) || null,
        appontmet_priority: parseInt(form.appontmet_priority) || null,
        fees: parseFloat(form.fees) || 0,
        appointment_date: new Date(form.appointment_date).toISOString()
      };

      await rescheduleAppointment(data.id, submitData);
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      alert("Failed to reschedule appointment: " + (error.response?.data ? JSON.stringify(error.response.data) : error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[900px] rounded shadow-lg">

        {/* 🔵 Blue Header */}
        <div className="bg-purple-600 text-white px-4 py-3 flex justify-between items-center">
          <h2 className="font-semibold">Reschedule</h2>
          <button onClick={onClose} className="text-xl">×</button>
        </div>

        {/* Form */}
        <div className="p-4 grid grid-cols-3 gap-4">
          <select name="doctor" value={form.doctor} onChange={handleChange} className="border p-2">
            <option value="">Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.full_name || doc.email}
              </option>
            ))}
          </select>

          <input
            name="fees"
            value={form.fees}
            onChange={handleChange}
            placeholder="Doctor Fees ($)"
            className="border p-2"
          />

          <select name="shift" value={form.shift} onChange={handleChange} className="border p-2">
            <option value="">Select Shift</option>
            {shifts.map(s => (
              <option key={s.id} value={s.id}>{s.shift}</option>
            ))}
          </select>

          <select name="slot" value={form.slot} onChange={handleChange} className="border p-2">
            <option value="">Select Slot</option>
            <option value="09:00-09:30">09:00 - 09:30</option>
            <option value="09:30-10:00">09:30 - 10:00</option>
            <option value="10:00-10:30">10:00 - 10:30</option>
            <option value="10:30-11:00">10:30 - 11:00</option>
            <option value="11:00-11:30">11:00 - 11:30</option>
            <option value="11:30-12:00">11:30 - 12:00</option>
            <option value="14:00-14:30">14:00 - 14:30</option>
            <option value="14:30-15:00">14:30 - 15:00</option>
            <option value="15:00-15:30">15:00 - 15:30</option>
            <option value="15:30-16:00">15:30 - 16:00</option>
            <option value="16:00-16:30">16:00 - 16:30</option>
            <option value="16:30-17:00">16:30 - 17:00</option>
          </select>

          <input
            type="datetime-local"
            name="appointment_date"
            value={form.appointment_date}
            onChange={handleChange}
            className="border p-2"
          />

          <select name="appontmet_priority" value={form.appontmet_priority} onChange={handleChange} className="border p-2">
            <option value="">Select Priority</option>
            {priorities.map(p => (
              <option key={p.id} value={p.id}>{p.priority}</option>
            ))}
          </select>

          <select name="status" value={form.status} onChange={handleChange} className="border p-2">
            <option value="">Select Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Reason"
            className="border p-2 col-span-3"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
