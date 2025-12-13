// src/components/AdminSignup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminRegister } from "../../api/authApi";
import bgImage from "../../assets/hospital-management-system.jpg";

export default function AdminSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    role: "admin",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const roles = [
    "admin",
    "doctor",
    "pharmacist",
    "pathologist",
    "radiologist",
    "accountant",
    "receptionist",
    "staff",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminRegister(form);
      navigate("/admin/login");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          Object.values(err.response?.data || {})[0]?.[0] ||
          "Registration failed"
      );
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
            Admin Signup
          </h2>

          {error && (
            <div className="text-sm text-red-600 mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm text-gray-700">
              Full Name
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Admin full name"
                required
              />
            </label>

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
              Phone
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Phone number"
              />
            </label>

            <label className="block text-sm text-gray-700">
              Role
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm text-gray-700">
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Create password"
                minLength={8}
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-gray-600 font-semibold transition disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-sm text-center text-gray-600">
              Already an admin?{" "}
              <Link to="/admin/login" className="text-purple-600 hover:underline">
                Sign in
              </Link>
            </p>
          </form>

          <div className="mt-6 text-center">
            <Link to="/signup" className="text-sm text-gray-500 hover:underline">
              User Signup
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
