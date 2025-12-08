import { useState } from "react";
import { userRegister } from "../../api/authApi";
import React from "react";
import { Link } from "react-router-dom";

function UserSignup({ open, closeModal, openAdminSignup, openAdminLogin }) {
  if (!open) return null;

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await userRegister(form);
      if (res.data.access) {
        localStorage.setItem("token", res.data.access);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Registered Successfully!");
        closeModal();
        window.location.reload();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        Object.values(err.response?.data || {})[0]?.[0] ||
        "Registration failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl w-[90%] max-w-md shadow-xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">User Register</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone (Optional)"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-lg mb-3 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => { closeModal(); openAdminSignup && openAdminSignup(); }}
            className="text-sm text-gray-600 hover:underline"
          >
            Register as Admin
          </button>

          <button
            onClick={() => { closeModal(); openAdminLogin && openAdminLogin(); }}
            className="text-sm text-gray-600 hover:underline"
          >
            Admin Login
          </button>
        </div>

        <button
          onClick={closeModal}
          className="w-full py-2 text-gray-600 hover:text-gray-800 mt-4"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default UserSignup;