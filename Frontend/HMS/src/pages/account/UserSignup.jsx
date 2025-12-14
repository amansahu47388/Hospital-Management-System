import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userRegister } from "../../api/authApi";
import { useNotify } from "../../context/NotificationContext";
import bgImage from "../../assets/hospital-management-system.jpg";

export default function UserSignup() {
  const navigate = useNavigate();
  const notify = useNotify();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const validateFullName = (name) => {
    if (!name || name.trim() === "") {
      return "Full name is required";
    }
    if (name.trim().length < 2) {
      return "Full name must be at least 2 characters";
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return "Full name should only contain letters and spaces";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === "") {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePhone = (phone) => {
    if (phone && phone.trim() !== "") {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
        return "Please enter a valid phone number (10-15 digits)";
      }
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password || password.trim() === "") {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*[0-9])/.test(password)) {
      return "Password must contain at least one number";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      full_name: validateFullName(form.full_name),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
    };
    setErrors(newErrors);
    return !newErrors.full_name && !newErrors.email && !newErrors.phone && !newErrors.password;
  };

  const parseServerError = (err) => {
    if (!err || !err.response || !err.response.data) return "Registration failed";
    const data = err.response.data;
    // If backend returns a detail string
    if (typeof data === "string") return data;
    // If backend returns {'field': ['error1', ...], ...}
    if (typeof data === "object") {
      const msgs = [];
      Object.keys(data).forEach((key) => {
        const val = data[key];
        if (Array.isArray(val)) msgs.push(`${key}: ${val.join(", ")}`);
        else if (typeof val === "string") msgs.push(`${key}: ${val}`);
      });
      if (msgs.length) return msgs.join(" | ");
    }
    return "Registration failed";
  };

  const submit = async (e) => {
    e.preventDefault();
    
    const fullNameError = validateFullName(form.full_name);
    const emailError = validateEmail(form.email);
    const phoneError = validatePhone(form.phone);
    const passwordError = validatePassword(form.password);
    
    if (fullNameError || emailError || phoneError || passwordError) {
      setErrors({
        full_name: fullNameError,
        email: emailError,
        phone: phoneError,
        password: passwordError,
      });
      notify("error", fullNameError || emailError || phoneError || passwordError);
      return;
    }

    setLoading(true);
    try {
      const res = await userRegister(form);
      
      // Check if registration was successful
      if (res?.status === 201 || res?.status === 200 || res?.data) {
        notify("success", "Account created successfully! Please login.");
        // Use setTimeout to ensure state updates complete before navigation
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 100);
      } else {
        notify("error", "Registration failed. Please try again.");
      }
    } catch (err) {
      const errorMsg = parseServerError(err);
      notify("error", errorMsg);
      // Set general error or field-specific errors
      if (err.response?.data) {
        const serverErrors = err.response.data;
        const newErrors = { ...errors };
        Object.keys(serverErrors).forEach((key) => {
          if (newErrors.hasOwnProperty(key)) {
            newErrors[key] = Array.isArray(serverErrors[key]) 
              ? serverErrors[key][0] 
              : serverErrors[key];
          }
        });
        setErrors(newErrors);
      }
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

      {/* THEME GRADIENT OVERLAY (removed black) */}
      <div className="fixed inset-0  backdrop-blur-sm" />

      {/* Centered card */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-6 py-8 sm:px-8 sm:py-10">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
            User Signup
          </h2>

          <form onSubmit={submit} className="space-y-4">
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
                placeholder="Your full name"
              />
              {errors.full_name && (
                <p className="text-xs text-red-600 mt-1">{errors.full_name}</p>
              )}
            </label>

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
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </label>

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
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
              )}
            </label>

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
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}
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
              {loading ? "Signing up..." : "Register"}
            </button>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#6046B5] hover:underline">
                Sign in
              </Link>
            </p>
          </form>
          {/* Switch to Admin signup */}
          <div className="mt-6 text-center">
            <Link to="/admin/signup" className="text-sm text-gray-500 hover:underline">
              Admin Signup
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}