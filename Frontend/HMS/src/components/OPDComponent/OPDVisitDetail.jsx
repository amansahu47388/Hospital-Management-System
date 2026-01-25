import React from "react";
import { X } from "lucide-react";

export default function OPDVisitDetail({ open, onClose, opd }) {
  if (!open || !opd) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* PANEL */}
      <div className="bg-white w-[98%] md:w-[90%] lg:w-[80%] rounded-lg shadow-lg overflow-y-auto max-h-[90vh] mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 sticky top-0 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Visit Details</h2>
          <div className="flex gap-3">
            <button
              title="Close"
              className="cursor-pointer hover:opacity-80"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto text-sm">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
            <Field label="OPD Checkup ID" value={opd.checkup_id} />
            <Field label="OPD ID" value={`OPDN${opd.opd_id}`} />

            <Field label="Case ID" value={opd.case_id} />
            <Field
              label="Patient Name"
              value={`${opd.patient_detail.first_name} ${opd.patient_detail.last_name}`}
            />

            <Field label="Old Patient" value={opd.old_patient ? "Yes" : "No"} />
            <Field label="Guardian Name" value={opd.patient_detail.emergency_contact_name || "—"} />

            <Field label="Phone" value={opd.patient_detail.phone} />
            <Field label="Email" value={opd.patient_detail.email || "—"} />

            <Field label="Address" value={opd.patient_detail.address} />
            <Field label="Age" value={`${opd.patient_detail.age} Year`} />

            <Field label="Blood Group" value={opd.patient_detail.blood_group} />
            <Field label="Known Allergies" value={opd.known_allergies || "—"} />

            <Field
              label="Appointment Date"
              value={opd.appointment_date
                ? new Date(opd.appointment_date).toLocaleString()
                : "—"}
            />

            <Field label="Case" value={opd.case_id} />
            <Field label="Reference" value={opd.reference || "—"} />

            <Field
              label="Consultant Doctor"
              value={`${opd.doctor_detail?.full_name}`}
            />
          </div>

          {/* SYMPTOMS */}
          <div className="mt-6">
            <p className="font-semibold mb-1">Symptoms</p>
            <p className="text-gray-700 leading-relaxed">
              {opd.symptom_name || "—"}
            </p>
          </div>

          {/* PREVIOUS MEDICAL ISSUE */}
          <div className="mt-4">
            <p className="font-semibold mb-1">Previous Medical Issue</p>
            <p className="text-gray-700">
              {opd.previous_medical_issue || "NA"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* SMALL FIELD COMPONENT */
const Field = ({ label, value }) => (
  <div className="flex">
    <span className="w-40 font-medium text-gray-600">{label}</span>
    <span className="text-gray-800">{value || "—"}</span>
  </div>
);
