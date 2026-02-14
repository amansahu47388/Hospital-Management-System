import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";
import { useNotify } from "../../context/NotificationContext";
import bgImage from "../../assets/hospital-management-system.jpg";

export default function ForgotPassword() {
    const notify = useNotify();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            notify("error", "Please enter your email");
            return;
        }

        setLoading(true);
        try {
            const res = await forgotPassword({ email });
            notify("success", res.data.message);
            setSubmitted(true);
        } catch (err) {
            const msg = err.response?.data?.error || "Failed to process request";
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
                        Forgot Password
                    </h2>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <p className="text-sm text-gray-600 text-center">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            <label className="block text-sm text-gray-700">
                                Email
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
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
                                {loading ? "Sending..." : "Send Reset Link"}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center space-y-6">
                            <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm">
                                Check your email for instructions on how to reset your password.
                            </div>
                        </div>
                    )}

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
