import { useState, useEffect } from "react";
import { updateDispatch } from "../../api/frontofficeApi";
import { useNotify } from "../../context/NotificationContext";

export default function UpdateDispatch({ data, open, onClose, refresh }) {
  const notify = useNotify();

  const [form, setForm] = useState({
    id: "",
    reference_no: "",
    from_title: "",
    to_title: "",
    address: "",
    note: "",
    date: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id,
        reference_no: data.reference_no,
        from_title: data.from_title,
        to_title: data.to_title,
        address: data.address || "",
        note: data.note || "",
        date: data.date,
      });
    }
  }, [data]);

  if (!open || !data) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!form.reference_no || !form.to_title || !form.from_title) {
        notify("warning","Please fill all required fields");
        return;
      }

      await updateDispatch(form.id, {
        reference_no: form.reference_no,
        from_title: form.from_title,
        to_title: form.to_title,
        address: form.address,
        note: form.note,
        date: form.date,
      });

      notify("success","Dispatch updated successfully");
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      notify("error","Failed to update dispatch");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-3 flex justify-between">
          <h2 className="font-semibold">Update Dispatch</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Form (UI unchanged) */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

          <Input label="To Title *" name="to_title" value={form.to_title} onChange={handleChange} />
          <Input label="From Title *" name="from_title" value={form.from_title} onChange={handleChange} />
          <Input label="Reference No *" name="reference_no" value={form.reference_no} onChange={handleChange} />
          <Input label="Date" type="date" name="date" value={form.date} onChange={handleChange} />

          <div>
            <label className="text-gray-500">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-gray-500">Note</label>
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
    <label className="text-gray-500">{label}</label>
    <input {...props} className="w-full border rounded px-3 py-2" />
  </div>
);
