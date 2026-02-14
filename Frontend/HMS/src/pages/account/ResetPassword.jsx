import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { resetPassword } from "../../api/authApi";
import { useNotify } from "../../context/NotificationContext";
import bgImage from "../../assets/hospital-management-system.jpg";

export default function ResetPassword() {
    const { uid, token } = useParams();
    const navigate = useNavigate();
    const notify = useNotify();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            notify("error", "Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            notify("error", "Password must be at least 8 characters");
            return;
        }

        setLoading(true);
        try {
            await resetPassword({
                uid,
                token,
                password: formData.password
            });
            notify("success", "Password has been reset successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            const msg = err.response?.data?.error || "Invalid or expired reset link";
            notify("error", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-screen overflow-hidden">
            <div
                className="fixed inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bgImage})` }}
                aria-hidden="true"
            />
            <div className="fixed inset-0 backdrop-blur-sm" />

            <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-8 py-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Reset Password
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <label className="block text-sm text-gray-700">
                                New Password
                                <div className="relative mt-2">
                                    <input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Min 8 characters"
                                        required
                                        className="
                      w-full px-3 py-2 rounded-md
                      border border-gray-300
                      focus:border-[#6046B5]
                      focus:ring-2 focus:ring-[#8A63D2]
                      outline-none
                      transition
                      pr-10
                    "
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </label>

                            <label className="block text-sm text-gray-700">
                                Confirm Password
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Repeat new password"
                                    required
                                    className="
                    mt-2 w-full px-3 py-2 rounded-md
                    border border-gray-300
                    focus:border-[#6046B5]
                    focus:ring-2 focus:ring-[#8A63D2]
                    outline-none
                    transition
                  "
                                />
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                w-full py-2 rounded-md text-white font-medium
                bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                hover:opacity-90
                focus:ring-2 focus:ring-[#8A63D2]
                transition
              "
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <Link to="/login" className="text-[#6046B5] hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
