import { useState } from "react";
import { X, UploadCloud } from "lucide-react";

export default function AddBirthRecord({ open, onClose }) {
  if (!open) return null;

  const [form, setForm] = useState({
    childName: "",
    gender: "",
    weight: "",
    birthDate: "",
    phone: "",
    address: "",
    caseId: "",
    motherName: "",
    fatherName: "",
    report: "",
    childPhoto: null,
    motherPhoto: null,
    fatherPhoto: null,
    documentPhoto: null,
  });

  /* ---------------- HANDLERS ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = () => {
    console.log("Birth Record Form Data:", form);

    // 🔗 API integration later
    // await createBirthRecord(form);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[95%] max-w-6xl rounded shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Add Birth Record</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <Input
              label="Child Name *"
              name="childName"
              value={form.childName}
              onChange={handleChange}
            />

            <Select
              label="Gender *"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            />

            <Input
              label="Weight *"
              name="weight"
              value={form.weight}
              onChange={handleChange}
            />

            <Upload
              label="Child Photo"
              name="childPhoto"
              onChange={handleFileChange}
            />

            <Input
              label="Birth Date *"
              type="datetime-local"
              name="birthDate"
              value={form.birthDate}
              onChange={handleChange}
            />

            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />

            <Input
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="lg:col-span-2"
            />

            <Input
              label="Case ID"
              name="caseId"
              value={form.caseId}
              onChange={handleChange}
            />

            <Input
              label="Mother Name *"
              name="motherName"
              value={form.motherName}
              onChange={handleChange}
            />

            <Upload
              label="Mother Photo"
              name="motherPhoto"
              onChange={handleFileChange}
            />

            <Input
              label="Father Name"
              name="fatherName"
              value={form.fatherName}
              onChange={handleChange}
            />

            <Upload
              label="Father Photo"
              name="fatherPhoto"
              onChange={handleFileChange}
            />

            <Input
              label="Report"
              name="report"
              value={form.report}
              onChange={handleChange}
            />

            <Upload
              label="Attach Document Photo"
              name="documentPhoto"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-6 py-4 border-t">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded flex items-center gap-2"
          >
            ✓ Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- FIELD COMPONENTS ---------------- */

function Input({ label, name, value, onChange, type = "text", className = "" }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded px-3 py-2 text-sm"
      />
    </div>
  );
}

function Select({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="">Select</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>
  );
}

function Upload({ label, name, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      <label className="border rounded px-3 py-2 flex items-center gap-2 text-gray-500 text-sm cursor-pointer">
        <UploadCloud size={16} />
        Drop a file here or click
        <input
          type="file"
          name={name}
          hidden
          onChange={onChange}
        />
      </label>
    </div>
  );
}
