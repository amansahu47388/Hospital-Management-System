import React, { useState } from "react";
import { X, Save, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNotify } from "../../context/NotificationContext";

export default function OPDProfile({ patient, onClose, onSave }) {
  const notify = useNotify();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: patient.firstName || patient.name?.split(" ")[0] || "",
    lastName: patient.lastName || patient.name?.split(" ")[1] || "",
    gender: patient.gender,
    age: patient.age,
    phone: patient.phone,
    email: patient.email,
    address: patient.address,
    guardianName: patient.guardianName,
    maritalStatus: patient.maritalStatus,
    bloodGroup: patient.bloodGroup,
    knownAllergies: Array.isArray(patient.knownAllergies) ? patient.knownAllergies.join(", ") : patient.knownAllergies || "",
    symptoms: patient.symptoms || "",
    remarks: patient.remarks,
    nationalIdNumber: patient.nationalIdNumber,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    if (!formData.firstName.trim()) {
      notify("error", "First Name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      notify("error", "Last Name is required");
      return false;
    }
    if (!formData.phone.trim()) {
      notify("error", "Phone number is required");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      await onSave(formData);
      setEditMode(false);
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 border border-gray-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {editMode ? "Edit Patient Profile" : "Patient Profile"}
            </h2>
            <p className="text-purple-100 text-sm mt-1">
              {editMode ? "Update information and save changes" : "Detailed patient information record"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[calc(100vh-250px)] overflow-y-auto">
          {/* Toggle View/Edit Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 px-4 py-2 bg-[#6046B5] text-white rounded-lg hover:bg-purple-700 transition-all font-semibold shadow-md active:scale-95"
            >
              {editMode ? <Eye size={18} /> : <EyeOff size={18} />}
              {editMode ? "Switch to View Mode" : "Switch to Edit Mode"}
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-8">
            {/* Personal Information Section */}
            <div className="border-l-4 border-[#6046B5] pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">First Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all bg-gray-50/30"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-700 font-medium">
                      {formData.firstName || "N/A"}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Last Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 focus:border-purple-400 outline-none transition-all bg-gray-50/30"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-700 font-medium">
                      {formData.lastName || "N/A"}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Gender</label>
                  {editMode ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-gray-50/30"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-700 font-medium">
                      {formData.gender}
                    </div>
                  )}
                </div>

                {/* Age */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Age</label>
                  <div className="px-4 py-2.5 bg-gray-100 rounded-xl text-gray-500 font-medium italic">
                    {formData.age} (Read-only)
                  </div>
                </div>

                {/* Blood Group */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Blood Group</label>
                  {editMode ? (
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-gray-50/30"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-700 font-medium">
                      {formData.bloodGroup}
                    </div>
                  )}
                </div>

                {/* Marital Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Marital Status</label>
                  {editMode ? (
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-gray-50/30"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-700 font-medium">
                      {formData.maritalStatus}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50/30"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-700 font-medium">
                      {formData.phone}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50/30"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-700 font-medium">
                      {formData.email}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Residential Address</label>
                  {editMode ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="2"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-gray-50/30 resize-none"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-700 font-medium">
                      {formData.address}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Guardian & Health Section */}
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 font-medium">
                Guardian & Health Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Guardian Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Guardian Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-100 outline-none transition-all bg-gray-50/30"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-700 font-medium">
                      {formData.guardianName}
                    </div>
                  )}
                </div>

                {/* Known Allergies */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Known Allergies</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="knownAllergies"
                      value={formData.knownAllergies}
                      onChange={handleInputChange}
                      placeholder="e.g. Dust, Peanuts, Penicillin"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-100 outline-none transition-all bg-gray-50/30"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-700 font-medium">
                      {formData.knownAllergies || "None reported"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Symptoms & Remarks Section */}
            <div className="border-l-4 border-yellow-500 pl-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Symptoms & Observations</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Current Symptoms</label>
                  {editMode ? (
                    <textarea
                      name="symptoms"
                      value={formData.symptoms}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-100 outline-none transition-all bg-gray-50/30"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-700 leading-relaxed font-medium">
                      {formData.symptoms || "No symptoms recorded."}
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Medical Remarks</label>
                  {editMode ? (
                    <textarea
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-100 outline-none transition-all bg-gray-50/30"
                    />
                  ) : (
                    <div className="px-4 py-2.5 bg-gray-50 rounded-xl text-gray-700 leading-relaxed font-medium">
                      {formData.remarks || "No additional remarks."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl bg-gray-50/50">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Close
          </button>
          {editMode && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-xl hover:shadow-lg hover:shadow-purple-100 transition-all font-bold shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Profile Changes
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
