import { X, Search, Plus, UserPlus } from "lucide-react";
import React from "react";
import AddPatient from "../PatientComponent/AddPatient";
import { useState } from "react";

export default function BillHeader({
  onClose,
  applyTPA,
  setApplyTPA
}) {
  const [openAddPatient, setOpenAddPatient] = useState(false);

     
  return (
    <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-3 shadow-md">

      <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">

        {/* ================= LEFT : PATIENT SELECT ================= */}
        <div className="flex flex-1 min-w-[260px] items-center gap-2">
          <select
            className="   w-full bg-white text-gray-800 px-3 py-2 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option>Select Patient</option>
            <option>John Doe</option>
            <option>Rahul Sharma</option>
          </select>

          <button

               onClick={() => setOpenAddPatient(true)}
            className="flex items-center gap-1 px-3 py-2 rounded-md 
                       bg-white text-[#6046B5] font-semibold 
                       hover:bg-gray-100 transition whitespace-nowrap"
          >
            <Plus size={16} />
            New Patient
          </button>
        </div>

        {/* ================= CENTER : PRESCRIPTION ================= */}
        <div className="flex items-center gap-2 min-w-[240px] flex-1">
          <div className="relative w-full">
            <input
              placeholder="Prescription No"
              className="w-full pl-3 pr-10 py-2 rounded-md text-gray-800 
                         focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              className="absolute right-1 top-1/2 -translate-y-1/2 
                         bg-white p-1.5 rounded hover:bg-gray-100"
            >
              <Search size={18} className="text-[#6046B5]" />
            </button>
          </div>
        </div>

        {/* ================= RIGHT : TPA + CLOSE ================= */}
        <div className="flex items-center gap-4 justify-end ml-auto">

          {/* Apply TPA */}
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer whitespace-nowrap">
            <input
              type="checkbox"
              checked={applyTPA}
              onChange={(e) => setApplyTPA(e.target.checked)}
              className="accent-white"
            />
            Apply TPA
          </label>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition"
            title="Close"
          >
            <X size={22} />
          </button>
        </div>
      </div>

       {openAddPatient && (
  <AddPatient
    open={openAddPatient}
    onClose={() => setOpenAddPatient(false)}
  />
)}

    </div>
  );
}
