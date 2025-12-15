import React, { useState } from "react";
import { createPatient } from "../../api/patientApi";
import { useNotify } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function AddPatient({ open, onClose }) {
  const notify = useNotify();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* ===================== STATE ===================== */
  const [formData, setFormData] = useState({
    name: "",
    guardian_name: "",
    gender: "",
    date_of_birth: "",
    age_year: "",
    age_month: "",
    age_day: "",
    blood_group: "",
    marital_status: "",
    phone: "",
    email: "",
    address: "",
    allergies: "",
    remarks: "",
    tpa: "",
    tpa_id: "",
    tpa_validity: "",
    national_id: "",
    alternate_phone: "",
  });

  const [errors, setErrors] = useState({});

  if (!open) return null;

  /* ===================== HANDLERS ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ===================== VALIDATION ===================== */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.date_of_birth) newErrors.date_of_birth = "DOB is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ===================== SUBMIT ===================== */
  const handleSubmit = async () => {
    if (!validateForm()) {
      notify("error", "Please fix required fields");
      return;
    }

    setLoading(true);
    try {
      await createPatient(formData);
      notify("success", "Patient added successfully");
      onClose();
      navigate("/patients");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {}).flat().join(" ") ||
        "Failed to add patient";
      notify("error", msg);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI (UNCHANGED DESIGN) ===================== */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[98%] md:w-[90%] lg:w-[80%] rounded-lg shadow-lg overflow-y-auto max-h-[90vh] mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Add Patient</h2>
          <button onClick={onClose} className="text-xl text-black font-bold">×</button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">

          {/* ROW 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Name *</label>
              <input name="name" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div>
              <label className="font-medium">Guardian Name</label>
              <input name="guardian_name" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="font-medium">Gender *</label>
              <select name="gender" onChange={handleChange} className="w-full border px-3 py-2 rounded">
                <option value="">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
            </div>

            <div>
              <label className="font-medium">Date Of Birth *</label>
              <input type="date" name="date_of_birth" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>

            <div>
              <label className="font-medium">Age (yy-mm-dd)</label>
              <div className="flex gap-2">
                <input name="age_year" onChange={handleChange} placeholder="Year" className="border px-2 py-2 w-full rounded" />
                <input name="age_month" onChange={handleChange} placeholder="Month" className="border px-2 py-2 w-full rounded" />
                <input name="age_day" onChange={handleChange} placeholder="Day" className="border px-2 py-2 w-full rounded" />
              </div>
            </div>

            <div>
              <label className="font-medium">Blood Group</label>
              <select name="blood_group" onChange={handleChange} className="w-full border px-3 py-2 rounded">
                <option>Select</option>
                <option>O+</option><option>A+</option><option>B+</option><option>AB+</option>
                <option>O-</option><option>A-</option><option>B-</option><option>AB-</option>
              </select>
            </div>
          </div>

          {/* ROW 3 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="font-medium">Marital Status</label>
              <select name="marital_status" onChange={handleChange} className="w-full border px-3 py-2 rounded">
                <option>Select</option>
                <option>Single</option>
                <option>Married</option>
              </select>
            </div>

            <div>
              <label className="font-medium">Patient Photo</label>
              <div className="border rounded py-2 px-3 text-center text-sm text-gray-600 cursor-pointer">
                📁 Drop a file here or click
              </div>
            </div>
          </div>

          {/* ROW 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Phone *</label>
              <input name="phone" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div>
              <label className="font-medium">Email</label>
              <input name="email" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          {/* ROW 5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-medium">Address *</label>
              <input name="address" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            <div>
              <label className="font-medium">Any Known Allergies</label>
              <input name="allergies" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
            </div>
          </div>

          {/* ROW 6 */}
          <div>
            <label className="font-medium">Remarks</label>
            <input name="remarks" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          {/* ROW 7 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="tpa" onChange={handleChange} placeholder="TPA" className="w-full border px-3 py-2 rounded" />
            <input name="tpa_id" onChange={handleChange} placeholder="TPA ID" className="w-full border px-3 py-2 rounded" />
            <input type="date" name="tpa_validity" onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </div>

          {/* ROW 8 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="national_id" onChange={handleChange} placeholder="National Identification Number" className="w-full border px-3 py-2 rounded" />
            <input name="alternate_phone" onChange={handleChange} placeholder="Alternate Number" className="w-full border px-3 py-2 rounded" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-3 border-t">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Patient"}
          </button>
        </div>

      </div>
    </div>
  );
}
