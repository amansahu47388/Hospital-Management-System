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

export default function AddIpdAdmission() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  /* ---------------- STATES ---------------- */
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openAddPatient, setOpenAddPatient] = useState(false);

  const [form, setForm] = useState({
    symptomsType: "",
    symptomsTitle: "",
    symptomsDescription: "",
    note: "",
    previousIssue: "",
    admissionDate: "",
    caseId: "",
    tpa: "",
    casualty: "No",
    oldPatient: "No",
    creditLimit: "20000",
    reference: "",
    consultant: "",
    bedGroup: "",
    bedNumber: "",
    liveConsultation: "No",
  });

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  /* ---------------- FILTER PATIENTS ---------------- */
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
                        px-4 py-3 flex items-center justify-between">

          {/* SEARCH PATIENT */}
          <div className="relative w-full max-w-md" ref={dropdownRef}>
            <div className="flex items-center bg-white rounded-md border">
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

            {showDropdown && search && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
                {filteredPatients.length ? (
                  filteredPatients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPatient(p);
                        setSearch(`${p.name} (${p.id})`);
                        setShowDropdown(false);
                      }}
                      className="px-4 py-2 text-sm cursor-pointer flex justify-between
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

          {/* ADD PATIENT */}
          <button
            onClick={() => setOpenAddPatient(true)}
            className="ml-3 bg-white text-[#6046B5]
                       px-3 py-1.5 text-sm rounded
                       flex items-center gap-1"
          >
            <Plus size={14} /> New Patient
          </button>

          {/* CLOSE */}
          <X
            onClick={() => navigate(-1)}
            className="ml-4 text-white cursor-pointer"
          />
        </div>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 overflow-y-auto bg-white">

          {/* SELECTED PATIENT */}
          <div className="px-6 pt-4 text-sm text-gray-600">
            {selectedPatient ? (
              <span className="font-semibold text-[#6046B5]">
                {selectedPatient.name} ({selectedPatient.id})
              </span>
            ) : (
              "Please search and select a patient"
            )}
          </div>

          {/* ================= FORM ================= */}
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT */}
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Symptoms Type"
                    value={form.symptomsType}
                    onChange={(e) => update("symptomsType", e.target.value)}
                  />
                  <Field label="Symptoms Title"
                    value={form.symptomsTitle}
                    onChange={(e) => update("symptomsTitle", e.target.value)}
                  />
                  <Field label="Symptoms Description"
                    value={form.symptomsDescription}
                    onChange={(e) => update("symptomsDescription", e.target.value)}
                  />
                </div>

                <Textarea label="Note"
                  value={form.note}
                  onChange={(e) => update("note", e.target.value)}
                />

                <Textarea label="Previous Medical Issue"
                  value={form.previousIssue}
                  onChange={(e) => update("previousIssue", e.target.value)}
                />
              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                <Field type="date" label="Admission Date *"
                  value={form.admissionDate}
                  onChange={(e) => update("admissionDate", e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Case"
                    value={form.caseId}
                    onChange={(e) => update("caseId", e.target.value)}
                  />
                  <Field label="TPA" value={form.tpa} disabled bg />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select label="Casualty"
                    value={form.casualty}
                    onChange={(e) => update("casualty", e.target.value)}
                  />
                  <Select label="Old Patient"
                    value={form.oldPatient}
                    onChange={(e) => update("oldPatient", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Credit Limit ($) *"
                    value={form.creditLimit}
                    onChange={(e) => update("creditLimit", e.target.value)}
                  />
                  <Field label="Reference"
                    value={form.reference}
                    onChange={(e) => update("reference", e.target.value)}
                  />
                </div>

                <Select label="Consultant Doctor *">
                  <option>Select</option>
                </Select>

                <Select label="Bed Group">
                  <option>Select</option>
                </Select>

                <Select label="Bed Number *">
                  <option>Select</option>
                </Select>

                <Select label="Live Consultation"
                  value={form.liveConsultation}
                  onChange={(e) => update("liveConsultation", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-gray-100 px-4 py-3 flex justify-end">
            <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                               text-white px-6 py-1.5 text-sm rounded">
              Save
            </button>
          </div>
        </main>
      </div>

      {/* ADD PATIENT MODAL */}
      <AddPatient open={openAddPatient} onClose={() => setOpenAddPatient(false)} />
    </div>
  );
}

/* ================= REUSABLE FIELDS ================= */

const Field = ({ label, bg, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      {...props}
      className={`w-full border px-3 py-2 rounded text-sm
        ${bg ? "bg-gray-100 cursor-not-allowed" : ""}`}
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      {...props}
      rows={3}
      className="w-full border px-3 py-2 rounded text-sm"
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      {...props}
      className="w-full border px-3 py-2 rounded text-sm"
    >
      {children || (
        <>
          <option>No</option>
          <option>Yes</option>
        </>
      )}
    </select>
  </div>
);
