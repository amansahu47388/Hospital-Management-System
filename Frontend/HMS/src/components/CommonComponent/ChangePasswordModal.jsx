import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { changePassword } from "../../api/authApi";
import { useNotify } from "../../context/NotificationContext";

const ChangePasswordModal = ({ onClose }) => {
    const notify = useNotify();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: "",
        password: "",
        confirmPassword: "",
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            notify("error", "Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await changePassword({
                current_password: formData.currentPassword,
                password: formData.password
            });
            notify("success", "Password updated successfully!");
            onClose();
        } catch (error) {
            console.error("Error changing password:", error);
            const msg = error.response?.data?.error || "Failed to update password. Please try again.";
            notify("error", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
            <div className="bg-white w-full max-w-md rounded shadow-lg overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center bg-gradient-to-b from-[#6046B5] to-[#8A63D2] px-4 py-3">
                    <h3 className="text-white font-semibold">Change Password</h3>
                    <button onClick={onClose} className="text-white hover:opacity-80 transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Current Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.current ? "text" : "password"}
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8A63D2] outline-none transition pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("current")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8A63D2] outline-none transition pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("new")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">
                            Confirm New Password <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8A63D2] outline-none transition pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => togglePasswordVisibility("confirm")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded-md font-medium hover:shadow-lg disabled:opacity-50 transition"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default ChangePasswordModal;
