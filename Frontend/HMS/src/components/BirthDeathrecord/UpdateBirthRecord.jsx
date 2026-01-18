import { X, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { getBirthRecordDetail, updateBirthRecord } from "../../api/birthDeathApi";
import { useNotify } from "../../context/NotificationContext";

export default function UpdateBirthRecord({ open, onClose, record, onSave }) {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
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

  // Fetch full record details when modal opens
  useEffect(() => {
    if (open && record?.id) {
      const fetchDetail = async () => {
        try {
          const response = await getBirthRecordDetail(record.id);
          const data = response.data;
          
          // Convert backend snake_case to frontend camelCase
          // Format birth_date from backend to datetime-local format
          let birthDateFormatted = "";
          if (data.birth_date) {
            const date = new Date(data.birth_date);
            birthDateFormatted = date.toISOString().slice(0, 16);
          }

          setForm({
            childName: data.child_name || "",
            gender: data.gender || "",
            weight: data.weight || "",
            birthDate: birthDateFormatted,
            phone: data.phone || "",
            address: data.address || "",
            caseId: data.case_id || "",
            motherName: data.mother_name || "",
            fatherName: data.father_name || "",
            report: data.report || "",
            childPhoto: null, // Don't pre-fill files
            motherPhoto: null,
            fatherPhoto: null,
            documentPhoto: null,
          });
        } catch (error) {
          console.error("Failed to load birth record detail:", error);
          notify("error", "Failed to load birth record details");
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
    const { name, files } = e.target;
    setForm({ ...form, [name]: files[0] || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.childName || !form.gender || !form.birthDate || !form.motherName) {
      notify("error", "Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      
      // Map frontend field names to backend field names
      const data = {
        child_name: form.childName,
        gender: form.gender,
        weight: form.weight || "",
        birth_date: form.birthDate,
        phone: form.phone || "",
        address: form.address || "",
        case_id: form.caseId || "",
        mother_name: form.motherName,
        father_name: form.fatherName || "",
        report: form.report || "",
        child_photo: form.childPhoto,
        mother_photo: form.motherPhoto,
        father_photo: form.fatherPhoto,
        document_photo: form.documentPhoto,
      };

      await updateBirthRecord(record.id, data);
      notify("success", "Birth record updated successfully");
      onSave?.();
      onClose();
    } catch (error) {
      const errorMsg = error?.response?.data?.error || error?.message || "Failed to update birth record";
      notify("error", errorMsg);
    } finally {
      setLoading(false);
    }
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
            <Input label="Child Name *" name="childName" value={form.childName} onChange={handleChange} />
            <Select label="Gender *" name="gender" value={form.gender} onChange={handleChange} />
            <Input label="Weight" name="weight" value={form.weight} onChange={handleChange} />
            <File label="Child Photo" name="childPhoto" onChange={handleFileChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Birth Date *" type="datetime-local" name="birthDate" value={form.birthDate} onChange={handleChange} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="Address" name="address" value={form.address} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Case ID" name="caseId" value={form.caseId} onChange={handleChange} />
            <Input label="Mother Name *" name="motherName" value={form.motherName} onChange={handleChange} />
            <File label="Mother Photo" name="motherPhoto" onChange={handleFileChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Father Name" name="fatherName" value={form.fatherName} onChange={handleChange} />
            <File label="Father Photo" name="fatherPhoto" onChange={handleFileChange} />
            <File label="Attach Document Photo" name="documentPhoto" onChange={handleFileChange} />
          </div>

          <textarea
            name="report"
            value={form.report}
            onChange={handleChange}
            placeholder="Report"
            className="border rounded-md p-3 w-full resize-none h-24"
          />

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
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>
  );
}

function File({ label, name, onChange }) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <label className="mt-1 border rounded-md px-3 py-2 flex items-center gap-2 cursor-pointer text-gray-500">
        <UploadCloud size={16} /> Drop a file here or click
        <input type="file" name={name} hidden onChange={onChange} />
      </label>
    </div>
  );
}
