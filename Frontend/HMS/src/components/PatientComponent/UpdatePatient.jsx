import React, { useEffect, useState } from "react";
import { getPatientDetail, updatePatient } from "../../api/patientApi";
import { X, Loader } from "lucide-react";

/* ==================== GENDER NORMALIZER (FIX) ==================== */
const normalizeGender = (value) => {
  if (value === "Male") return "M";
  if (value === "Female") return "F";
  if (value === "Other") return "O";
  return value; // already M / F / O
};

/* ==================== IMAGE URL ==================== */
const getImageUrl = (photo) => {
  if (!photo) return null;
  if (photo.startsWith("http")) return photo;

  const api = import.meta.env.VITE_API_URL;
  return `${api.replace("/api", "")}${photo}`;
};

/* ==================== COMPONENT ==================== */

function UpdatePatient({ open, onClose, patientId }) {

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  /* ==================== FETCH PATIENT ==================== */
  useEffect(() => {
    if (open && patientId) fetchPatient();
  }, [open, patientId]);

  const fetchPatient = async () => {
    setFetching(true);
    try {
      const res = await getPatientDetail(patientId);

      setFormData({
        first_name: res.data.first_name || "",
        last_name: res.data.last_name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        city: res.data.city || "",
        state: res.data.state || "",
        zip_code: res.data.zip_code || "",
        date_of_birth: res.data.date_of_birth || "",
        gender: normalizeGender(res.data.gender), // ✅ FIX
        blood_group: res.data.blood_group || "",
        medical_history: res.data.medical_history || "",
        allergies: res.data.allergies || "",
        emergency_contact_name: res.data.emergency_contact_name || "",
        emergency_contact_phone: res.data.emergency_contact_phone || "",
        photo: res.data.photo || null,
      });
    } catch {
      console.error("Failed to load patient");
      onClose();
    } finally {
      setFetching(false);
    }
  };

  /* ==================== HANDLE CHANGE ==================== */
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setPhotoPreview(URL.createObjectURL(file));
      setFormData((p) => ({ ...p, photo: file }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }

    if (errors[name]) {
      const copy = { ...errors };
      delete copy[name];
      setErrors(copy);
    }
  };

  /* ==================== SUBMIT ==================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "gender") {
        payload.append("gender", normalizeGender(value)); // ✅ FIX
      } else if (value !== null && value !== undefined) {
        payload.append(key, value);
      }
    });

    try {
      await updatePatient(patientId, payload);
      onClose();
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
        const msg = Object.values(err.response.data)[0];
        console.error("Update patient error:", Array.isArray(msg) ? msg[0] : msg);
      } else {
        console.error("Update failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  /* ==================== UI ==================== */
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-white w-[98%] md:w-[90%] lg:w-[80%] rounded-lg max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between px-6 py-4 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-xl font-bold">Update Patient</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* BODY */}
        {fetching ? (
          <div className="p-10 text-center">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">

            {/* PERSONAL */}
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} error={errors.first_name}/>
              <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} error={errors.last_name}/>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Input label="Email" name="email" value={formData.email} onChange={handleChange} error={errors.email}/>
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone}/>
              <Input label="DOB" type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange}/>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Select label="Gender" name="gender" value={formData.gender} onChange={handleChange}
                options={[
                  { value: "M", label: "Male" },
                  { value: "F", label: "Female" },
                  { value: "O", label: "Other" },
                ]}
              />
              <Input label="Blood Group" name="blood_group" value={formData.blood_group} onChange={handleChange}/>
              <div>
                <label className="font-semibold">Photo</label>
                <input type="file" name="photo" onChange={handleChange}/>
                {(photoPreview || formData.photo) && (
                  <img
                    src={photoPreview || getImageUrl(formData.photo)}
                    className="w-20 h-20 mt-2 object-cover rounded"
                  />
                )}
              </div>
            </div>

            {/* ADDRESS */}
            <Input label="Address" name="address" value={formData.address} onChange={handleChange}/>
            <div className="grid md:grid-cols-3 gap-4">
              <Input label="City" name="city" value={formData.city} onChange={handleChange}/>
              <Input label="State" name="state" value={formData.state} onChange={handleChange}/>
              <Input label="Zip Code" name="zip_code" value={formData.zip_code} onChange={handleChange}/>
            </div>

            {/* MEDICAL */}
            <div className="grid md:grid-cols-2 gap-4">
              <Textarea label="Medical History" name="medical_history" value={formData.medical_history} onChange={handleChange}/>
              <Textarea label="Allergies" name="allergies" value={formData.allergies} onChange={handleChange}/>
            </div>

            {/* EMERGENCY */}
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Guardian Name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange}/>
              <Input label="Guardian Phone" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange}/>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-4 border-t pt-4">
              <button type="button" onClick={onClose} className="px-6 py-2 border rounded">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="px-6 py-2 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded">
                {loading ? <Loader className="animate-spin" /> : "Update Patient"}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}

/* ==================== FIELDS ==================== */

const Input = ({ label, error, ...props }) => (
  <div>
    <label className="font-semibold">{label}</label>
    <input {...props} className="w-full border px-3 py-2 rounded"/>
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="font-semibold">{label}</label>
    <select {...props} className="w-full border px-3 py-2 rounded">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="font-semibold">{label}</label>
    <textarea {...props} rows={3} className="w-full border px-3 py-2 rounded"/>
  </div>
);

export default UpdatePatient;
