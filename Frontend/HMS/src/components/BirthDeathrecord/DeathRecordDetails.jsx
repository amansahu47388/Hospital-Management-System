import { X, Printer, Pencil, Trash2 } from "lucide-react";

export default function DeathRecordDetails({
  open,
  onClose,
  record,
  onEdit,
  onDelete,
}) {
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
            <Printer className="cursor-pointer" />
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
