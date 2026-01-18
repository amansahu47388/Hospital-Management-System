import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { detailVisitor } from "../../api/frontofficeApi";
import { useNotify } from "../../context/NotificationContext";

export default function VisitorDetails({ data, onClose, open }) {
  const { error } = useNotify();
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && data?.id) {
      loadDetails();
    }
  }, [open, data]);

  const loadDetails = async () => {
    try {
      setLoading(true);
      const res = await detailVisitor(data.id);
      setVisitor(res.data);
    } catch (err) {
      console.error(err);
      error("Failed to load visitor details");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-3xl bg-white rounded-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-3 flex justify-between">
          <h2 className="font-semibold">Visitor Details</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {loading && <p>Loading...</p>}

          {!loading && visitor && (
            <>
              <Info label="Purpose" value={visitor.purpose_name} />
              <Info label="Name" value={visitor.name} />
              <Info label="Phone" value={visitor.phone} />
              <Info label="Visit To" value={visitor.visit_to} />
              <Info label="Type" value={visitor.opd_ipd_staff} />
              <Info label="Number Of Person" value={visitor.number_of_person} />
              <Info label="Date" value={new Date(visitor.date).toLocaleDateString()} />
              <Info label="ID Card" value={visitor.id_card}/>
              <Info label="In Time" value={visitor.in_time} />
              <Info label="Out Time" value={visitor.out_time || "-"} />
              <Info label="Note" value={visitor.note || "-"} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-600 text-medium">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);
