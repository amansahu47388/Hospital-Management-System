import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarDays } from "lucide-react";
import PatientProfileDropDown from "./PatientProfileDropDown";
import { useAuth } from "../../context/AuthContext";


import { getPatientDetail } from "../../api/patientApi";

function PatientNavbar() {
    const { user: authUser, logout } = useAuth();
    const navigate = useNavigate();
    const [patientInfo, setPatientInfo] = React.useState(null);

    React.useEffect(() => {
        const fetchPatientProfile = async () => {
            if (authUser?.patient_id) {
                try {
                    const response = await getPatientDetail(authUser.patient_id);
                    setPatientInfo(response.data);
                } catch (error) {
                    console.error("Error fetching patient profile:", error);
                }
            }
        };
        fetchPatientProfile();
    }, [authUser]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const displayUser = {
        full_name:
            patientInfo?.full_name ||
            (patientInfo
                ? `${patientInfo.first_name} ${patientInfo.last_name || ""}`.trim()
                : authUser?.full_name),
        profile_picture: patientInfo?.photo || authUser?.profile_picture,
        role: authUser?.role,
    };

    return (
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

                {/* RIGHT: ICONS + PROFILE */}
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3">

                    {/* CALENDAR */}
                    <IconButton
                        onClick={() => navigate("/patient-portal/calendar")}
                        icon={CalendarDays}
                        title="Calendar"
                    />

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
                            0
                        </span>
                    </div>

                    {/* PROFILE */}
                    <PatientProfileDropDown user={displayUser} onLogout={handleLogout} />
                </div>
            </div>
        </header>
    );
}

export default PatientNavbar;

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
