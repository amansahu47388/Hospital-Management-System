import { X } from "lucide-react";
import { useState } from "react";
import { createChargeType } from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";


export default function AddChargeType({ open, onClose, refresh }) {
  const notify = useNotify();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      notify("warning", "Charge type is required");
      return;
    }

    setLoading(true);
    try {
      await createChargeType({ charge_type: name.trim() });
      notify("success", "Charge type added successfully");
      setName("");
      onClose();
      refresh?.();
    } catch (err) {
      notify(
        "error",
        err.response?.data?.charge_type?.[0] ||
        "Failed to add charge type"
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
          <h3 className="font-semibold">Add Charge Type</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Charge Type *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end p-3 border-t">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="text-white px-6 py-2 rounded-md
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
