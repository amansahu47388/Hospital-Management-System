import React, { useState } from "react";
import { createPatient } from "../../api/patientApi";
import { X, Loader } from "lucide-react";

function AddPatient({ open, onClose }) {

  // Initialize formData with default empty values
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    date_of_birth: "",
    gender: "Male",
    blood_group: "O+",
    medical_history: "",
    allergies: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    photo: null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files && files[0]) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      setFormData((prev) => ({ ...prev, photo: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone is required";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Phone must be at least 10 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "Date of birth is required";
    } else {
      const dob = new Date(formData.date_of_birth);
      const today = new Date();
      if (dob > today) {
        newErrors.date_of_birth = "Date cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    setLoading(true);
    console.log("📤 Submitting patient form");

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append("first_name", formData.first_name);
      submitData.append("last_name", formData.last_name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("address", formData.address);
      submitData.append("city", formData.city);
      submitData.append("state", formData.state);
      submitData.append("zip_code", formData.zip_code);
      submitData.append("date_of_birth", formData.date_of_birth);
      submitData.append("gender", formData.gender);
      submitData.append("blood_group", formData.blood_group);
      submitData.append("medical_history", formData.medical_history || "");
      submitData.append("allergies", formData.allergies || "");
      submitData.append("emergency_contact_name", formData.emergency_contact_name);
      submitData.append("emergency_contact_phone", formData.emergency_contact_phone);

      if (formData.photo) {
        submitData.append("photo", formData.photo);
      }

      const response = await createPatient(submitData);

      console.log("✅ Patient created successfully:", response.data);

      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        date_of_birth: "",
        gender: "Male",
        blood_group: "O+",
        medical_history: "",
        allergies: "",
        emergency_contact_name: "",
        emergency_contact_phone: "",
        photo: null,
      });
      setPhotoPreview(null);
      setErrors({});

      // Close modal after brief delay
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      console.error("❌ Error creating patient:", err);

      // Handle validation errors from backend
      if (err.response?.data) {
        const backendErrors = err.response.data;
        if (typeof backendErrors === "object") {
          setErrors(backendErrors);
          const firstError = Object.values(backendErrors)[0];
          const message = Array.isArray(firstError) ? firstError[0] : firstError;
          console.error("Failed to add patient:", message);
        } else {
          console.error("Failed to add patient:", backendErrors.detail);
        }
      } else {
        console.error("Failed to add patient");
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset on close
  const handleClose = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      date_of_birth: "",
      gender: "Male",
      blood_group: "O+",
      medical_history: "",
      allergies: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      photo: null,
    });
    setPhotoPreview(null);
    setErrors({});
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[98%] md:w-[90%] lg:w-[80%] rounded-lg shadow-lg overflow-y-auto max-h-[90vh] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 sticky top-0 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Add Patient</h2>
          <button onClick={onClose} className="text-2xl font-bold hover:opacity-80">
            ×
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* PERSONAL INFO */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  error={errors.first_name}
                  required
                />
                <FormField
                  label="Last Name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  error={errors.last_name}

                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                <FormField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                />
                <FormField
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  error={errors.date_of_birth}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <SelectField
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  error={errors.gender}
                  options={[
                    { value: "Male", label: "Male" },
                    { value: "Female", label: "Female" },
                    { value: "Other", label: "Other" },
                  ]}
                />
                <SelectField
                  label="Blood Group"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleChange}
                  error={errors.blood_group}
                  options={[
                    { value: "O+", label: "O+" },
                    { value: "O-", label: "O-" },
                    { value: "A+", label: "A+" },
                    { value: "A-", label: "A-" },
                    { value: "B+", label: "B+" },
                    { value: "B-", label: "B-" },
                    { value: "AB+", label: "AB+" },
                    { value: "AB-", label: "AB-" },
                  ]}
                />
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">
                    📷 Photo
                  </label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full border-2 border-gray-300 px-3 py-2 rounded focus:border-purple-500 outline-none transition"
                  />
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="mt-2 w-16 h-16 object-cover rounded"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* ADDRESS INFO */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Address Information
              </h3>
              <FormField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FormField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                />
                <FormField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                />
                <FormField
                  label="Zip Code"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  error={errors.zip_code}
                />
              </div>
            </div>

            {/* MEDICAL INFO */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Medical Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextAreaField
                  label="Medical History"
                  name="medical_history"
                  value={formData.medical_history}
                  onChange={handleChange}
                  rows="3"
                />
                <TextAreaField
                  label="Allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>

            {/* EMERGENCY CONTACT */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
                Guardian Contact
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Guardian Name"
                  name="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={handleChange}
                  error={errors.emergency_contact_name}
                />
                <FormField
                  label="Guardian Phone"
                  name="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={handleChange}
                  error={errors.emergency_contact_phone}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded font-medium disabled:opacity-60 hover:shadow-lg transition"
            >
              {loading ? "Adding..." : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({ label, name, type = "text", value, onChange, error, required = false }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none ${error ? "border-red-500" : "border-gray-300"
          }`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-2">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, rows = "3" }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full border border-gray-300 px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

export default AddPatient;
