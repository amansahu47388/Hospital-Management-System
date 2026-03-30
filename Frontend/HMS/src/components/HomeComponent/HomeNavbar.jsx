import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userLogout } from "../../api/authApi";
import FullLogo from "../../assets/icons/logo4.png";

function HomeNavbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#features", label: "Services" },
    { href: "#about", label: "About Us" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-white py-3 shadow-lg"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6">
        {/* LOGO */}
        <div className="flex items-center gap-2 animate-fade-in">
          <img
            src={FullLogo}
            alt="Hospital Logo"
            className={`transition-all duration-300 object-contain ${scrolled
                ? "h-10 sm:h-12 md:h-14"
                : "h-10 sm:h-12 md:h-14"
              }`}
          />
        </div>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex gap-8 text-[15px] font-semibold">
          {navLinks.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-gray-700 hover:text-[#6046B5] transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </nav>

        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex items-center gap-4 whitespace-nowrap animate-fade-in">
          {user ? (
            <>
              <div className="text-base font-semibold text-gray-700 truncate max-w-[200px]">
                {user.full_name || user.email}
              </div>
              <button
                onClick={handleLogout}
                className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#6046B5] hover:text-[#6046B5] hover:shadow-md transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#6046B5] hover:text-[#6046B5] hover:shadow-md transition-all duration-300"
              >
                Sign In
              </button>
              <button
                onClick={handleSignup}
                className="px-5 py-2 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="bg-white/95 backdrop-blur-md shadow-lg px-6 py-4 flex flex-col gap-3 text-base font-medium border-t">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="py-2 text-gray-700 hover:text-[#6046B5] hover:pl-2 transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
          {user ? (
            <>
              <div className="py-2 text-gray-700 font-semibold border-t">
                {user.full_name || user.email}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="py-2 text-left text-gray-700 hover:text-[#6046B5] hover:pl-2 transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="py-2 text-gray-700 hover:text-[#6046B5] hover:pl-2 transition-all duration-300"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="py-2 text-white bg-gradient-to-r from-[#6046B5] to-[#8A63D2] rounded-lg text-center hover:shadow-lg transition-all duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </header>
  );
}

export default HomeNavbar;
