import React, { useEffect, useState } from "react";
import { X, Undo2  } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { revertIpdDischarge } from "../../api/ipdApi";


export default function DischargeVisitDetail({ open, onClose, ipd }) {
  /* ================= HOOKS (ALWAYS FIRST) ================= */
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);


  useEffect(() => {
    if (!open || !ipd) return;

    setLoading(true);

    // Here you can call API if needed
    setData(ipd);
    setLoading(false);

  }, [open, ipd]);

  /* ================= CONDITIONAL RENDER AFTER HOOKS ================= */

  if (!open) return null;

  if (!ipd) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">
          Loading...
        </div>
      </div>
    );
  }

  const handleRevertDischarge = async () => {
  if (!window.confirm("Are you sure you want to revert discharge?")) return;

  try {
    await revertIpdDischarge(data.ipd_id);
    alert("Discharge reverted successfully");

    onClose();
    navigate("/admin/ipd-patients");
  } catch (err) {
    const msg =
      err.response?.data?.detail ||
      "Failed to revert discharge";
    alert(msg);
  }
   };


   const dischargeStatus = data?.discharge?.status;

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white w-[80%] max-h-[90vh] rounded-lg shadow overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Discharge Visit Details</h2>
          <div className="flex justify-center px-2 gap-2 ">
            <button
          title="Revert Discharge"
          className="cursor-pointer hover:opacity-80"
          onClick={handleRevertDischarge}>
            <Undo2 />
          </button>
          <X className="cursor-pointer" onClick={onClose} />
          </div>
         
        </div>

        {/* BODY */}
        <div className="p-6 text-sm">
          {loading && <p>Loading...</p>}

          {!loading && data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Patient Name"
                value={`${data.patient_detail.first_name} ${data.patient_detail.last_name}`} />

              <Field label="IPD No" value={`IPDN${data.ipd_id}`} />
              <Field label="Case ID" value={data.case_id} />
              <Field label="Gender" value={data.patient_detail.gender} />
              <Field label="Phone" value={data.patient_detail.phone} />
              <Field label="Doctor" value={data.doctor_detail?.full_name} />
              <Field label="Created By" value={data.created_by?.role} />

              <Field
                label="Admission Date"
                value={new Date(data.appointment_date).toLocaleString()}
              />

              <Field
                label="Discharge Date"
                value={new Date(data.discharge_date).toLocaleString()}
              />

              <Field
                label="Discharge Status"
                value={data.discharge?.status}
              />
              {/* DEATH DETAILS */}
          {dischargeStatus === "death" && (
                <>
                <Field
                  label="Death Date"
                  value={formatDate(data.discharge?.death_date)}
                />
                <Field
                  label="Guardian Name"
                  value={data.discharge?.guardian_name}
                />
                <Field
                  label="Report"
                  value={data.discharge?.report}
                />
                <Field
                  label="Attachment"
                  value={
                    data.discharge?.attachment ? (
                      <a
                        href={data.discharge.attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View File
                      </a>
                    ) : "—"
                  }
                />
               </>
          )}

           {/* REFERRAL DETAILS */}
          {dischargeStatus === "referral" && (
               <>
                <Field
                  label="Referral Date"
                  value={formatDate(data.discharge?.referral_date)}
                />
                <Field
                  label="Referral Hospital"
                  value={data.discharge?.hospital_name}
                />
                <Field
                  label="Referral Reason"
                  value={data.discharge?.reason}
                />
             </>
          )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL FIELD COMPONENT ================= */

const Field = ({ label, value }) => (
  <div className="flex">
    <span className="w-44 font-medium text-gray-600">{label}</span>
    <span className="text-gray-800">{value || "—"}</span>
  </div>
);

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleString();
};
