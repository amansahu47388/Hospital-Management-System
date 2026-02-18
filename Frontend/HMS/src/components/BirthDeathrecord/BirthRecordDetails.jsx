import { useState, useEffect } from "react";
import { X, Printer, Pencil, Trash2 } from "lucide-react";
import {
  getBirthRecordDetail,
  deleteBirthRecord,
} from "../../api/birthDeathApi";
import { getHeaders } from "../../api/setupApi";
import { printReport } from "../../utils/printUtils";
import { useNotify } from "../../context/NotificationContext";

export default function BirthRecordDetails({ open, onClose, record }) {
  const [detailRecord, setDetailRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [headerData, setHeaderData] = useState(null);
  const notify = useNotify();

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const res = await getHeaders();
        if (res.data && res.data.length > 0) {
          setHeaderData(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching record headers:", err);
      }
    };
    fetchHeaders();
  }, []);

  useEffect(() => {
    if (open && record?.id) {
      const fetchDetail = async () => {
        try {
          setLoading(true);
          const response = await getBirthRecordDetail(record.id);
          setDetailRecord(response.data);
        } catch (error) {
          console.error(error);
          notify("Failed to load birth record details", "error");
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    } else {
      setDetailRecord(null);
    }
  }, [open, record]);

  if (!open || !record) return null;

  const displayRecord = detailRecord || record;

  /* ================= BUTTON HANDLERS ================= */

  const handlePrint = () => {
    if (!displayRecord) return;

    const content = `
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #6046B5; padding-bottom: 5px; margin-bottom: 20px;">
          <h2 style="margin:0; color:#6046B5; font-size:20px;">BIRTH RECORD REPORT</h2>
          <div style="text-align:right; font-size:12px; font-weight:bold;">
            <div>Ref No: BR${displayRecord.id}</div>
            <div>Generated: ${new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div style="text-align:center; padding:20px 0;">
          <h1 style="margin:0; font-size:28px; color:#333; text-transform:uppercase;">Certificate of Birth</h1>
        </div>

        <div class="data-grid" style="background:#f9f9f9; padding:20px; border-radius:10px; border:1px solid #eee; margin-bottom:30px;">
          <div class="data-item"><span class="data-label">Child Name</span><span class="data-value">: ${displayRecord.childName || "—"}</span></div>
          <div class="data-item"><span class="data-label">Gender</span><span class="data-value">: ${displayRecord.gender || "—"}</span></div>
          <div class="data-item"><span class="data-label">Date of Birth</span><span class="data-value">: ${displayRecord.birthDate || "—"}</span></div>
          <div class="data-item"><span class="data-label">Weight</span><span class="data-value">: ${displayRecord.weight ? displayRecord.weight + ' kg' : "—"}</span></div>
          <div class="data-item"><span class="data-label">Mother Name</span><span class="data-value">: ${displayRecord.motherName || "—"}</span></div>
          <div class="data-item"><span class="data-label">Father Name</span><span class="data-value">: ${displayRecord.fatherName || "—"}</span></div>
          <div class="data-item"><span class="data-label">Mobile No</span><span class="data-value">: ${displayRecord.phone || "—"}</span></div>
          <div class="data-item"><span class="data-label">Address</span><span class="data-value">: ${displayRecord.address || "—"}</span></div>
        </div>

        <div class="report-section-title">Medical Observation</div>
        <div style="padding:15px; background:#fff; border:1px solid #eee; border-radius:8px; font-size:14px; line-height:1.6; min-height:100px;">
          ${displayRecord.report || "No specific medical observations recorded."}
        </div>

        <div class="signature-section" style="margin-top:80px;">
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Authorised Registrar</div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Medical Superintendent</div>
          </div>
        </div>
    `;

    printReport({
      title: `Birth Record - ${displayRecord.childName}`,
      headerImg: headerData?.birth_record_header,
      footerText: headerData?.birth_record_footer,
      content: content
    });
  };

  const handleEdit = () => {
    onEdit?.(record);
  };

  const handleDelete = async () => {
    onDelete?.(record);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Birth Record Details</h2>

          <div className="flex items-center gap-3">
            <Printer size={16}
              className="cursor-pointer hover:opacity-80"
              onClick={handlePrint}
            />
            <Pencil size={16}
              className="cursor-pointer hover:opacity-80"
              onClick={handleEdit}
            />
            <Trash2 size={16}
              className="cursor-pointer hover:opacity-80"
              onClick={handleDelete}
            />
            <X size={16}
              className="cursor-pointer hover:opacity-80"
              onClick={onClose}
            />
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">Processing...</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <DetailBlock
              title="Child Name"
              value={displayRecord.childName || "-"}
              photo={displayRecord.childPhoto}
            />

            <DetailBlock
              title="Mother Name"
              value={displayRecord.motherName || "-"}
              photo={displayRecord.motherPhoto}
            />

            <DetailBlock
              title="Father Name"
              value={displayRecord.fatherName || "-"}
              photo={displayRecord.fatherPhoto}
            />

            <div className="space-y-3">
              <Info label="Case ID" value={displayRecord.caseId || "-"} />
              <Info
                label="Weight"
                value={displayRecord.weight ? `${displayRecord.weight} kg` : "-"}
              />
              <Info label="Phone" value={displayRecord.phone || "-"} />
              <Info
                label="Document"
                value={displayRecord.documentPhoto ? "Available" : "-"}
              />
            </div>

            <div className="space-y-3">
              <Info label="Birth Date" value={displayRecord.birthDate || "-"} />
              <Info label="Gender" value={displayRecord.gender || "-"} />
              <Info label="Address" value={displayRecord.address || "-"} />
            </div>

            <div className="space-y-3">
              <Info label="Report" value={displayRecord.report || "-"} />
              <Info label="Reference No" value={displayRecord.id || "-"} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function DetailBlock({ title, value, photo }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-gray-700">{value}</p>

      <div className="w-24 h-24 mt-2 bg-gray-100 flex items-center justify-center rounded overflow-hidden">
        {photo ? (
          <img src={photo} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-gray-400">NO IMAGE</span>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="font-semibold w-28">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
