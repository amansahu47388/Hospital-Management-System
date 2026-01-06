import { X, Printer, Pencil, Trash2 } from "lucide-react";

export default function BirthRecordDetailsModal({ open, onClose, record }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Birth Record Details</h2>

          <div className="flex items-center gap-3">
            <Printer className="cursor-pointer" />
            <Pencil className="cursor-pointer" />
            <Trash2 className="cursor-pointer" />
            <X className="cursor-pointer" onClick={onClose} />
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* CHILD */}
          <DetailBlock title="Child Name" value={record.childName} />

          {/* MOTHER */}
          <DetailBlock
            title="Mother Name"
            value={`${record.motherName} (${record.motherId})`}
          />

          {/* FATHER */}
          <DetailBlock title="Father Name" value={record.fatherName} />

          {/* LEFT COLUMN */}
          <div className="space-y-3">
            <Info label="Case ID" value={record.caseId} />
            <Info label="Weight" value={record.weight} />
            <Info label="Phone" value={record.phone} />
            <Info label="Document" value={record.document || "-"} />
          </div>

          {/* MIDDLE COLUMN */}
          <div className="space-y-3">
            <Info label="Birth Date" value={record.birthDate} />
            <Info label="Gender" value={record.gender} />
            <Info label="Address" value={record.address || "-"} />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-3">
            <Info label="Report" value={record.report || "-"} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function DetailBlock({ title, value }) {
  return (
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-gray-700">{value}</p>
      <div className="w-24 h-24 mt-2 bg-gray-100 flex items-center justify-center rounded">
        <span className="text-xs text-gray-400">NO IMAGE</span>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="font-semibold w-24">{label}:</span>
      <span>{value}</span>
    </div>
  );
}
