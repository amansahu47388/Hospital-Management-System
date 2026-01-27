import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Bed,
  CalendarDays,
  User,
  Loader2,
} from "lucide-react";
import ProfileDropdown from "./AdminProfileDropDown";
import BedStatusModal from "./BedStatus";
import { searchPatient } from "../../api/patientApi";

function Navbar({ role = "admin" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = {
    name: role === "admin" ? "Super Admin" : "Patient",
    role: role === "admin" ? "Super Admin" : "Patient",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  const [openBed, setOpenBed] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const response = await searchPatient(searchQuery);
          setSearchResults(response.data || []);
          setShowResults(true);
        } catch (error) {
          console.error("Error searching patients:", error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/admin/login";
  };

  const handlePatientSelect = (patientId) => {
    navigate(`/admin/patients/${patientId}`);
    setShowResults(false);
    setSearchQuery("");
  };

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
            <div className="hidden md:flex flex-1 justify-center relative" ref={dropdownRef}>
              <div className="relative w-full max-w-md">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {isSearching ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Search size={18} />
                  )}
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  placeholder="Search by patient name, email, or phone..."
                  className="
                    w-full pl-10 pr-4 py-2
                    rounded-full bg-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-blue-300
                  "
                />

                {/* Search Results Dropdown */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[400px] overflow-y-auto">
                      {searchResults.length > 0 ? (
                        <div className="py-2">
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Patients Found ({searchResults.length})
                          </div>
                          {searchResults.map((patient) => (
                            <button
                              key={patient.id}
                              onClick={() => handlePatientSelect(patient.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                            >
                              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-blue-600 shrink-0">
                                <User size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {patient.first_name} {patient.last_name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  ID: {patient.id} • {patient.phone || patient.mobile || "No phone"}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-gray-500 text-sm">No patients found matching "{searchQuery}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
