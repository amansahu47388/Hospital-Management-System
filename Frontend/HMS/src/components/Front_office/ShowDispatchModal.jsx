export default function ShowDispatchModal({ data, open, onClose }) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-3 flex justify-between">
          <h2 className="font-semibold">Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Info label="To Title" value={data.toTitle || "-"} />
          <Info label="Reference No" value={data.refNo || "-"} />
          <Info label="Address" value={data.address || "-"} />
          <Info label="Note" value={data.note || "-"} />
          <Info label="From Title" value={data.fromTitle || "-"} />
          <Info label="Date" value={data.date || "-"} />
        </div>
      </div>
    </div>
  );
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-xs">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);
