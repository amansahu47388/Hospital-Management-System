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
  const [error, setError] = useState("");

  const roles = [
    "admin",
    "doctor",
    "pharmacist",
    "pathologist",
    "radiologist",
    "accountant",
    "receptionist",
    "nurse",
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
    if (!phone || !phone.trim()) return ""; // Phone is optional
    const re = /^[0-9]{10,15}$/;
    if (!re.test(phone.trim())) return "Phone must be 10–15 digits";
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
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors
    try {
      const res = await adminRegister(form);

      if (res?.status === 201 || res?.status === 200 || res?.data) {
        const role = form.role || "admin";
        const roleName = role.charAt(0).toUpperCase() + role.slice(1);
        notify("success", `${roleName} account created successfully! Redirecting to login...`);
        setTimeout(() => {
          navigate("/admin/login", { replace: true });
        }, 1500);
      }
    } catch (err) {
      const errorMessage = parseServerError(err);
      console.error("Admin signup error:", errorMessage);
      setError(errorMessage);
      notify("error", errorMessage);
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

      {/* THEME GRADIENT OVERLAY (removed black) */}
      <div className="fixed inset-0  backdrop-blur-sm" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-6 py-8 sm:px-8 sm:py-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
            Admin Signup
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {/* Full Name */}
            <label className="block text-sm text-gray-700">
              Full Name
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="
                  mt-2 w-full px-3 py-2 rounded-md
                  border border-gray-300
                  focus:border-[#6046B5]
                  focus:ring-2 focus:ring-[#8A63D2]
                  outline-none
                  transition
                "
                placeholder="Admin full name"
                required
              />
            </label>

            {/* Email */}
            <label className="block text-sm text-gray-700">
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="
                  mt-2 w-full px-3 py-2 rounded-md
                  border border-gray-300
                  focus:border-[#6046B5]
                  focus:ring-2 focus:ring-[#8A63D2]
                  outline-none
                  transition
                "
                placeholder="admin@example.com"
                required
              />
            </label>

            {/* Phone */}
            <label className="block text-sm text-gray-700">
              Phone
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="
                  mt-2 w-full px-3 py-2 rounded-md
                  border border-gray-300
                  focus:border-[#6046B5]
                  focus:ring-2 focus:ring-[#8A63D2]
                  outline-none
                  transition
                "
                placeholder="Phone number"
              />
            </label>

            {/* Role */}
            <label className="block text-sm text-gray-700">
              Role
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="
                  mt-2 w-full px-3 py-2 rounded-md
                  border border-gray-300
                  focus:border-[#6046B5]
                  focus:ring-2 focus:ring-[#8A63D2]
                  outline-none
                  transition
                "
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
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
                className="
                  mt-2 w-full px-3 py-2 rounded-md
                  border border-gray-300
                  focus:border-[#6046B5]
                  focus:ring-2 focus:ring-[#8A63D2]
                  outline-none
                  transition
                "
                placeholder="Create password"
                minLength={8}
                required
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="
                mt-2 w-full py-2 rounded-md text-white font-medium
                bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                hover:opacity-90
                focus:ring-2 focus:ring-[#8A63D2]
                transition
              "
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            <p className="text-sm text-center text-gray-600">
              Already an admin?{" "}
              <Link to="/admin/login" className="text-[#6046B5] hover:underline">
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