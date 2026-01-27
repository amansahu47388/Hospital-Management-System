import React, { useState, useEffect } from "react";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import { Calendar, Search } from "lucide-react";
import { getDoctors} from "../../api/appointmentApi";
import { getDoctorWiseAppointments } from "../../api/appointmentApi";

/* ---------------- COMPONENT ---------------- */

export default function DoctorWiseAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
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
    if (!selectedDoctor || !selectedDate) {
      setError("Please select both doctor and date");
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await getDoctorWiseAppointments(selectedDoctor, selectedDate);
      setResults(response.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to load appointments");
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
                  className="w-full mt-1 border rounded px-3 py-2 text-sm form-field"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.full_name} 
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
                    className="w-full mt-1 border rounded px-3 py-2 text-sm pr-10 form-field"
                  />
                  <Calendar className="absolute right-3 top-3 text-gray-400 " size={18} />
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
              <table className="w-full text-sm border-separate border-spacing-0 thin-scrollbar">
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
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : results.length > 0 ? (
                    results.map((r, index) => (
                      <tr key={r.id || index} className="hover:bg-gray-50">
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
