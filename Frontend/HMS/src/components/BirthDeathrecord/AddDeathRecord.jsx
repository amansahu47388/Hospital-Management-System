import { useState } from "react";
import { X, UploadCloud } from "lucide-react";
import { createDeathRecord } from "../../api/birthDeathApi";
import { useNotify } from "../../context/NotificationContext";

export default function AddDeathRecord({ open, onClose, onSuccess }) {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

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
    setForm({ ...form, attachment: e.target.files[0] || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.patientName || !form.deathDate) {
      notify("error", "Please fill in all required fields (Patient Name and Death Date)");
      return;
    }

    try {
      setLoading(true);
      
      // Map frontend field names to backend field names
      const data = {
        case_id: form.caseId || "",
        patient_name: form.patientName,
        death_date: form.deathDate,
        guardian_name: form.guardianName || "",
        report: form.report || "",
        attachment: form.attachment,
      };

      await createDeathRecord(data);
      notify("success", "Death record created successfully");
      onSuccess?.();
      onClose();
      
      // Reset form
      setForm({
        caseId: "",
        patientName: "",
        deathDate: "",
        guardianName: "",
        report: "",
        attachment: null,
      });
    } catch (error) {
      const errorMsg = error?.response?.data?.error || error?.message || "Failed to create death record";
      notify("error", errorMsg);
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
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
