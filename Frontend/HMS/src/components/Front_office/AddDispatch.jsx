import { X } from "lucide-react";
import { useState } from "react";
import { createDispatch } from "../../api/frontofficeApi";
import { useNotify } from "../../context/NotificationContext";

export default function AddDispatch({ open, onClose, refresh }) {
  const notify = useNotify();

  const [form, setForm] = useState({
    reference_no: "",
    from_title: "",
    to_title: "",
    address: "",
    note: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.reference_no || !form.to_title || !form.from_title || !form.date) {
        notify("warning","please fill all required fields");
        return;
      }

      await createDispatch(form);
      notify("success","Postal dispatch added successfully");
      refresh && refresh();
      onClose();

      setForm({
        reference_no: "",
        from_title: "",
        to_title: "",
        address: "",
        note: "",
        date: "",
      });

    } catch (err) {
      console.error(err);
      notify("error","Failed to save dispatch");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
      <div className="w-full max-w-3xl bg-white rounded-md shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 py-3 text-white
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h3 className="font-semibold">Add Dispatch</h3>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-medium">To Title *</label>
            <input
              name="to_title"
              value={form.to_title}
              onChange={handleChange}
              className="w-full mt-1 border rounded px-3 py-2"
            />
          </div>

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

        {/* FOOTER */}
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
