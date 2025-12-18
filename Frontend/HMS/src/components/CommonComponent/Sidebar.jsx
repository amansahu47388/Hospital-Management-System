import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Pill,
  UserRound,
  Calendar,
  Users,
  UserCheck,
  Hospital,
  Stethoscope,
  FlaskConical,
  Droplet,
  Bed,
  Ambulance,
  Building2,
  QrCode,
  ClipboardList,
  CalendarDays,
  MessageCircle,
  FileDown,
  FileBadge,
  Monitor,
  BarChart3,
  Settings,
  FolderGit2
} from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/admin/patients", label: "Patient", Icon: UserRound },
  { to: "/admin/appointments", label: "Appointment", Icon: Calendar },

  { to: "/admin/opd-out patients", label: "OPD-Out patient", Icon: Hospital },
  { to: "/admin/ipd-in patients", label: "IPD-In Patient", Icon: Bed },
  { to: "/pharmacy", label: "Pharmacy", Icon: Pill },
  { to: "/pathology", label: "Pathology", Icon: FlaskConical },
  { to: "/Radiology", label: "Radiology", Icon: FolderGit2 },
  { to: "/lab", label: "Lab", Icon: FlaskConical },
  { to: "/ward", label: "Ward", Icon: Bed },
  { to: "/blood-bank", label: "Blood Bank", Icon: Droplet },
  { to: "/treatment", label: "Treatment", Icon: Stethoscope },
 
  { to: "/Ambulance", label: "Ambulance", Icon: Ambulance },
  { to: "/front-office", label: "Front Office", Icon: ClipboardList },
  { to: "/Birth-Death-Record", label: "Birth & Death Record", Icon: FileBadge },
  { to: "/multi-branch", label: "Multi Branch", Icon: Building2 },
  { to: "/Human-Resources", label: "Human Resources", Icon: Users },
  { to: "/QR-Code-Attendance", label: "QR Code Attendance", Icon: QrCode },
  { to: "/Duty-Roster", label: "Duty Roster", Icon: ClipboardList },
  { to: "/Annual-Calendar", label: "Annual Calendar", Icon: CalendarDays },
  { to: "/Referral", label: "Referral", Icon: UserCheck },
  { to: "/TPA-Management", label: "TPA Management", Icon: Building2 },
  { to: "/Finance", label: "Finance", Icon: BarChart3 },
  { to: "/Messaging", label: "Messaging", Icon: MessageCircle },
  { to: "/Download-Calendar", label: "Download Calendar", Icon: FileDown },
  { to: "/Certificate", label: "Certificate", Icon: FileBadge },
  { to: "/Front-CMS", label: "Front CMS", Icon: Monitor },
  { to: "/Live-Consultation", label: "Live Consultation", Icon: Stethoscope },
  { to: "/Reports", label: "Reports", Icon: BarChart3 },
  { to: "/Setup", label: "Setup", Icon: Settings },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => {
    if (window.innerWidth < 700) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <div className="relative">
      {/* FLOATING TOGGLE BUTTON (Right side like your image) */}
      <button
        onClick={handleToggle}
        className="absolute top-2 -right-20 z-50 p-1 cursor-pointer bg-transparent border-0 outline-0 focus:outline-0 focus:ring-0"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
     
      {/* SIDEBAR */}
      <aside
        className={`fixed md:relative top-0 left-0 z-40 ${
          collapsed ? "w-20" : "w-64"
        } h-screen overflow-y-auto
        text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
        transition-transform duration-500 md:transition-all md:duration-200
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-5 justify-even">
          {/* Logo */}
          <div className="text-xl font-bold mb-10 flex items-center gap-3">
            {/* <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              ML
            </div>
            {!collapsed && <span>MediLab Hospital</span>} */}
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-3 text-md font-bold pb-10">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `w-full flex items-center gap-4 py-2 px-2 transition no-underline
                  ${
                    isActive
                      ? "!text-white bg-white/10 rounded-md"
                      : "!text-white hover:!text-gray-200"
                  }`
                }
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className={`${collapsed ? "hidden" : "block"}`}>
                  {label}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;