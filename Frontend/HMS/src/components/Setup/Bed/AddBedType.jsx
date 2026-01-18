import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createBedType, updateBedType } from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";



export default function AddBedType({ open, onClose, editData, refresh }) {
  const notify = useNotify(); // ✅ FIXED

  const [bedType, setBedType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setBedType(editData.bad_type);
    } else {
      setBedType("");
    }
  }, [editData, open]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!bedType.trim()) {
      notify("warning","Bed type name is required");
      return;
    }

    try {
      setLoading(true);

      const payload = { bad_type: bedType };

      if (editData?.id) {
        await updateBedType(editData.id, payload);
        notify("success", "Bed type updated successfully");
      } else {
        await createBedType(payload);
        notify( "success", "Bed type added successfully");
      }

      refresh();
      onClose();
    } catch (err) {
      notify( "error","Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-md bg-white rounded-md shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">
            {editData ? "Update Bed Type" : "Add Bed Type"}
          </h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-4">
          <label className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            value={bedType}
            onChange={(e) => setBedType(e.target.value)}
            className="w-full mt-1 border rounded px-3 py-2"
            placeholder="Enter bed type"
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-6 py-2 rounded-md disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
