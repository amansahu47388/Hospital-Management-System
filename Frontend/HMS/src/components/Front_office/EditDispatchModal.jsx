import { useState, useEffect } from "react";

export default function EditDispatchModal({ data, open, onClose }) {
  if (!open || !data) return null;

  const [form, setForm] = useState(data);

  useEffect(() => {
    setForm(data);
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Updated Dispatch:", form);
    // 🔥 API CALL HERE
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-3 flex justify-between">
          <h2 className="font-semibold">Edit Dispatch</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Input label="To Title *" name="toTitle" value={form.toTitle} onChange={handleChange} />
          <Input label="Reference No" name="refNo" value={form.refNo} onChange={handleChange} />

          <div className="md:col-span-2">
            <label className="text-gray-500">Address</label>
            <textarea
              name="address"
              value={form.address || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-gray-500">Note</label>
            <textarea
              name="note"
              value={form.note || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <Input label="From Title" name="fromTitle" value={form.fromTitle} onChange={handleChange} />
          <Input label="Date" name="date" value={form.date} onChange={handleChange} />
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
