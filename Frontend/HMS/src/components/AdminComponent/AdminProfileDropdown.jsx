import { useEffect, useRef, useState } from "react";
import { User, KeyRound, LogOut } from "lucide-react";

export default function ProfileDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar */}
      <img
        src={user.avatar || "/avatar.png"}
        alt="Profile"
        className="w-9 h-9 rounded-full cursor-pointer border"
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-lg border z-50">
          {/* Header */}
          <div className="flex items-center gap-3 p-4">
            <img
              src={user.avatar || "/avatar.png"}
              alt="Profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.role}</p>
            </div>
          </div>

          <hr />

          {/* Menu */}
          <ul className="py-2">
            <li
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setOpen(false);
                window.location.href = "/admin/profile";
              }}
            >
              <User size={18} />
              <span>Profile</span>
            </li>

            <li
              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setOpen(false);
                window.location.href = "/admin/change-password";
              }}
            >
              <KeyRound size={18} />
              <span>Password</span>
            </li>

            <li
              className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={onLogout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
