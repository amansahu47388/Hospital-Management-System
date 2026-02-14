import React, { useState } from "react";
import { X } from "lucide-react";
import { createStaff } from "../../api/staffApi";
import { useNotify } from "../../context/NotificationContext";

export default function AddStaffModal({ onClose, onSuccess }) {
    const notify = useNotify();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [tempPassword, setTempPassword] = useState("");

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        role: "nurse",
        department: "",
        send_invitation: true
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
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) {
            newErrors.full_name = "Full name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (formData.phone && formData.phone.length < 10) {
            newErrors.phone = "Phone must be at least 10 digits";
        }

        if (!formData.role) {
            newErrors.role = "Role is required";
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
            const response = await createStaff(formData);

            // Show temporary password if available
            if (response.staff?.temporary_password) {
                setTempPassword(response.staff.temporary_password);
                setShowPassword(true);
            } else {
                notify("success", response.message || "Staff created successfully");
                onSuccess();
            }
        } catch (error) {
            console.error("Error creating staff:", error);
            const errorMsg = error.response?.data?.error ||
                error.response?.data?.email?.[0] ||
                "Failed to create staff member";
            notify("error", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordClose = () => {
        setShowPassword(false);
        notify("success", "Staff created successfully");
        onSuccess();
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(tempPassword);
        notify("success", "Password copied to clipboard");
    };

    if (showPassword) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Staff Created Successfully!</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            An invitation email has been sent to {formData.email}
                        </p>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <p className="text-sm font-medium text-yellow-800 mb-2">Temporary Password:</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-white px-3 py-2 rounded border border-yellow-300 text-sm font-mono">
                                    {tempPassword}
                                </code>
                                <button
                                    onClick={copyToClipboard}
                                    className="px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                                >
                                    Copy
                                </button>
                            </div>
                            <p className="text-xs text-yellow-700 mt-2">
                                ⚠️ Save this password securely. It won't be shown again.
                            </p>
                        </div>

                        <button
                            onClick={handlePasswordClose}
                            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-gray-200 sticky top-0 bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
                    <h2 className="text-xl font-bold text-white">Add New Staff Member</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.email ? "border-red-500" : "border-gray-300"
                                }`}
                            placeholder="staff@example.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
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
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.role ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            {roles.map(role => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        {errors.role && (
                            <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                        )}
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                        </label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="e.g., Cardiology, Emergency"
                        />
                    </div>

                    {/* Send Invitation */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="send_invitation"
                            name="send_invitation"
                            checked={formData.send_invitation}
                            onChange={handleChange}
                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="send_invitation" className="text-sm text-gray-700">
                            Send invitation email with temporary password
                        </label>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                            <strong>Note:</strong> A temporary password will be automatically generated and sent to the staff member's email.
                            They will be required to change it on first login.
                        </p>
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
                            {loading ? "Creating..." : "Create Staff Member"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
