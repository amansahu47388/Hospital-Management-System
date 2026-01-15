import { useState } from "react";

function EditVisitorModal({ data, onClose,open }) {
    if (!open) return null;
  const [form, setForm] = useState({ ...data });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Updated Data:", form);
    // API CALL HERE
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-lg overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-3 flex justify-between">
          <h2 className="font-semibold">Edit Visitor</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Input label="Purpose" name="purpose" value={form.purpose} onChange={handleChange} />
          <Input label="Name" name="name" value={form.name} onChange={handleChange} />
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          <Input label="Number Of Person" name="persons" value={form.persons} onChange={handleChange} />
          <Input label="Date" name="date" value={form.date} onChange={handleChange} />
          <Input label="In Time" name="inTime" value={form.inTime} onChange={handleChange} />
          <Input label="Out Time" name="outTime" value={form.outTime} onChange={handleChange} />

          <div className="md:col-span-2">
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

export default EditVisitorModal;
