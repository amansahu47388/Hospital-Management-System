import { X, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";

export default function UpdateBirthRecord({ open, onClose, record, onSave }) {
  const [form, setForm] = useState({});

  // preload data (same as Show modal but editable)
  useEffect(() => {
    if (record) setForm(record);
  }, [record]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Edit Birth Record</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input label="Child Name *" name="childName" value={form.childName || ""} onChange={handleChange} />
            <Select label="Gender *" name="gender" value={form.gender || ""} onChange={handleChange} />
            <Input label="Weight *" name="weight" value={form.weight || ""} onChange={handleChange} />
            <File label="Child Photo" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Birth Date *" name="birthDate" value={form.birthDate || ""} onChange={handleChange} />
            <Input label="Phone" name="phone" value={form.phone || ""} onChange={handleChange} />
            <Input label="Address" name="address" value={form.address || ""} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Case ID" name="caseId" value={form.caseId || ""} onChange={handleChange} />
            <Input label="Mother Name *" name="mother" value={form.mother || ""} disabled />
            <File label="Mother Photo" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Father Name" name="father" value={form.father || ""} onChange={handleChange} />
            <File label="Father Photo" />
            <File label="Attach Document Photo" />
          </div>

          <textarea
            name="report"
            value={form.report || ""}
            onChange={handleChange}
            placeholder="Report"
            className="border rounded-md p-3 w-full resize-none h-24"
          />

          {/* ACTION */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]  text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- SMALL REUSABLE FIELDS ---------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        {...props}
        className="w-full border rounded-md px-3 py-2 mt-1"
      />
    </div>
  );
}

function Select({ label, ...props }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <select
        {...props}
        className="w-full border rounded-md px-3 py-2 mt-1"
      >
        <option value="">Select</option>
        <option>Male</option>
        <option>Female</option>
      </select>
    </div>
  );
}

function File({ label }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <label className="mt-1 border rounded-md px-3 py-2 flex items-center gap-2 cursor-pointer text-gray-500">
        <UploadCloud size={16} /> Drop a file here or click
        <input type="file" hidden />
      </label>
    </div>
  );
}
