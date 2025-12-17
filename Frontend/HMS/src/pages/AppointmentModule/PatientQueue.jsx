import React, { useState } from "react";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import { Calendar, Search, RefreshCw } from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const doctors = [
  { id: 1, name: "Reyan Jain (9011)" },
  { id: 2, name: "Amit Singh (9009)" },
  { id: 3, name: "Neha Sharma (9021)" },
  { id: 4, name: "Rohit Verma (9033)" },
  { id: 5, name: "Priya Patel (9044)" },
];

const shifts = ["Morning", "Evening"];

const slots = [
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
];

const appointments = [
  {
    doctorId: 1,
    shift: "Morning",
    slot: "10:00 - 10:30",
    date: "2025-12-11",
    sno: 1,
    patient: "Olivier Thomas",
    phone: "7896541230",
    email: "olivier@gmail.com",
    time: "10:05 AM",
    source: "Online",
  },
  {
    doctorId: 1,
    shift: "Morning",
    slot: "10:00 - 10:30",
    date: "2025-12-11",
    sno: 2,
    patient: "John Marshall",
    phone: "9856475632",
    email: "john@gmail.com",
    time: "10:15 AM",
    source: "Walk-In",
  },
];

/* ---------------- COMPONENT ---------------- */

export default function PatientQueue() {
  const [doctor, setDoctor] = useState("");
  const [shift, setShift] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (!doctor || !shift || !date) {
      setError("Doctor, Shift and Date are required");
      setResults([]);
      return;
    }

    setError("");

    const filtered = appointments.filter(
      (a) =>
        a.doctorId === Number(doctor) &&
        a.shift === shift &&
        a.date === date &&
        (slot ? a.slot === slot : true)
    );

    setResults(filtered);
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
          className="w-full border rounded px-3 py-2 text-sm mt-1"
        >
          <option value="">Select</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
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
          className="w-full border rounded px-3 py-2 text-sm mt-1"
        >
          <option value="">Select</option>
          {shifts.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {error && !shift && (
          <p className="text-red-500 text-xs mt-1">
            Shift field is required
          </p>
        )}
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
            className="w-full border rounded px-3 py-2 text-sm mt-1 pr-10"
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
          className="w-full border rounded px-3 py-2 text-sm mt-1"
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
      <table className="min-w-[800px] w-full text-sm border-separate border-spacing-0">
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
          {results.length > 0 ? (
            results.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3">{r.sno}</td>
                <td className="px-4 py-3">{r.patient}</td>
                <td className="px-4 py-3">{r.phone}</td>
                <td className="px-4 py-3">{r.email}</td>
                <td className="px-4 py-3">{r.date}</td>
                <td className="px-4 py-3">{r.time}</td>
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
