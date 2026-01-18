import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { updateTaxCategory } from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function UpdateTaxCategory({ open, onClose, data, refresh }) {
  const notify = useNotify();

  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setName(data.tax_name);
      setPercentage(data.tax_percentage);
    }
  }, [data]);

  if (!open || !data) return null;

  const handleUpdate = async () => {
    if (!name.trim() || percentage === "") {
      notify("warning", "All fields are required");
      return;
    }

    setLoading(true);
    try {
      await updateTaxCategory(data.id, {
        tax_name: name.trim(),
        tax_percentage: percentage,
      });

      notify("success", "Tax category updated successfully");
      onClose();
      refresh?.();
    } catch (err) {
      notify(
        "error",
        err.response?.data?.tax_name?.[0] ||
        err.response?.data?.tax_percentage?.[0] ||
        "Update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-md bg-white rounded-md overflow-hidden shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Edit Tax Category</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Percentage *</label>
            <div className="flex">
              <input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                className="w-full border rounded-l px-3 py-2"
              />
              <span className="border rounded-r px-3 py-2 bg-gray-100">%</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-4 py-3 border-t">
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
