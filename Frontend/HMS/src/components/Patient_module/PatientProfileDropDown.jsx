import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, KeyRound, LogOut } from "lucide-react";
import ChangePasswordModal from "../CommonComponent/ChangePasswordModal";

/** Backend serves media at site root; VITE_API_URL may include trailing /api. */
function resolveMediaUrl(path) {
    if (path == null || path === "") return null;
    const s = String(path).trim();
    if (!s) return null;
    if (s.startsWith("http://") || s.startsWith("https://")) return s;
    let base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    if (base.endsWith("/api")) base = base.slice(0, -4);
    const rel = s.startsWith("/") ? s : `/${s}`;
    return base ? `${base}${rel}` : rel;
}

export default function PatientProfileDropDown({ user, onLogout }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [avatarBroken, setAvatarBroken] = useState(false);
    const dropdownRef = useRef(null);

    const rawAvatar = user?.profile_picture || user?.avatar;
    const avatarSrc = resolveMediaUrl(rawAvatar);

    /* Close dropdown on outside click */
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setAvatarBroken(false);
    }, [rawAvatar]);

    const showPhoto = Boolean(avatarSrc) && !avatarBroken;

    return (
        <div className="relative z-[60]" ref={dropdownRef}>
            <button
                type="button"
                aria-haspopup="true"
                aria-expanded={open}
                title="Profile menu"
                className="
          w-7 h-7 sm:w-8 sm:h-8 md:w-7 md:h-7
          rounded-full cursor-pointer
          flex items-center justify-center
          overflow-hidden
          bg-white/15 ring-1 ring-white/30
          hover:ring-white/60 hover:bg-white/25
          active:scale-95
          transition
          p-0 border-0 outline-none focus-visible:ring-2 focus-visible:ring-white
        "
                onClick={() => setOpen((v) => !v)}
            >
                {showPhoto ? (
                    <img
                        src={avatarSrc}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={() => setAvatarBroken(true)}
                    />
                ) : (
                    <User className="text-white w-[55%] h-[55%]" strokeWidth={2} />
                )}
            </button>

            {/* DROPDOWN */}
            {open && (
                <div
                    className="
            absolute right-0 mt-3
            w-64 max-w-[90vw]
            bg-white rounded-lg shadow-lg 
            z-[70]
          "
                >
                    {/* HEADER */}
                    <div className="flex items-center gap-3 p-4">
                        {showPhoto ? (
                            <img
                                src={avatarSrc}
                                alt=""
                                className="w-9 h-9 rounded-full object-cover"
                                onError={() => setAvatarBroken(true)}
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-full bg-[#6046B5]/15 flex items-center justify-center">
                                <User className="text-[#6046B5] w-5 h-5" strokeWidth={2} />
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                                {user.full_name || user.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate capitalize">
                                {user.role}
                            </p>
                        </div>
                    </div>

                    {/* MENU */}
                    <ul className="py-2 text-sm border-t border-gray-200">
                        <li>
                            <button
                                type="button"
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition text-left text-gray-800"
                                onClick={() => {
                                    setOpen(false);
                                    navigate("/patient-portal/appointments");
                                }}
                            >
                                <User size={18} className="text-gray-600" />
                                <span>My profile</span>
                            </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition text-left text-gray-800"
                                onClick={() => {
                                    setOpen(false);
                                    setShowPasswordModal(true);
                                }}
                            >
                                <KeyRound size={18} />
                                <span>Change Password</span>
                            </button>
                        </li>

                        <li>
                            <button
                                type="button"
                                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer transition text-left"
                                onClick={onLogout}
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            {/* Password Modal */}
            {showPasswordModal && (
                <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
            )}
        </div>
    );
}
