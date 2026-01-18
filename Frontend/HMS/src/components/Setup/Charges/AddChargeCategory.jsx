import { X } from "lucide-react";
import { useEffect, useState } from "react";
import {createChargeCategory,getChargeTypes,} from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

export default function AddChargeCategory({ open, onClose, refresh }) {
  const notify = useNotify();

  const [chargeTypes, setChargeTypes] = useState([]);
  const [form, setForm] = useState({
    charge_type: "",
    category_name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    getChargeTypes()
      .then((res) => setChargeTypes(res.data))
      .catch(() => notify("error", "Failed to load charge types"));
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.charge_type || !form.category_name) {
      notify("warning", "All required fields must be filled");
      return;
    }

    setLoading(true);
    try {
      await createChargeCategory(form);
      notify("success", "Charge category added successfully");
      onClose();
      refresh?.();
    } catch (err) {
      notify(
        "error",
        err.response?.data?.category_name?.[0] ||
          "Failed to add charge category"
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
          <h3 className="font-semibold">Add Charge Category</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Charge Type *</label>
            <select
              name="charge_type"
              value={form.charge_type}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option value="">Select</option>
              {chargeTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.charge_type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Name *</label>
            <input
              name="category_name"
              value={form.category_name}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-4 py-3 border-t">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="px-6 py-2 text-white rounded-md
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
