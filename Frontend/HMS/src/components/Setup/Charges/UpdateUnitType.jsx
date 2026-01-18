import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { updateChargeUnit } from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function UpdateUnitType({ open, unit, onClose, refresh }) {
  const notify = useNotify();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (unit) setValue(unit.unit_type);
  }, [unit]);

  if (!open || !unit) return null;

  const handleUpdate = async () => {
    if (!value.trim()) {
      notify("warning", "Unit type is required");
      return;
    }

    setLoading(true);
    try {
      await updateChargeUnit(unit.id, { unit_type: value });
      notify("success", "Unit type updated successfully");
      onClose();
      refresh();
    } catch (err) {
      notify(
        "error",
        err.response?.data?.unit_type?.[0] || "Update failed"
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
          <h3 className="font-semibold">Edit Unit Type</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="p-4">
          <label className="text-sm font-medium">Unit *</label>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
          />
        </div>

        <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
          <button
            disabled={loading}
            onClick={handleUpdate}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
}
