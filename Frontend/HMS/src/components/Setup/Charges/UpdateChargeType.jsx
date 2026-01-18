import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { updateChargeType } from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function UpdateChargeType({ open, onClose, data, refresh }) {
  const notify = useNotify();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) setName(data.charge_type);
  }, [data]);

  if (!open || !data) return null;

  const handleUpdate = async () => {
    if (!name.trim()) {
      notify("warning", "Charge type is required");
      return;
    }

    setLoading(true);
    try {
      await updateChargeType(data.id, { charge_type: name.trim() });
      notify("success", "Charge type updated successfully");
      onClose();
      refresh?.();
    } catch (err) {
      notify(
        "error",
        err.response?.data?.charge_type?.[0] ||
        "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-3">
      <div className="w-full max-w-xl bg-white rounded-md overflow-hidden shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
        bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Edit Charge Type</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-4">
          <label className="text-sm font-medium">Charge Type *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end p-3 border-t">
          <button
            disabled={loading}
            onClick={handleUpdate}
            className="text-white px-6 py-2 rounded-md
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
