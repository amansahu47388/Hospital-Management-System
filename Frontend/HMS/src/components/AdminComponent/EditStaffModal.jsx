import React, { useState } from "react";
import { X } from "lucide-react";
import { updateStaff } from "../../api/staffApi";
import { useNotify } from "../../context/NotificationContext";

export default function EditStaffModal({ staff, onClose, onSuccess }) {
    const notify = useNotify();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        full_name: staff.full_name || "",
        phone: staff.phone || "",
        role: staff.role || "nurse",
        is_active: staff.is_active
    });

    const [errors, setErrors] = useState({});

    const roles = [
        { value: "doctor", label: "Doctor" },
        { value: "nurse", label: "Nurse" },
        { value: "pharmacist", label: "Pharmacist" },
        { value: "pathologist", label: "Pathologist" },
        { value: "radiologist", label: "Radiologist" },
        { value: "accountant", label: "Accountant" },
        { value: "receptionist", label: "Receptionist" }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) {
            newErrors.full_name = "Full name is required";
        }

        if (formData.phone && formData.phone.length < 10) {
            newErrors.phone = "Phone must be at least 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);
        try {
            const response = await updateStaff(staff.id, formData);
            notify("success", response.message || "Staff updated successfully");
            onSuccess();
        } catch (error) {
            console.error("Error updating staff:", error);
            const errorMsg = error.response?.data?.error || "Failed to update staff member";
            notify("error", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-gray-200 sticky top-0 bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
                    <h2 className="text-xl font-bold text-white">Edit Staff Member</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Email (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={staff.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.full_name ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="Enter full name"
                        />
                        {errors.full_name && (
                            <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.phone ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="1234567890"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                            {roles.map(role => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            name="is_active"
                            checked={formData.is_active}
                            onChange={handleChange}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="is_active" className="text-sm text-gray-700">
                            Active (User can login)
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Updating..." : "Update Staff Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
