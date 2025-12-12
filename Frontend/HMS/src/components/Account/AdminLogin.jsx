// src/components/LoginModal.jsx
import React, { useState } from "react";
import { userLogin } from "../../api/authApi";

function AdminLogin({ open, closeModal, openUserSignup, openUserLogin }) {
  if (!open) return null;

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await userLogin(form); // same login endpoint
      if (res.data?.access) {
        localStorage.setItem("token", res.data.access);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        closeModal();
        window.location.reload();
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl w-[90%] max-w-md shadow-xl">

        <h2 className="text-xl font-bold mb-4">Admin Sign In</h2>

        {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

        <form onSubmit={submit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded mb-4"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded mb-4"
            required
          />

          <button type="submit" className="w-full py-3 bg-purple-600 text-gray-600 rounded-lg mb-3" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="flex justify-between items-center gap-4">
          <button
            onClick={() => { closeModal(); openUserSignup && openUserSignup(); }}
            className="text-sm text-gray-600 hover:underline"
          >
            Register as User
          </button>

          <button
            onClick={() => { closeModal(); openUserLogin && openUserLogin(); }}
            className="text-sm text-gray-600 hover:underline"
          >
            User Login
          </button>
        </div>

        <button
          onClick={closeModal}
          className="w-full py-2 text-gray-600"
        >
          Close
        </button>

      </div>
    </div>
  );
}
export default AdminLogin;