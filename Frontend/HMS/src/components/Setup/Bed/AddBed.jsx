import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createBed,
  updateBed,
  getBedTypes,
  getBedGroups,
} from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function AddBed({ open, onClose, editData, refresh }) {
  const notify = useNotify();

  const [bedName, setBedName] = useState("");
  const [bedType, setBedType] = useState("");
  const [bedGroup, setBedGroup] = useState("");
  const [bedTypes, setBedTypes] = useState([]);
  const [bedGroups, setBedGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD DROPDOWNS ---------- */
  useEffect(() => {
    if (!open) return;

    const loadData = async () => {
      try {
        const [btRes, bgRes] = await Promise.all([
          getBedTypes(),
          getBedGroups(),
        ]);
        setBedTypes(btRes.data);
        setBedGroups(bgRes.data);
      } catch {
        notify("error", "Failed to load bed data");
      }
    };

    loadData();
  }, [open]);

  /* ---------- PREFILL EDIT ---------- */
  useEffect(() => {
    if (!open) return;

    if (editData) {
      setBedName(editData.bed_name);
      setBedType(editData.bed_type);
      setBedGroup(editData.bed_group);
    } else {
      setBedName("");
      setBedType("");
      setBedGroup("");
    }
  }, [editData, open]);

  if (!open) return null;

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!bedName || !bedType || !bedGroup) {
      notify( "warning", "All fields are required");
      return;
    }

    const payload = {
      bed_name: bedName,
      bed_type: Number(bedType),
      bed_group: Number(bedGroup),
    };

    try {
      setLoading(true);

      if (editData?.id) {
        await updateBed(editData.id, payload);
        notify("success", "Bed updated successfully");
      } else {
        await createBed(payload);
        notify("success", "Bed added successfully");
      }

      refresh();
      onClose();
    } catch {
      notify( "error", "Save failed");
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
            {editData ? "Update Bed" : "Add Bed"}
          </h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4">

          <div>
            <label className="text-sm font-medium">Name *</label>
            <input
              value={bedName}
              onChange={(e) => setBedName(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bed Type *</label>
            <select
              value={bedType}
              onChange={(e) => setBedType(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">Select</option>
              {bedTypes.map((bt) => (
                <option key={bt.id} value={bt.id}>
                  {bt.bad_type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Bed Group *</label>
            <select
              value={bedGroup}
              onChange={(e) => setBedGroup(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">Select</option>
              {bedGroups.map((bg) => (
                <option key={bg.id} value={bg.id}>
                  {bg.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-4 py-3 bg-gray-50">
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
