import { Plus } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
export default function AppointmentToolbar({
  search,
  setSearch,
  limit,
  setLimit,
  onAdd,
}) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Search..."
        className="border px-3 py-2 rounded w-full md:w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Actions */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          className="border px-2 py-2 rounded"
        >
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>

        <button
          className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-2 rounded flex items-center gap-1"
          onClick={onAdd}
        >
          <Plus size={16} /> Add Appointment
        </button>

        <button onClick={() => navigate("/admin/appointments/doctor-wise-appointments")} className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-2 rounded">
          Doctor Wise
        </button>

        <button onClick={() => navigate("/admin/appointments/patient-queue")} className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-2 rounded">
          Queue
        </button>
      </div>
    </div>
  );
}