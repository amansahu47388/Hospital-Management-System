// src/components/AdminSignup.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminRegister } from "../../api/authApi";
import { useNotify } from "../../context/NotificationContext";
import bgImage from "../../assets/hospital-management-system.jpg";

export default function AdminSignup() {
  const navigate = useNavigate();
  const notify = useNotify();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    role: "admin",
  });

  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });

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

  /* ===================== VALIDATIONS ===================== */

  const validateFullName = (name) => {
    if (!name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "At least 2 characters required";
    if (!/^[a-zA-Z\s]+$/.test(name.trim()))
      return "Only letters and spaces allowed";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) return "Invalid email address";
    return "";
  };

  const validatePhone = (phone) => {
    if (!phone) return "";
    const re = /^[0-9]{10,15}$/;
    if (!re.test(phone)) return "Phone must be 10–15 digits";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Minimum 8 characters required";
    if (!/(?=.*[a-z])/.test(password))
      return "Must contain a lowercase letter";
    if (!/(?=.*[A-Z])/.test(password))
      return "Must contain an uppercase letter";
    if (!/(?=.*[0-9])/.test(password))
      return "Must contain a number";
    return "";
  };

  /* ===================== HANDLERS ===================== */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const parseServerError = (err) => {
    if (!err?.response?.data) return "Registration failed";
    const data = err.response.data;

    if (typeof data === "string") return data;

    if (typeof data === "object") {
      return Object.entries(data)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`)
        .join(" | ");
    }

    return "Registration failed";
  };

  /* ===================== SUBMIT ===================== */

  const submit = async (e) => {
    e.preventDefault();

    const newErrors = {
      full_name: validateFullName(form.full_name),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
      role: form.role ? "" : "Role is required",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      notify("error", "Please fix the form errors");
      return;
    }

    setLoading(true);

    try {
      const res = await adminRegister(form);

      if (res?.status === 201 || res?.status === 200 || res?.data) {
        notify("success", "Admin account created successfully! Please login.");
        // Use setTimeout to ensure state updates complete before navigation
        setTimeout(() => {
          navigate("/admin/login", { replace: true });
        }, 100);
      } else {
        notify("error", "Registration failed. Please try again.");
      }
    } catch (err) {
      notify("error", parseServerError(err));

      if (err.response?.data && typeof err.response.data === "object") {
        const backendErrors = {};
        Object.entries(err.response.data).forEach(([key, val]) => {
          backendErrors[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors((prev) => ({ ...prev, ...backendErrors }));
      }
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-2xl px-8 py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Admin Signup
          </h2>

          <form onSubmit={submit} className="space-y-4">
            {/* Full Name */}
            <label className="block text-sm text-gray-700">
              Full Name
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Full Name"
              className={`mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none ${
                  errors.full_name ? "border-red-500" : ""
              }`}
            />
            {errors.full_name && (
              <p className="text-xs text-red-600">{errors.full_name}</p>
            )}
            </label>

            {/* Email */}
            <label className="block text-sm text-gray-700">
              Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className={`mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none ${
                  errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
            </label>

            {/* Phone */}
            <label className="block text-sm text-gray-700">
              Phone
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone (optional)"
             className={`mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none ${
                  errors.phone ? "border-red-500" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-xs text-red-600">{errors.phone}</p>
            )}
            </label>

            {/* Role */}
            <label className="block text-sm text-gray-700">
              Role
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </option>
              ))}
            </select>
            </label>

            {/* Password */}
            <label className="block text-sm text-gray-700">
              Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className={`mt-2 w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 outline-none ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password}</p>
            )}
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
