// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

function HomeNavbar({ onLogin, onSignup }) {
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

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onLogin}
            className="px-5 py-2 border rounded-lg"
          >
            Sign In
          </button>

          <button
            onClick={onSignup}
            className="px-5 py-2 border rounded-lg"
          >
            Register
          </button>
        </div>
      </div>
    </header>
  );
}
export default HomeNavbar;