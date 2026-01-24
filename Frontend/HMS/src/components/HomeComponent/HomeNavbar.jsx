// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userLogout } from "../../api/authApi";
import FullLogo from "../../assets/icons/logo4.png"
function HomeNavbar({ onLogin, onSignup }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh");
    try {
      await userLogout(refresh ? { refresh } : {});
    } catch (e) {
      // ignore error
    } finally {
      logout();
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white py-5 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6">

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img
            src={FullLogo}
            alt="Logo"
            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain"
          />
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex gap-8 text-[16px] font-semibold">
          <a href="#hero" className="px-4 py-1 bg-gray-200 rounded">Home</a>
          <a href="#features" className="hover:text-blue-600">Services</a>
          <a href="#about" className="hover:text-blue-600">About Us</a>
          <a href="#contact" className="hover:text-blue-600">Contact Us</a>
        </nav>

        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex items-center gap-4 whitespace-nowrap">
          {user ? (
            <>
              <div className="text-lg font-semibold truncate max-w-[200px]">
                {user.full_name || user.email}
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 border rounded-lg whitespace-nowrap"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="px-5 py-2 border rounded-lg whitespace-nowrap hover:bg-gray-100"
              >
                Sign In
              </button>

              <button
                onClick={handleSignup}
                className="px-5 py-2 border rounded-lg whitespace-nowrap hover:bg-gray-100"
              >
                Register
              </button>
            </>
          )}
        </div>


        {/* MOBILE MENU BUTTON */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <div className="md:hidden bg-white shadow-lg px-6 py-4 flex flex-col gap-2 text-lg font-medium">
          <a href="#hero" onClick={() => setOpen(false)}>Home</a>
          <a href="#features" onClick={() => setOpen(false)}>Services</a>
          <a href="#about" onClick={() => setOpen(false)}>About Us</a>
          <a href="#contact" onClick={() => setOpen(false)}>Contact Us</a>
          <Link to="/login" onClick={() => setOpen(false)}>Sign In</Link>
          <Link to="/signup" onClick={() => setOpen(false)}>Register</Link>
        </div>
      )}
    </header>
  );
}

export default HomeNavbar;
