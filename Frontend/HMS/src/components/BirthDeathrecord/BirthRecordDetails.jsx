import { useState, useEffect } from "react";
import { X, Printer, Pencil, Trash2 } from "lucide-react";
import {
  getBirthRecordDetail,
  deleteBirthRecord,
  UpdateBirthRecord,
} from "../../api/birthDeathApi";
import { useNotify } from "../../context/NotificationContext";

export default function BirthRecordDetails({ open, onClose, record }) {
  const [detailRecord, setDetailRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const notify = useNotify();

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
    window.print();
  };

  const handleEdit = async () => {
    try {
      setLoading(true);

      // 👉 example update (you can modify payload later)
      const payload = {
        ...displayRecord,
      };

      await UpdateBirthRecord(displayRecord.id, payload);
      notify("Birth record updated successfully", "success");
    } catch (error) {
      console.error(error);
      notify("Failed to update birth record", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!displayRecord?.id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this birth record?"
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);
      await deleteBirthRecord(displayRecord.id);
      notify("Birth record deleted successfully", "success");
      onClose();
    } catch (error) {
      console.error(error);
      notify("Failed to delete birth record", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Birth Record Details</h2>

          <div className="flex items-center gap-3">
            <Printer
              className="cursor-pointer hover:opacity-80"
              onClick={handlePrint}
            />
            <Pencil
              className="cursor-pointer hover:opacity-80"
              onClick={handleEdit}
            />
            <Trash2
              className="cursor-pointer hover:opacity-80"
              onClick={handleDelete}
            />
            <X
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
                value={displayRecord.document ? "Available" : "-"}
              />
            </div>

            <div className="space-y-3">
              <Info label="Birth Date" value={displayRecord.birthDate || "-"} />
              <Info label="Gender" value={displayRecord.gender || "-"} />
              <Info label="Address" value={displayRecord.address || "-"} />
            </div>

            <div className="space-y-3">
              <Info label="Report" value={displayRecord.report || "-"} />
              <Info label="Reference No" value={displayRecord.refNo || "-"} />
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
