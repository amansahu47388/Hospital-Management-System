import { useState, useEffect } from "react";
import { X, Printer, Pencil, Trash2 } from "lucide-react";
import { getHeaders } from "../../api/setupApi";
import { printReport } from "../../utils/printUtils";

export default function DeathRecordDetails({
  open,
  onClose,
  record,
  onEdit,
  onDelete,
}) {
  const [headerData, setHeaderData] = useState(null);

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const res = await getHeaders();
        if (res.data && res.data.length > 0) {
          setHeaderData(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching death record headers:", err);
      }
    };
    if (open) fetchHeaders();
  }, [open]);

  const handlePrint = () => {
    if (!record) return;

    const content = `
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #6046B5; padding-bottom: 5px; margin-bottom: 20px;">
          <h2 style="margin:0; color:#6046B5; font-size:20px;">DEATH RECORD REPORT</h2>
          <div style="text-align:right; font-size:12px; font-weight:bold;">
            <div>Ref No: DR${record.id || record.refNo}</div>
            <div>Generated: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div style="text-align:center; padding:20px 0;">
          <h1 style="margin:0; font-size:28px; color:#333; text-transform:uppercase;">Certificate of Death</h1>
        </div>

        <div class="data-grid" style="background:#f9f9f9; padding:20px; border-radius:10px; border:1px solid #eee; margin-bottom:30px;">
          <div class="data-item"><span class="data-label">Patient Name</span><span class="data-value">: ${record.patientName || "—"}</span></div>
          <div class="data-item"><span class="data-label">Gender / Age</span><span class="data-value">: ${record.gender || "—"} / ${record.age || "—"}</span></div>
          <div class="data-item"><span class="data-label">Date of Death</span><span class="data-value">: ${record.deathDate || "—"}</span></div>
          <div class="data-item"><span class="data-label">Guardian Name</span><span class="data-value">: ${record.guardianName || "—"}</span></div>
          <div class="data-item"><span class="data-label">Case ID</span><span class="data-value">: ${record.caseId || "—"}</span></div>
          <div class="data-item"><span class="data-label">Address</span><span class="data-value">: ${record.address || "—"}</span></div>
        </div>

        <div class="report-section-title">Death Cause / Report</div>
        <div style="padding:15px; background:#fff; border:1px solid #eee; border-radius:8px; font-size:14px; line-height:1.6; min-height:100px;">
          ${record.deathReport || "Internal clinical review pending / No specific report recorded."}
        </div>

        <div class="signature-section" style="margin-top:80px;">
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Medical Officer</div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Authorised Signatory</div>
          </div>
        </div>
    `;

    printReport({
      title: `Death Record - ${record.patientName}`,
      headerImg: headerData?.death_record_header,
      footerText: headerData?.death_record_footer,
      content: content
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER */}
        <div
          className="flex justify-between items-center px-6 py-4
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white"
        >
          <h2 className="text-lg font-semibold">Death Record Details</h2>

          <div className="flex items-center gap-4">
            <Printer className="cursor-pointer" onClick={handlePrint} />
            <Pencil
              className="cursor-pointer"
              onClick={() => onEdit(record)}
            />
            <Trash2
              className="cursor-pointer"
              onClick={() => onDelete(record)}
            />
            <X className="cursor-pointer" onClick={onClose} />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

          <Info label="Reference No" value={record?.refNo} />
          <Info label="Case ID" value={record?.caseId} />

          <Info label="Patient Name" value={record?.patientName} />
          <Info label="Age" value={record?.age} />

          <Info label="Gender" value={record?.gender} />
          <Info label="Death Date" value={record?.deathDate} />

          <Info label="Address" value={record?.address || "-"} />
          <Info label="Death Report" value={record?.deathReport || "-"} />

          <Info label="Guardian Name" value={record?.guardianName} />
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENT ---------- */

function Info({ label, value }) {
  return (
    <div className="flex gap-3">
      <span className="font-semibold w-40">{label}</span>
      <span>{value}</span>
    </div>
  );
}
