import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function EditBedModal({ open, onClose, bed }) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    group: "",
    used: false,
  });

  /* Prefill data */
  useEffect(() => {
    if (bed) {
      setForm({
        name: bed.name,
        type: bed.type,
        group: bed.group,
        used: bed.used,
      });
    }
  }, [bed]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-lg bg-white rounded-md shadow-lg overflow-hidden max-h-[90vh] flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Edit Bed</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4 overflow-y-auto">

          <div>
            <label className="text-sm font-medium">Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bed Type *</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option>Standard</option>
              <option>VIP</option>
              <option>Normal</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Bed Group *</label>
            <select
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
              className="w-full mt-1 border rounded px-3 py-2"
            >
              <option>VIP Ward - Ground Floor</option>
              <option>Private Ward - 3rd Floor</option>
              <option>ICU - 2nd Floor</option>
              <option>General Ward Male - 3rd Floor</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!form.used}
              onChange={(e) =>
                setForm({ ...form, used: !e.target.checked })
              }
            />
            Not available for use
          </label>

        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
          <button
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white px-6 py-2 rounded-md"
            onClick={() => {
              console.log("Updated Bed:", form);
              onClose();
            }}
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
