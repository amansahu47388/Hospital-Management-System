import { useState, useEffect } from "react";
import { getDoctors, rescheduleAppointment } from "../../api/appointmentApi";

export default function RescheduleModal({ open, onClose, data, onSuccess }) {
  if (!open || !data) return null;

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctors();
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    if (open) fetchDoctors();
  }, [open]);

  const [form, setForm] = useState({
    doctor: "",
    fees: "",
    shift: "",
    slot: "",
    appointment_date: "",
    priority: "Normal",
    discount: "",
    status: "",
    live_consultant: "No",
    message: "",
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
      const doctor = doctors.find(d => d.full_name === data.doctor);
      setForm({
        doctor: doctor ? doctor.id : "",
        fees: data.fees || "",
        shift: data.shift || "",
        slot: data.slot || "",
        appointment_date: formatDateTimeLocal(data.appointment_date),
        priority: data.priority || "Normal",
        discount: data.discount || "",
        status: data.status || "",
        live_consultant: data.live_consultant || "No",
        message: data.message || "",
      });
    }
  }, [data, doctors]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await rescheduleAppointment(data.id, form);
      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      alert("Failed to reschedule appointment");
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
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
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

          <select name="priority" value={form.priority} onChange={handleChange} className="border p-2">
            <option>Normal</option>
            <option>High</option>
            <option>Emergency</option>
          </select>

          <input
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder="Discount %"
            className="border p-2"
          />

          <select name="status" value={form.status} onChange={handleChange} className="border p-2">
            <option value="">Select Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            name="live_consultant"
            value={form.live_consultant}
            onChange={handleChange}
            className="border p-2 col-span-3"
          >
            <option>No</option>
            <option>Yes</option>
          </select>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Message"
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
