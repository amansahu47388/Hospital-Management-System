import { X, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { getDeathRecordDetail, updateDeathRecord } from "../../api/birthDeathApi";
import { useNotify } from "../../context/NotificationContext";

export default function UpdateDeathRecord({
  open,
  onClose,
  record,
  onSave,
}) {
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

  // Fetch full record details when modal opens
  useEffect(() => {
    if (open && record?.id) {
      const fetchDetail = async () => {
        try {
          const response = await getDeathRecordDetail(record.id);
          const data = response.data;

          // Convert backend snake_case to frontend camelCase
          // Format death_date from backend to date format (YYYY-MM-DD)
          let deathDateFormatted = "";
          if (data.deathDate) {
            const date = new Date(data.deathDate);
            deathDateFormatted = date.toISOString().split('T')[0];
          }

          setForm({
            caseId: data.caseId || "",
            patientName: data.patientName || "",
            deathDate: deathDateFormatted,
            guardianName: data.guardianName || "",
            report: data.report || "",
            attachment: null, // Don't pre-fill file
          });
        } catch (error) {
          console.error("Failed to load death record detail:", error);
          notify("error", "Failed to load death record details");
        }
      };
      fetchDetail();
    }
  }, [open, record, notify]);

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

      await updateDeathRecord(record.id, data);
      notify("success", "Death record updated successfully");
      onSave?.();
      onClose();
    } catch (error) {
      const errorMsg = error?.response?.data?.error || error?.message || "Failed to update death record";
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
          <h2 className="text-lg font-semibold">Edit Death Record</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* GRID 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input label="Case ID" name="caseId" value={form.caseId} onChange={handleChange} />
            <Input label="Patient Name *" name="patientName" value={form.patientName} onChange={handleChange} />
            <Input label="Death Date *" type="date" name="deathDate" value={form.deathDate} onChange={handleChange} />
            <Input label="Guardian Name" name="guardianName" value={form.guardianName} onChange={handleChange} />
          </div>

          {/* GRID 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <File label="Attachment" onChange={handleFileChange} />
            <Textarea label="Report" name="report" value={form.report} onChange={handleChange} />
          </div>

          {/* ACTION */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

/* ---------- SMALL INPUT COMPONENTS ---------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm">
        {label}
      </label>
      <input
        {...props}
        className="w-full border rounded-md px-3 py-2 mt-1"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <textarea
        {...props}
        className="w-full border rounded-md px-3 py-2 mt-1 h-24 resize-none"
      />
    </div>
  );
}

function File({ label, onChange }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <label className="mt-1 border rounded-md px-3 py-2 flex items-center gap-2 cursor-pointer text-gray-500">
        <UploadCloud size={16} /> Drop a file here or click
        <input type="file" hidden onChange={onChange} />
      </label>
    </div>
  );
}
