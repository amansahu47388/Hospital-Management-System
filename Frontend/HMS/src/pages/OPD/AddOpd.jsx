import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Search } from "lucide-react";
import AddPatient from "../../components/PatientComponent/AddPatient";

/* ---------------- MOCK PATIENT DATA ---------------- */
const patients = [
  { id: 1, name: "Olivier Thomas" },
  { id: 2, name: "John Marshall" },
  { id: 363, name: "Mahima Shinde" },
  { id: 493, name: "Ankit Singh" },
  { id: 520, name: "Shakib Khanna" },
  { id: 631, name: "Riya Verma" },
];

export default function AddOpd() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  /* ---------------- STATES ---------------- */
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  const [form, setForm] = useState({
    symptomsType: "",
    symptomsTitle: "",
    symptomsDescription: "",
    note: "",
    allergies: "",
    previousIssue: "",
    appointmentDate: "",
    caseId: "",
    casualty: "No",
    oldPatient: "No",
    reference: "",
    consultant: "",
    applyTpa: false,
    chargeCategory: "",
    charge: "",
    standardCharge: "",
    appliedCharge: "",
    discount: "",
    tax: "",
    amount: "",
    paymentMode: "Cash",
    paidAmount: "",
  });

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toString().includes(search)
  );

  /* ---------------- CLOSE DROPDOWN ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                        px-4 py-3 flex items-center justify-between relative">

          {/* SEARCH BAR */}
          <div className="relative w-full max-w-md" ref={dropdownRef}>
            <div className="flex items-center bg-white rounded-md
                            border border-gray-300
                            focus-within:ring-2 focus-within:ring-[#8A63D2]">
              <Search size={16} className="ml-3 text-gray-400" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                placeholder="Search patient by name or ID..."
                className="w-full px-3 py-2 text-sm outline-none rounded-md"
              />
            </div>

            {/* DROPDOWN */}
            {showDropdown && search && (
              <div className="absolute top-full left-0 w-full mt-1
                              bg-white border border-gray-200
                              rounded-md shadow-lg
                              max-h-60 overflow-y-auto z-50">
                {filteredPatients.length ? (
                  filteredPatients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPatient(p);
                        setSearch(`${p.name} (${p.id})`);
                        setShowDropdown(false);
                      }}
                      className="px-4 py-2 text-sm cursor-pointer
                                 flex justify-between
                                 hover:bg-[#F3EEFF] hover:text-[#6046B5]"
                    >
                      <span>{p.name}</span>
                      <span className="text-xs text-gray-400">#{p.id}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    No patient found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* NEW PATIENT */}
          <button
            onClick={() => setIsAddPatientOpen(true)}
            className="ml-3 bg-white text-[#6046B5]
                       px-3 py-1.5 text-sm rounded
                       flex items-center gap-1 whitespace-nowrap"
          >
            <Plus size={14} /> New Patient
          </button>

          {/* CLOSE */}
          <X
            onClick={() => navigate(-1)}
            className="ml-4 text-white cursor-pointer hover:opacity-80"
          />
        </div>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 overflow-y-auto bg-white">

          {/* SELECTED PATIENT INFO */}
          <div className="px-6 pt-4 text-sm text-gray-600">
            {selectedPatient ? (
              <p>
                Selected Patient:{" "}
                <span className="font-semibold text-[#6046B5]">
                  {selectedPatient.name} ({selectedPatient.id})
                </span>
              </p>
            ) : (
              <p>Please search and select a patient</p>
            )}
          </div>

          {/* ================= FORM ================= */}
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT */}
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input className="border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Symptoms Type" />
                  <input className="border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Symptoms Title" />
                  <textarea className="border border-gray-300 px-3 py-2 rounded text-sm md:col-span-3" placeholder="Symptoms Description" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea className="border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Note" />
                  <textarea className="border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Any Known Allergies" />
                </div>

                <textarea className="border border-gray-300 px-3 py-2 rounded text-sm w-full" placeholder="Previous Medical Issue" />
              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                <input type="date" className="border border-gray-300 px-3 py-2 rounded w-full text-sm" />
                <input placeholder="Case" className="border border-gray-300 px-3 py-2 rounded w-full text-sm" />

                <div className="grid grid-cols-2 gap-4">
                  <select className="border border-gray-300 px-3 py-2 rounded text-sm">
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                  <select className="border border-gray-300 px-3 py-2 rounded text-sm">
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </div>

                <input placeholder="Reference" className="border border-gray-300 px-3 py-2 rounded w-full text-sm" />

                <select className="border border-gray-300 px-3 py-2 rounded w-full text-sm">
                  <option>Select Consultant Doctor</option>
                </select>

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" /> Apply TPA
                </label>

                <select className="border border-gray-300 px-3 py-2 rounded w-full text-sm">
                  <option>Charge Category</option>
                </select>

                <select className="border border-gray-300 px-3 py-2 rounded w-full text-sm">
                  <option>Charge</option>
                </select>

                <input disabled className="border border-gray-300 px-3 py-2 rounded w-full bg-gray-100 text-sm" placeholder="Standard Charge ($)" />

                <div className="grid grid-cols-2 gap-2">
                  <input className="border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Applied Charge ($)" />
                  <input className="border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Discount %" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input disabled className="border border-gray-300 px-3 py-2 rounded bg-gray-100 text-sm" placeholder="Tax %" />
                  <input className="border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Amount ($)" />
                </div>

                <select className="border border-gray-300 px-3 py-2 rounded w-full text-sm">
                  <option>Cash</option>
                  <option>Card</option>
                  <option>UPI</option>
                </select>

                <input className="border border-gray-300 px-3 py-2 rounded w-full text-sm" placeholder="Paid Amount ($)" />
              </div>
            </div>
          </div>

          {/* ================= FOOTER ================= */}
          <div className="bg-gray-100 px-4 py-3 flex justify-end gap-2">
            <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-1.5 text-sm rounded">
              Save & Print
            </button>
            <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-1.5 text-sm rounded">
              Save
            </button>
          </div>
        </main>
      </div>

      {/* ================= ADD PATIENT MODAL ================= */}
      <AddPatient open={isAddPatientOpen} onClose={() => setIsAddPatientOpen(false)} />
    </div>
  );
}
