import { useState, useEffect } from "react";
import { X, Undo2, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { revertIpdDischarge } from "../../api/ipdApi";
import { getHeaders } from "../../api/setupApi";
import { printReport } from "../../utils/printUtils";

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleString();
};

export default function DischargeVisitDetail({ open, onClose, ipd }) {
  /* ================= HOOKS (ALWAYS FIRST) ================= */
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [headerData, setHeaderData] = useState(null);

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const res = await getHeaders();
        if (res.data && res.data.length > 0) {
          setHeaderData(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching discharge headers:", err);
      }
    };
    fetchHeaders();
  }, []);

  useEffect(() => {
    if (!open || !ipd) return;
    setLoading(true);
    setData(ipd);
    setLoading(false);
  }, [open, ipd]);

  /* ================= CONDITIONAL RENDER AFTER HOOKS ================= */
  if (!open) return null;

  if (!ipd) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow">Loading...</div>
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
      const msg = err.response?.data?.detail || "Failed to revert discharge";
      alert(msg);
    }
  };

  const handlePrint = () => {
    if (!data) return;

    const content = `
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #6046B5; padding-bottom: 5px; margin-bottom: 20px;">
          <h2 style="margin:0; color:#6046B5; font-size:20px;">DISCHARGE SUMMARY</h2>
          <div style="text-align:right; font-size:12px; font-weight:bold;">
            <div>Case ID: ${data.case_id}</div>
            <div>IPD No: IPDN${data.ipd_id}</div>
            <div>Date: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="data-grid" style="background:#f9f9f9; padding:15px; border-radius:8px; border:1px solid #eee; margin-bottom:25px;">
          <div class="data-item"><span class="data-label">Patient Name</span><span class="data-value">: ${data.patient_detail?.first_name} ${data.patient_detail?.last_name}</span></div>
          <div class="data-item"><span class="data-label">Gender / Age</span><span class="data-value">: ${data.patient_detail?.gender} / ${data.patient_detail?.age || "—"}</span></div>
          <div class="data-item"><span class="data-label">Admission Date</span><span class="data-value">: ${new Date(data.appointment_date).toLocaleString()}</span></div>
          <div class="data-item"><span class="data-label">Discharge Date</span><span class="data-value">: ${new Date(data.discharge_date).toLocaleString()}</span></div>
          <div class="data-item"><span class="data-label">Admitting Doctor</span><span class="data-value">: ${data.doctor_detail?.full_name}</span></div>
          <div class="data-item"><span class="data-label">Status</span><span class="data-value">: ${data.discharge?.status?.toUpperCase()}</span></div>
        </div>

        ${data.discharge?.status === 'death' ? `
            <div class="report-section-title">Death Notification Details</div>
            <div class="data-grid" style="margin-bottom:20px;">
                <div class="data-item"><span class="data-label">Death Date</span><span class="data-value">: ${formatDate(data.discharge?.death_date)}</span></div>
                <div class="data-item"><span class="data-label">Guardian</span><span class="data-value">: ${data.discharge?.guardian_name}</span></div>
                <div class="data-item" style="grid-column: span 2;"><span class="data-label">Clinical Report</span><span class="data-value">: ${data.discharge?.report}</span></div>
            </div>
        ` : ''}

        ${data.discharge?.status === 'referral' ? `
            <div class="report-section-title">Referral Information</div>
            <div class="data-grid" style="margin-bottom:20px;">
                <div class="data-item"><span class="data-label">Referral Date</span><span class="data-value">: ${formatDate(data.discharge?.referral_date)}</span></div>
                <div class="data-item"><span class="data-label">Hospital</span><span class="data-value">: ${data.discharge?.hospital_name}</span></div>
                <div class="data-item" style="grid-column: span 2;"><span class="data-label">Reason</span><span class="data-value">: ${data.discharge?.reason}</span></div>
            </div>
        ` : ''}

        <div class="report-section-title">Clinical Summary</div>
        <div style="padding:15px; border:1px solid #eee; border-radius:8px; line-height:1.6; font-size:14px; min-height:150px;">
            Patient was admitted for therapeutic management and clinical observation. 
            Upon successful completion of the treatment protocol and achieving clinical stability, the patient is being discharged.
            <br/><br/>
            <b>Follow-up Advice:</b> Please consult the OPD department within 7 days or as specifically advised by the doctor.
        </div>

        <div class="signature-section" style="margin-top:70px;">
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Medical Officer Signature</div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Hospital Administrator</div>
          </div>
        </div>
    `;

    printReport({
      title: `Discharge Summary - IPDN${data.ipd_id}`,
      headerImg: headerData?.discharge_card_header,
      footerText: headerData?.discharge_card_footer,
      content: content
    });
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
              title="Print Discharge Card"
              className="cursor-pointer hover:opacity-80"
              onClick={handlePrint}
            >
              <Printer size={20} />
            </button>
            <button
              title="Revert Discharge"
              className="cursor-pointer hover:opacity-80"
              onClick={handleRevertDischarge}
            >
              <Undo2 size={20} />
            </button>
            <X className="cursor-pointer" onClick={onClose} />
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 text-sm">
          {loading && <p>Loading...</p>}
          {!loading && data && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Patient Name" value={`${data.patient_detail.first_name} ${data.patient_detail.last_name}`} />
              <Field label="IPD No" value={`IPDN${data.ipd_id}`} />
              <Field label="Case ID" value={data.case_id} />
              <Field label="Gender" value={data.patient_detail.gender} />
              <Field label="Phone" value={data.patient_detail.phone} />
              <Field label="Doctor" value={data.doctor_detail?.full_name} />
              <Field label="Created By" value={data.created_by?.role} />
              <Field label="Admission Date" value={new Date(data.appointment_date).toLocaleString()} />
              <Field label="Discharge Date" value={new Date(data.discharge_date).toLocaleString()} />
              <Field label="Discharge Status" value={data.discharge?.status} />
              {/* DEATH DETAILS */}
              {dischargeStatus === "death" && (
                <>
                  <Field label="Death Date" value={formatDate(data.discharge?.death_date)} />
                  <Field label="Guardian Name" value={data.discharge?.guardian_name} />
                  <Field label="Report" value={data.discharge?.report} />
                  <Field label="Attachment" value={
                    data.discharge?.attachment ? (
                      <a href={data.discharge.attachment} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View File</a>
                    ) : "—"
                  } />
                </>
              )}
              {/* REFERRAL DETAILS */}
              {dischargeStatus === "referral" && (
                <>
                  <Field label="Referral Date" value={formatDate(data.discharge?.referral_date)} />
                  <Field label="Referral Hospital" value={data.discharge?.hospital_name} />
                  <Field label="Referral Reason" value={data.discharge?.reason} />
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
