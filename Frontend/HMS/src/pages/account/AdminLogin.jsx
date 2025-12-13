// src/components/AdminLogin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import bgImage from "../../assets/hospital-management-system.jpg";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    try {
      const res = await userLogin(form); // backend must verify admin role
      if (res?.data?.access) {
        login(res.data);
        navigate("/dashboard"); // admin dashboard
      } else {
        setError("Login failed: no token returned");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
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
        aria-hidden="true"
      />

      {/* Dark + blur overlay */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Centered card */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-2xl px-8 py-10">

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Admin Login
          </h2>

          {error && (
            <div className="text-sm text-red-600 mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm text-gray-700">
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="admin@example.com"
                required
              />
            </label>

            <label className="block text-sm text-gray-700">
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Your password"
                required
              />
            </label>

            <div className="text-sm text-right">
              <Link to="/forgot-password" className="text-purple-600 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-gray-600 bg-purple-600 hover:bg-purple-700  font-semibold transition duration-200 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <Link to="/admin/signup" className="text-purple-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>

          {/* Switch to User Login */}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-gray-500 hover:underline">
              User Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
