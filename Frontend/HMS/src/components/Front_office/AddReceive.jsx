import { X } from "lucide-react";
import { useState } from "react";
import { createReceive } from "../../api/frontofficeApi";
import { useNotify } from "../../context/NotificationContext";

export default function AddReceive({ open, onClose, refresh }) {
  const notify = useNotify();

  const [form, setForm] = useState({
    from_title: "",
    to_title: "",
    reference_no: "",
    date: "",
    address: "",
    note: "",
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.from_title || !form.reference_no || !form.date) {
        notify("warning","Please fill required fields");
        return;
      }

      await createReceive(form);

      notify("success","Postal received successfully");
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      notify("error","Failed to save receive");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-3xl bg-white rounded-md shadow-lg overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Add Receive</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-medium">From Title *</label>
            <input
              name="from_title"
              value={form.from_title}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">To Title</label>
            <input
              name="to_title"
              value={form.to_title}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Reference No *</label>
            <input
              name="reference_no"
              value={form.reference_no}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Date *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Note</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end px-4 py-3 border-t bg-gray-50">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded-md"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
