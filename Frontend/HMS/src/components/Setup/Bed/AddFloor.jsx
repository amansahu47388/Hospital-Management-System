import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createFloor, updateFloor } from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function AddFloor({ open, onClose, editData, refresh }) {
  const notify = useNotify();

  const [floorName, setFloorName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFloorName(editData.floor_name);
      setDescription(editData.description || "");
    } else {
      setFloorName("");
      setDescription("");
    }
  }, [editData]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!floorName.trim()) {
      notify("warning", "Floor name is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        floor_name: floorName,
        description,
      };

      if (editData) {
        await updateFloor(editData.id, payload);
        notify( "success", "Floor updated successfully");
      } else {
        await createFloor(payload);
        notify("success","Floor added successfully");
      }

      refresh();
      onClose();
    } catch (error) {
      notify("error","Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-md bg-white rounded-md shadow-lg overflow-hidden">

        {/* HEADER */}
        <div
          className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
        >
          <h3 className="font-semibold">
            {editData ? "Update Floor" : "Add Floor"}
          </h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Name *</label>
            <input
              value={floorName}
              onChange={(e) => setFloorName(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2"
              placeholder="Enter floor name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
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
