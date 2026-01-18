import { useEffect, useState } from "react";
import { getComplaintDetails } from "../../api/frontofficeApi";

export default function ComplainDetails({ open, onClose, complainId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (open && complainId) {
      getComplaintDetails(complainId).then((res) => {
        setData(res.data);
      });
    }
  }, [open, complainId]);

  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-3 flex justify-between">
          <h2 className="font-semibold">Complain Details</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

          <Info label="Complain Type" value={data.complain_type_name} />
          <Info label="Source" value={data.source_name} />
          <Info label="Complain By" value={data.complain_by} />
          <Info label="Phone" value={data.phone} />
          <Info label="Date" value={new Date(data.date).toLocaleDateString()} />
          <Info label="Assigned" value={data.assigned || "-"} />
          <Info label="Action Taken" value={data.action_taken || "-"} />
          <Info label="Description" value={data.description || "-"} />
          <Info label="Note" value={data.note || "-"} />

        </div>
      </div>
    </div>
  );
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-600 text-sm">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);
