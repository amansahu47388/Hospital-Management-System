import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  createBedGroup,
  updateBedGroup,
  getFloors,
  getBedTypes,
} from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function AddBedGroup({ open, onClose, editData, refresh }) {
  const notify = useNotify();

  const [name, setName] = useState("");
  const [floor, setFloor] = useState("");
  const [bedType, setBedType] = useState("");
  const [description, setDescription] = useState("");

  const [floors, setFloors] = useState([]);
  const [bedTypes, setBedTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------- LOAD DROPDOWNS (ONCE) ---------- */
  useEffect(() => {
    if (!open) return;

    const loadData = async () => {
      try {
        const [floorRes, bedTypeRes] = await Promise.all([
          getFloors(),
          getBedTypes(),
        ]);
        setFloors(floorRes.data);
        setBedTypes(bedTypeRes.data);
      } catch {
        notify( "error", "Failed to load floor or bed type data");
      }
    };

    loadData();
  }, [open]);

  /* ---------- PREFILL EDIT DATA ---------- */
  useEffect(() => {
    if (!open) return;

    if (editData) {
      setName(editData.name || "");
      setFloor(editData.floor ?? "");
      setBedType(editData.bed_type ?? "");
      setDescription(editData.description || "");
    } else {
      setName("");
      setFloor("");
      setBedType("");
      setDescription("");
    }
  }, [editData, open]);

  if (!open) return null;

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    if (!name || !floor || !bedType) {
      notify( "warning", "Name, Floor and Bed Type are required");
      return;
    }

    const payload = {
      name,
      floor: Number(floor),
      bed_type: Number(bedType),
      description,
    };

    try {
      setLoading(true);

      if (editData?.id) {
        await updateBedGroup(editData.id, payload);
        notify( "success", "Bed group updated successfully");
      } else {
        await createBedGroup(payload);
        notify("success", "Bed group created successfully");
      }
      refresh();
      onClose();
    } catch (err) {
      notify({
        type: "error",
        message: "Save failed. Please try again.",
      });
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
            {editData ? "Update Bed Group" : "Add Bed Group"}
          </h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-3">

          <div>
            <label className="text-sm font-medium">Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Floor *</label>
            <select
              value={floor}
              onChange={(e) => setFloor(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">Select</option>
              {floors.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.floor_name}
                </option>
              ))}
            </select>
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
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

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
