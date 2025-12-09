// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

function HomeNavbar({ onLogin, onSignup }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full py-5 shadow-sm bg-white  fixed top-0 left-0 w-full
 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">

        {/* LOGO */}
        <div className="text-xl font-bold flex items-center gap-2">
          <img src="/logo.png" className="w-8" alt="Logo" />
          <span>MediLab Hospital</span>
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex gap-8 text-[16px] font-semibold">
          <Link to="/" className="px-4 py-1 bg-gray-200 rounded">Home</Link>
          <Link to="/appointment" className="hover:text-blue-600">Appointment</Link>
          <Link to="/services" className="hover:text-blue-600">Services</Link>
          <Link to="/about" className="hover:text-blue-600">About Us</Link>
          <Link to="/contact" className="hover:text-blue-600">Contact Us</Link>
        </nav>

        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex gap-4">
          <button
            onClick={onLogin}
            className="px-5 py-2 border rounded-lg hover:bg-gray-100"
          >
            Sign In
          </button>

          <button
            onClick={onSignup}
            className="px-5 py-2 border rounded-lg hover:bg-gray-100"
          >
            Register
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 flex flex-col gap-2 text-lg font-medium animate-slideDown">

          <Link to="/" className="py-1" onClick={() => setOpen(false)}>Home</Link>
         
          <Link to="/services" className="py-1" onClick={() => setOpen(false)}>Services</Link>
          <Link to="/about" className="py-1" onClick={() => setOpen(false)}>About Us</Link>
          <Link to="/contact" className="py-1" onClick={() => setOpen(false)}>Contact Us</Link>
          {/* MOBILE VIEW — SIGN IN & SIGN UP AS LINKS */}
          <Link
            to="/signin"
            className="py-1"
            onClick={onLogin}
          >
            Sign In
          </Link>

          <Link
            to="/signup"
            className="py-1"
            onClick={onSignup}
          >
            Register
          </Link>

        </div>
      )}
    </header>
  );
}

export default HomeNavbar;
