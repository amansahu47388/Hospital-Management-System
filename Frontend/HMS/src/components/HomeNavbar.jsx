// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { userLogout } from "../api/authApi";

function HomeNavbar({ onLogin, onSignup }) {
  const raw = localStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : null;

  const handleLogout = async () => {
    try {
      await userLogout();
    } catch (e) {
      // ignore errors on logout
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
  };

  return (
    <header className="w-full py-4 shadow-sm bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">

        {/* Logo */}
        <div className="text-xl font-bold flex items-center gap-2">
          <img src="/logo.png" className="w-8" alt="" />
          <span>MediLab Hospital</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8 text-[16px] font-semibold">
          <Link to="/" className="px-4 py-1 bg-gray-200 rounded">Home</Link>
          <Link to="/appointment">Appointment</Link>
          <Link to="/services">Services</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>

        {/* Buttons / User area */}
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <div className="text-sm font-semibold">{user.full_name || user.email}</div>
              <button onClick={handleLogout} className="px-4 py-2 border rounded-lg">Logout</button>
            </>
          ) : (
            <>
              <button onClick={onLogin} className="px-5 py-2 border rounded-lg">Sign In</button>
              <button onClick={onSignup} className="px-5 py-2 border rounded-lg">Register</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
export default HomeNavbar;