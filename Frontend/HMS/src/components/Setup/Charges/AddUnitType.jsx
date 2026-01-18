import { X } from "lucide-react";
import { useState } from "react";
import { createChargeUnit } from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function AddUnitType({ open, onClose, refresh }) {
  const notify = useNotify();
  const [unit, setUnit] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!unit.trim()) {
      notify("warning", "Unit type is required");
      return;
    }

    try {
      setLoading(true);

      await createChargeUnit({ unit_type: unit.trim() });

      notify("success", "Unit type added successfully");
      setUnit("");
      onClose();
      refresh?.();   // safe call

    } catch (err) {
      console.error(err);
      notify(
        "error",
        err.response?.data?.unit_type?.[0] ||
        err.response?.data?.detail ||
        "Failed to add unit type"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-md bg-white rounded-md shadow-lg">

        <div className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Add Unit Type</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="p-4">
          <label className="text-sm font-medium">Unit *</label>
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}
