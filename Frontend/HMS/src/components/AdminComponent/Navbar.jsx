import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Bed,
  CalendarDays,
} from "lucide-react";
import ProfileDropdown from "./AdminProfileDropDown";
import BedStatusModal from "./BedStatus";

function Navbar({ role = "admin" }) {
  const user = {
    name: role === "admin" ? "Super Admin" : "Patient",
    role: role === "admin" ? "Super Admin" : "Patient",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  const [openBed, setOpenBed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/admin/login";
  };
  const navigate = useNavigate();
  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header
        className="
          sticky top-0 z-40
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
          px-4 md:px-6 py-3
          shadow-md
        "
      >
        <div className="flex items-center justify-between gap-4 pl-12 md:pl-6">

          {/* LEFT: BRAND */}
          <div className="flex items-center min-w-0">
            <span
              className="
                text-white text-lg md:text-xl font-semibold tracking-wide
                whitespace-nowrap truncate
                max-w-[200px] sm:max-w-[260px] md:max-w-none
              "
              title="Smart Hospital & Research Center"
            >
              Smart Hospital & Research Center
            </span>
          </div>

          {/* CENTER: SEARCH */}
          {role === "admin" && (
            <div className="hidden md:flex flex-1 justify-center">
              <div className="relative w-full max-w-md">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by patient name..."
                  className="
                    w-full pl-10 pr-4 py-2
                    rounded-full bg-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-300
                  "
                />
              </div>
            </div>
          )}

          {/* RIGHT: ICONS + PROFILE */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">

            {role === "admin" && (
              <>
                {/* BED */}
                <IconButton
                  icon={Bed}
                  title="Bed Status"
                  onClick={() => setOpenBed(true)}
                />

                {/* CALENDAR */}
                <IconButton
                  onClick={() => navigate("/admin/Calendar")}
                  icon={CalendarDays}
                  title="Calendar"
                />
              </>
            )}

            {/* NOTIFICATION */}
            <div className="relative">
              <IconButton icon={Bell} title="Notifications" />
              <span
                className="
                  absolute -top-1 -right-1
                  bg-red-500 text-white text-[10px]
                  w-4 h-4 rounded-full
                  flex items-center justify-center
                "
              >
                3
              </span>
            </div>

            {/* PROFILE */}
            <ProfileDropdown user={user} onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* ================= BED MODAL ================= */}
      <BedStatusModal
        open={openBed}
        onClose={() => setOpenBed(false)}
      />
    </>
  );
}

export default Navbar;

/* ---------- ICON BUTTON ---------- */
function IconButton({ icon: Icon, title, onClick }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="
        p-1.5 sm:p-2
        rounded-full
        text-white
        hover:bg-white/20
        active:scale-95
        transition
      "
    >
      <Icon size={18} className="sm:w-5 sm:h-5" />
    </button>
  );
}
