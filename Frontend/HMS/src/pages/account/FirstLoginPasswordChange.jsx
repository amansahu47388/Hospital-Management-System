import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { firstLoginPasswordChange } from "../../api/staffApi";
import { useNotify } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import bgImage from "../../assets/hospital-management-system.jpg";

export default function FirstLoginPasswordChange() {
    const navigate = useNavigate();
    const notify = useNotify();
    const { logout } = useAuth();

    const [formData, setFormData] = useState({
        temporary_password: "",
        new_password: "",
        confirm_password: ""
    });

    const [showPasswords, setShowPasswords] = useState({
        temporary: false,
        new: false,
        confirm: false
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const passwordRequirements = [
        { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
        { label: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
        { label: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
        { label: "One number", test: (pwd) => /[0-9]/.test(pwd) }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.temporary_password) {
            newErrors.temporary_password = "Temporary password is required";
        }

        if (!formData.new_password) {
            newErrors.new_password = "New password is required";
        } else {
            const failedRequirements = passwordRequirements.filter(
                req => !req.test(formData.new_password)
            );
            if (failedRequirements.length > 0) {
                newErrors.new_password = "Password does not meet requirements";
            }
        }

        if (!formData.confirm_password) {
            newErrors.confirm_password = "Please confirm your password";
        } else if (formData.new_password !== formData.confirm_password) {
            newErrors.confirm_password = "Passwords do not match";
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
            const response = await firstLoginPasswordChange(formData);
            notify("success", response.message || "Password changed successfully");

            // Logout and redirect to login
            setTimeout(() => {
                logout();
                navigate("/admin/login", { replace: true });
            }, 1500);

        } catch (error) {
            console.error("Error changing password:", error);
            const errorMsg = error.response?.data?.error ||
                error.response?.data?.temporary_password?.[0] ||
                error.response?.data?.new_password?.[0] ||
                "Failed to change password";
            notify("error", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-screen overflow-hidden">
            {/* Background */}
            <div
                className="fixed inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
            />

            {/* Overlay */}
            <div className="fixed inset-0 backdrop-blur-sm" />

            <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-6  sm:px-8 sm:py-10">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                            <Lock className="text-purple-600" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Change Your Password
                        </h2>
                        <p className="text-sm text-gray-600">
                            For security reasons, you must change your temporary password before accessing the system.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Temporary Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Temporary Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.temporary ? "text" : "password"}
                                    name="temporary_password"
                                    value={formData.temporary_password}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.temporary_password ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Enter temporary password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("temporary")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPasswords.temporary ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.temporary_password && (
                                <p className="text-red-500 text-sm mt-1">{errors.temporary_password}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.new ? "text" : "password"}
                                    name="new_password"
                                    value={formData.new_password}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.new_password ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Create new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("new")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.new_password && (
                                <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>
                            )}
                        </div>


                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.confirm_password ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility("confirm")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.confirm_password && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 rounded-lg text-white font-medium bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:from-[#8A63D2] hover:to-[#6046B5] focus:ring-2 focus:ring-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                        >
                            {loading ? "Changing Password..." : "Change Password"}
                        </button>
                    </form>

                    {/* Info */}
                    <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <p className="text-xs text-purple-800">
                            <strong>Note:</strong> After changing your password, you will be logged out and need to login again with your new password.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
