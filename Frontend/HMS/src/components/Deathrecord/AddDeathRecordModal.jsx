import { useState } from "react";
import { X, UploadCloud } from "lucide-react";

export default function AddDeathRecordModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState({
    caseId: "",
    patientName: "",
    deathDate: "",
    guardianName: "",
    report: "",
    attachment: null,
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, attachment: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Add Death Record</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input label="Case ID *" name="caseId" value={form.caseId} onChange={handleChange} />
            <Input label="Patient Name *" name="patientName" value={form.patientName} onChange={handleChange} />
            <Input label="Death Date *" type="date" name="deathDate" value={form.deathDate} onChange={handleChange} />
            <Input label="Guardian Name *" name="guardianName" value={form.guardianName} onChange={handleChange} />
          </div>

          {/* ATTACHMENT + REPORT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* FILE UPLOAD */}
            <label className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
              <UploadCloud className="w-6 h-6 text-gray-500" />
              <span className="text-sm text-gray-500 mt-2">
                Drop a file here or click
              </span>
              <input type="file" hidden onChange={handleFileChange} />
            </label>

            {/* REPORT */}
            <textarea
              name="report"
              value={form.report}
              onChange={handleChange}
              placeholder="Report"
              className="border rounded-md p-3 w-full resize-none h-24 focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
            />
          </div>

          {/* ACTION */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- REUSABLE INPUT ---------- */
function Input({ label, type = "text", ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm mb-1">
        {label}
      </label>
      <input
        type={type}
        {...props}
        className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
      />
    </div>
  );
}
