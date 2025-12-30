import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { dischargeIpdPatient } from "../../api/ipdApi";

function AddDischargePatient({ open, onClose, ipd, onDischarged }) {
  /* ===================== STATE ===================== */

  const initialState = {
    discharge_date: "",
    discharge_status: "",
    discharge_note: "",
    operation: "",
    diagnosis: "",
    investigation: "",
    treatment_at_home: "",
    report: "",
    guardian_name: "",
    death_date: "",
    referral_date: "",
    hospital_name: "",
    reason: "",
    attachmentFile: null,
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState(null);

  const isDeath = formData.discharge_status === "death";
  const isReferral = formData.discharge_status === "referral";

  /* ===================== RESET ===================== */

  useEffect(() => {
    if (!open) {
      setFormData(initialState);
      setErrors({});
      setAttachmentPreview(null);
      setLoading(false);
    }
  }, [open]);

  /* ===================== AUTO CLEAN ===================== */

  useEffect(() => {
    if (formData.discharge_status === "normal") {
      setFormData(prev => ({
        ...prev,
        death_date: "",
        guardian_name: "",
        referral_date: "",
        hospital_name: "",
        reason: "",
        attachmentFile: null,
      }));
      setAttachmentPreview(null);
    }

    if (formData.discharge_status === "death") {
      setFormData(prev => ({
        ...prev,
        referral_date: "",
        hospital_name: "",
        reason: "",
      }));
    }

    if (formData.discharge_status === "referral") {
      setFormData(prev => ({
        ...prev,
        death_date: "",
        guardian_name: "",
        attachmentFile: null,
      }));
      setAttachmentPreview(null);
    }
  }, [formData.discharge_status]);

  /* ===================== HANDLERS ===================== */

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "attachment" && files?.[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;

      setFormData(prev => ({ ...prev, attachmentFile: file }));

      const reader = new FileReader();
      reader.onloadend = () => setAttachmentPreview(reader.result);
      reader.readAsDataURL(file);
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  /* ===================== VALIDATION ===================== */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.discharge_status)
      newErrors.discharge_status = "Discharge status is required";

    if (!formData.discharge_date)
      newErrors.discharge_date = "Discharge date is required";

    if (isDeath) {
      if (!formData.death_date)
        newErrors.death_date = "Death date is required";
      if (!formData.guardian_name)
        newErrors.guardian_name = "Guardian name is required";
    }

    if (isReferral) {
      if (!formData.referral_date)
        newErrors.referral_date = "Referral date is required";
      if (!formData.hospital_name)
        newErrors.hospital_name = "Hospital name is required";
      if (!formData.reason)
        newErrors.reason = "Reason is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ===================== SUBMIT ===================== */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const submitData = new FormData();

      submitData.append("discharge_date", formData.discharge_date);
      submitData.append("discharge_status", formData.discharge_status);
      submitData.append("discharge_note", formData.discharge_note || "");
      submitData.append("operation", formData.operation || "");
      submitData.append("diagnosis", formData.diagnosis || "");
      submitData.append("investigation", formData.investigation || "");
      submitData.append("treatment_at_home", formData.treatment_at_home || "");
      

      if (isDeath) {
        submitData.append("death_date", formData.death_date);
        submitData.append("guardian_name", formData.guardian_name);
        submitData.append("report", formData.report || "");
        if (formData.attachmentFile)
          submitData.append("attachment", formData.attachmentFile);
      }

      if (isReferral) {
        submitData.append("referral_date", formData.referral_date);
        submitData.append("hospital_name", formData.hospital_name);
        submitData.append("reason", formData.reason);
      }

      await dischargeIpdPatient(ipd.ipd_id, submitData);

      alert("Patient discharged successfully");
      onDischarged?.();
      onClose();
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {})[0] ||
        "Discharge failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  /* ===================== UI ===================== */

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[95%] lg:w-[80%] rounded-lg shadow max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="font-semibold">Discharge Patient</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              label="Discharge Date"
              type="date"
              name="discharge_date"
              value={formData.discharge_date}
              onChange={handleChange}
              error={errors.discharge_date}
              required
            />

            <SelectField
              label="Discharge Status"
              name="discharge_status"
              value={formData.discharge_status}
              onChange={handleChange}
              error={errors.discharge_status}
              required
              options={[
                { value: "", label: "Select" },
                { value: "normal", label: "Normal" },
                { value: "death", label: "Death" },
                { value: "referral", label: "Referral" },
              ]}
            />
          </div>

          <FormField label="Note" name="discharge_note" value={formData.discharge_note} onChange={handleChange} />

          <div className="grid md:grid-cols-2 gap-4">
            <FormField label="Operation" name="operation" value={formData.operation} onChange={handleChange} />
            <FormField label="Diagnosis" name="diagnosis" value={formData.diagnosis} onChange={handleChange} />
            <FormField label="Investigation" name="investigation" value={formData.investigation} onChange={handleChange} />
            <FormField label="Treatment at Home" name="treatment_at_home" value={formData.treatment_at_home} onChange={handleChange} />
          </div>

          {/* Death */}
          {isDeath && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField label="Death Date" type="date" name="death_date" value={formData.death_date} onChange={handleChange} error={errors.death_date} required />
                <FormField label="Guardian Name" name="guardian_name" value={formData.guardian_name} onChange={handleChange} error={errors.guardian_name} required />
                <div className="grid md:grid-cols-1">
                <label className="block font-semibold text-gray-700 ">Attachment</label>
                <input type="file" name="attachment" accept="image/*" onChange={handleChange}
                className="w-full border-2 border-gray-600 px-3 py-2 rounded focus:border-purple-500 outline-none transition" />
                {attachmentPreview && <img src={attachmentPreview} alt="preview" className="w-16 h-16 border" />}
                </div>
                <FormField label="Report" name="report" value={formData.report} onChange={handleChange} error={errors.report} />
              </div>

              
            </>
          )}

          {/* Referral */}
          {isReferral && (
            <div className="grid md:grid-cols-3 gap-4">
              <FormField label="Referral Date" type="date" name="referral_date" value={formData.referral_date} onChange={handleChange} error={errors.referral_date} required />
              <FormField label="Hospital Name" name="hospital_name" value={formData.hospital_name} onChange={handleChange} error={errors.hospital_name} required />
              <FormField label="Reason" name="reason" value={formData.reason} onChange={handleChange} error={errors.reason} required />
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="border px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-[#6046B5] text-white px-6 py-2 rounded">
              {loading ? "Discharging..." : "Discharge Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===================== COMPONENTS ===================== */

const FormField = ({ label, error, required, ...props }) => (
  <div>
    <label className="font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input {...props} className="w-full border px-3 py-2 rounded" />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

const SelectField = ({ label, options, error, required, ...props }) => (
  <div>
    <label className="font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select {...props} className="w-full border px-3 py-2 rounded">
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

export default AddDischargePatient;
