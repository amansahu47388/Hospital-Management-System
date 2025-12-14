import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userRegister } from "../../api/authApi";
import bgImage from "../../assets/hospital-management-system.jpg";

export default function UserSignup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
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
    setLoading(true);
    setError("");

    try {
      await userRegister(form);
      navigate("/login");
    } catch (err) {
      setError(parseServerError(err));
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
                className="
                  mt-2 w-full px-3 py-2 rounded-md
                  border border-gray-300
                  focus:border-[#6046B5]
                  focus:ring-2 focus:ring-[#8A63D2]
                  outline-none
                  transition
                "
                placeholder="Your full name"
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
                className="
                  mt-2 w-full px-3 py-2 rounded-md
                  border border-gray-300
                  focus:border-[#6046B5]
                  focus:ring-2 focus:ring-[#8A63D2]
                  outline-none
                  transition
                "
                placeholder="you@example.com"
                required
              />
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