import { useEffect, useState } from "react";
import { updateReceive } from "../../api/frontofficeApi";
import { useNotify } from "../../context/NotificationContext";

export default function UpdateReceive({ open, data, onClose, refresh }) {
  const notify= useNotify();

  if (!open || !data) return null;

  const [form, setForm] = useState({
    id: "",
    from_title: "",
    to_title: "",
    reference_no: "",
    address: "",
    note: "",
    date: "",
  });

  /* Load backend data into form */
  useEffect(() => {
    if (data) {
      setForm({
        id: data.id,
        from_title: data.from_title || "",
        to_title: data.to_title || "",
        reference_no: data.reference_no || "",
        address: data.address || "",
        note: data.note || "",
        date: data.date || "",
      });
    }
  }, [data]);

  /* Handle input */
  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  /* Submit */
  const handleSubmit = async () => {
    try {
      if (!form.from_title || !form.reference_no) {
        notify("warning","From Title and Reference No are required");
        return;
      }

      await updateReceive(form.id, form);
      notify("success","updated successfully");
      refresh();
      onClose();
    } catch (err) {
      notify("error","Update failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-3 flex justify-between">
          <h2 className="font-semibold">Edit Receive</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Input label="From Title *" name="from_title" value={form.from_title} onChange={handleChange} />
          <Input label="To Title" name="to_title" value={form.to_title} onChange={handleChange} />
          <Input label="Reference No" name="reference_no" value={form.reference_no} onChange={handleChange} />
          <Input type="date" label="Date" name="date" value={form.date} onChange={handleChange} />

          <div>
            <label className="text-gray-600">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-gray-600">Note</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-gray-600">{label}</label>
    <input {...props} className="w-full border rounded px-3 py-2" />
  </div>
);
