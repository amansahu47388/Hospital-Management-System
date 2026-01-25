import { X  } from "lucide-react";

export default function IPDVisitDetail({ open, onClose, ipd }) {
  if (!open || !ipd) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* PANEL */}
      <div className="bg-white w-[98%] md:w-[90%] lg:w-[80%] rounded-lg shadow-lg overflow-y-auto max-h-[90vh] mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 sticky top-0 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">IPD Visit Details</h2>
          <div className="flex gap-3">
            <X onClick={onClose} className="cursor-pointer hover:opacity-80" size={18} />
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto text-sm">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
            <Field label="Checkup ID" value={ipd.checkup_id} />
            <Field label="IPD ID" value={`IPDN${ipd.ipd_id}`} />

            <Field label="Case ID" value={`CSEN${ipd.case_id}`} />
            <Field
              label="Patient Name"
              value={`${ipd.patient_detail.first_name} ${ipd.patient_detail.last_name}`}
            />

            <Field label="Old Patient" value={ipd.old_patient ? "Yes" : "No"} />
            <Field label="Guardian Name" value={ipd.patient_detail.emergency_contact_name || "—"} />

            <Field label="Phone" value={ipd.patient_detail.phone} />
            <Field label="Email" value={ipd.patient_detail.email || "—"} />

            <Field label="Address" value={ipd.patient_detail.address} />
            <Field label="Age" value={`${ipd.patient_detail.age} Year`} />

            <Field label="Blood Group" value={ipd.patient_detail.blood_group} />
            <Field label="Known Allergies" value={ipd.known_allergies || "—"} />

            <Field
              label="Admission Date"
              value={ipd.admission_date
                ? new Date(ipd.admission_date).toLocaleString()
                : "—"}
            />

            <Field label="Credit Limit" value={ipd.credit_limit} />
            <Field label="Reference" value={ipd.reference || "—"} />

            <Field
              label="Consultant Doctor"
              value={`${ipd.doctor_detail?.full_name}`}
            />
            <Field label="Bed" value={ipd.bed ? `${ipd.bed.bed_name} - ${ipd.bed.bed_type} - ${ipd.bed.floor ?? ""}` : "-"} />
          </div>

          {/* SYMPTOMS */}
          <div className="mt-6">
            <p className="font-semibold mb-1">Symptoms</p>
            <p className="text-gray-700 leading-relaxed">
              {ipd.symptom_name} {ipd.symptom_description}
            </p>
          </div>

          {/* PREVIOUS MEDICAL ISSUE */}
          <div className="mt-4">
            <p className="font-semibold mb-1">Previous Medical Issue</p>
            <p className="text-gray-700">
              {ipd.previous_medical_issue || "NA"}
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
