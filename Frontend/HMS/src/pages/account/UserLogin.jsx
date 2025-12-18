import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { useNotify } from "../../context/NotificationContext";
import bgImage from "../../assets/hospital-management-system.jpg";

export default function UserLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const notify = useNotify();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
 
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

  const validatePassword = (password) => {
    if (!password || password.trim() === "") {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const submit = async (e) => {
    e.preventDefault();
    
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);
    
    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      notify("error", emailError || passwordError);
      return;
    }

    setLoading(true);
    try {
      const res = await userLogin(form);
      if (res?.data?.access) {
        // Save login data first
        login(res.data);
        
        // Check user role to determine navigation - try multiple sources
        const user = res.data.user;
        let userRole = user?.role;
        
        // Fallback: try to get from localStorage if not in response
        if (!userRole) {
          try {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            userRole = storedUser?.role;
          } catch (e) {
            // Ignore parse errors
          }
        }
        
        // Admin roles that should go to dashboard
        const adminRoles = ["admin", "doctor", "pharmacist", "pathologist", "radiologist", "accountant", "receptionist", "staff"];
        
        // Use setTimeout to ensure state updates complete before navigation
        if (userRole && adminRoles.includes(userRole.toLowerCase())) {
          notify("success", "Admin logged in successfully!");
          setTimeout(() => {
            navigate("/admin/dashboard", { replace: true });
          }, 100);
        } else {
          notify("success", "Logged in successfully!");
          setTimeout(() => {
            navigate("/", { replace: true });
          }, 100);
        }
      } else {
        notify("error", "Login failed. Please try again.");
      }
    } catch (err) {
      const detail = err.response?.data?.detail || 
                    Object.values(err.response?.data || {}).flat().join(" ") || 
                    "Login failed. Please check your credentials and try again.";
      notify("error", detail);
      setErrors({ email: "", password: detail });
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      {/* Background image */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
        aria-hidden="true"
      />

      {/* THEME GRADIENT OVERLAY (removed black) */}
      <div className="fixed inset-0   backdrop-blur-sm" />

      {/* Centered content */}
      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-8 py-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            User Login
          </h2>

          <form onSubmit={submit} className="space-y-4">
            {/* EMAIL */}
            <label className="block text-sm text-gray-700">
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
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
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </label>

            {/* PASSWORD */}
            <label className="block text-sm text-gray-700">
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Your password"
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
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}
            </label>

            <div className="text-sm text-right">
              <Link
                to="/forgot-password"
                className="text-[#6046B5] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* LOGIN BUTTON */}
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
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-[#6046B5] hover:underline">
                Sign up
              </Link>
            </p>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/admin/login"
              className="text-sm text-gray-500 hover:underline"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}