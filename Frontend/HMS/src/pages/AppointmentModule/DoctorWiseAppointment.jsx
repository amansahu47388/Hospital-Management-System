import React, { useState } from "react";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import { Calendar, Search } from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

const doctors = [
  { id: 1, name: "Reyan Jain (9011)" },
  { id: 2, name: "Amit Singh (9009)" },
  { id: 3, name: "Neha Sharma (9021)" },
  { id: 4, name: "Rohit Verma (9033)" },
  { id: 5, name: "Priya Patel (9044)" },
];

const appointmentsData = [
  {
    doctorId: 1,
    patient: "Olivier Thomas",
    phone: "7896541230",
    email: "olivier@gmail.com",
    date: "2025-02-12",
    time: "10:30 AM",
    source: "Online",
  },
  {
    doctorId: 1,
    patient: "John Marshall",
    phone: "9856475632",
    email: "john@gmail.com",
    date: "2025-02-12",
    time: "11:00 AM",
    source: "Walk-In",
  },
  {
    doctorId: 2,
    patient: "Maria Taylor",
    phone: "7488548942",
    email: "maria@gmail.com",
    date: "2025-02-13",
    time: "12:00 PM",
    source: "Online",
  },
];

/* ---------------- COMPONENT ---------------- */

export default function DoctorWiseAppointment() {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    const filtered = appointmentsData.filter(
      (a) =>
        a.doctorId === Number(selectedDoctor) &&
        a.date === selectedDate
    );
    setResults(filtered);
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* CARD */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">

            {/* TITLE */}
            <h2 className="text-lg font-semibold mb-4">
              Doctor Wise Appointment
            </h2>

            {/* FILTER SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

              {/* Doctor */}
              <div>
                <label className="text-sm font-medium">
                  Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full mt-1 border rounded px-3 py-2 text-sm"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-medium">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full mt-1 border rounded px-3 py-2 text-sm pr-10"
                  />
                  <Calendar className="absolute right-3 top-3 text-gray-400" size={18} />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex md:justify-end">
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                             text-white px-5 py-2 rounded text-sm flex items-center gap-2"
                >
                  <Search size={16} /> Search
                </button>
              </div>
            </div>

            {/* TABLE SECTION */}
            <div className="mt-6 overflow-x-auto">
              <table className="w-full text-sm border-separate border-spacing-0">
                <thead className="bg-gray-50 border-y">
                  <tr>
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
                    results.map((r, index) => (
                      <tr key={index} className="hover:bg-gray-50">
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
                      <td colSpan={6} className="text-center py-10 text-gray-500">
                        No data available in table  
                        <br />
                        <span className="text-green-600 text-sm">
                          ← Add new record or search with different criteria.
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* RECORD COUNT */}
            <div className="mt-4 text-sm text-gray-500">
              Records: {results.length} of {results.length}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
