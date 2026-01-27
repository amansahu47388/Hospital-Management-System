import React, { useState, useEffect } from "react";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import { Calendar, Search, RefreshCw } from "lucide-react";
import { getDoctors } from "../../api/adminApi";
import { getPatientQueue } from "../../api/appointmentApi";

/* ---------------- MOCK DATA ---------------- */

const shifts = ["Morning", "Evening"];

const slots = [
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
];

/* ---------------- COMPONENT ---------------- */

export default function PatientQueue() {
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState("");
  const [shift, setShift] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await getDoctors();
        setDoctors(response.data);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to load doctors");
      }
    };
    fetchDoctors();
  }, []);

  const handleSearch = async () => {
    if (!doctor || !shift || !date) {
      setError("Doctor, Shift and Date are required");
      setResults([]);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await getPatientQueue(doctor, date, shift, slot);
      setResults(response.data);
    } catch (err) {
      console.error("Error fetching patient queue:", err);
      setError("Failed to load patient queue");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

       <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
  <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sm:p-6">

    {/* TITLE */}
    <h2 className="text-lg font-semibold mb-4">Patient Queue</h2>

    {/* FILTERS */}
    <div
      className="
        grid grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-5
        gap-4
        items-end
      "
    >
      {/* Doctor */}
      <div>
        <label className="text-sm font-medium">
          Doctor <span className="text-red-500">*</span>
        </label>
        <select
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm mt-1 form-field"
        >
          <option value="">Select</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.full_name} ({d.user?.phone || 'N/A'})
            </option>
          ))}
        </select>
      </div>

      {/* Shift */}
      <div>
        <label className="text-sm font-medium">
          Shift <span className="text-red-500">*</span>
        </label>
        <select
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm mt-1 form-field"
        >
          <option value="">Select</option>
          {shifts.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {/* {error && !shift && (
          <p className="text-red-500 text-xs mt-1">
            Shift field is required
          </p>
        )} */}
      </div>

      {/* Date */}
      <div>
        <label className="text-sm font-medium">
          Date <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm mt-1 pr-10 form-field"
          />
          <Calendar
            size={18}
            className="absolute right-3 top-3 text-gray-400"
          />
        </div>
      </div>

      {/* Slot */}
      <div>
        <label className="text-sm font-medium">Slot</label>
        <select
          value={slot}
          onChange={(e) => setSlot(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm mt-1 form-field"
        >
          <option value="">Select</option>
          {slots.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-2 w-full lg:justify-end">
        <button
          className="
            w-full sm:w-auto
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded text-sm
            flex items-center justify-center gap-2
            hover:opacity-90 transition
          "
        >
          <RefreshCw size={16} /> Reorder Queue
        </button>

        <button
          onClick={handleSearch}
          className="
            w-full sm:w-auto
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-4 py-2 rounded text-sm
            flex items-center justify-center gap-2
            hover:opacity-90 transition
          "
        >
          <Search size={16} /> Search
        </button>
      </div>
    </div>

    {/* TABLE */}
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-[800px] w-full text-sm border-separate border-spacing-0  thin-scrollbar">
        <thead className="bg-gray-50 border-y">
          <tr>
            <th className="px-4 py-2 text-left">Appointment S.No.</th>
            <th className="px-4 py-2 text-left">Patient Name</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Time</th>
            <th className="px-4 py-2 text-left">Source</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={7} className="text-center py-10 text-gray-500">
                Loading...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td colSpan={7} className="text-center py-10 text-red-500">
                {error}
              </td>
            </tr>
          ) : results.length > 0 ? (
            results.map((r, i) => (
              <tr key={r.id || i} className="hover:bg-gray-50">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3">{r.patient_details?.full_name || 'N/A'}</td>
                <td className="px-4 py-3">{r.patient_details?.phone || r.phone || 'N/A'}</td>
                <td className="px-4 py-3">{r.patient_details?.email || 'N/A'}</td>
                <td className="px-4 py-3">{new Date(r.appointment_date).toLocaleDateString()}</td>
                <td className="px-4 py-3">{new Date(r.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                <td className="px-4 py-3">{r.source}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-10 text-red-500">
                No Record Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  </div>
</main>

      </div>
    </div>
  );
}
