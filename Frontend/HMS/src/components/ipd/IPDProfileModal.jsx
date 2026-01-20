import React, { useState } from "react";
import { X, Save, Eye, EyeOff } from "lucide-react";

export default function IPDProfileModal({ patient, onClose, onSave }) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: patient.name.split(" ")[0],
    lastName: patient.name.split(" ")[1],
    gender: patient.gender,
    age: patient.age,
    phone: patient.phone,
    email: patient.email,
    address: patient.address,
    guardianName: patient.guardianName,
    maritalStatus: patient.maritalStatus,
    bloodGroup: patient.bloodGroup,
    knownAllergies: patient.knownAllergies.join(", "),
    tpa: patient.tpa,
    tpaId: patient.tpaId,
    tpaValidity: patient.tpaValidity,
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

  const handleSave = () => {
    // Call the onSave function with updated data
    onSave(formData);
    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] p-6 md:p-8 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {editMode ? "Edit Patient Profile" : "Patient Profile"}
            </h2>
            <p className="text-purple-100 text-sm mt-1">
              {editMode ? "Make changes and save" : "View patient information"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-purple-700 p-2 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Toggle View/Edit Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setEditMode(!editMode)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-lg hover:shadow-lg transition font-semibold"
            >
              {editMode ? <Eye size={18} /> : <EyeOff size={18} />}
              {editMode ? "View Mode" : "Edit Mode"}
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {/* Personal Information Section */}
            <div className="border-l-4 border-[#6046B5] pl-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.firstName}
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.lastName}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  {editMode ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.gender}
                    </div>
                  )}
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.age}
                    </div>
                  )}
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Blood Group
                  </label>
                  {editMode ? (
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
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
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.bloodGroup}
                    </div>
                  )}
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Marital Status
                  </label>
                  {editMode ? (
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.maritalStatus}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.phone}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.email}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  {editMode ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.address}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Guardian & Health Section */}
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Guardian & Health Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Guardian Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Guardian Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="guardianName"
                      value={formData.guardianName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.guardianName}
                    </div>
                  )}
                </div>

                {/* Known Allergies */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Known Allergies (comma separated)
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="knownAllergies"
                      value={formData.knownAllergies}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.knownAllergies}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Insurance Section */}
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Insurance Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* TPA */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Insurance Provider (TPA)
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="tpa"
                      value={formData.tpa}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.tpa}
                    </div>
                  )}
                </div>

                {/* TPA ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    TPA ID
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="tpaId"
                      value={formData.tpaId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.tpaId}
                    </div>
                  )}
                </div>

                {/* TPA Validity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    TPA Validity
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="tpaValidity"
                      value={formData.tpaValidity}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.tpaValidity}
                    </div>
                  )}
                </div>

                {/* National ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    National ID Number
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="nationalIdNumber"
                      value={formData.nationalIdNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                      {formData.nationalIdNumber}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Remarks Section */}
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Remarks</h3>
              {editMode ? (
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] focus:border-transparent"
                />
              ) : (
                <div className="px-4 py-2 bg-gray-50 rounded-lg text-gray-900">
                  {formData.remarks}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 py-4 border-t border-gray-200 flex justify-end gap-4 rounded-b-2xl bg-gray-50">
          {editMode && (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-lg hover:shadow-lg transition font-semibold"
            >
              <Save size={18} />
              Save Changes
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
