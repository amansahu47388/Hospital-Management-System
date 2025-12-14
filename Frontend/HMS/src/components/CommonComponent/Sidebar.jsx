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
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/lab", label: "Lab", Icon: FlaskConical },
  { to: "/ward", label: "Ward", Icon: Bed },
  { to: "/treatment", label: "Treatment", Icon: Stethoscope },
  { to: "/pharmacy", label: "Pharmacy", Icon: Pill },
  { to: "/patient", label: "Patient", Icon: UserRound },
  { to: "/Appointment", label: "Appointment", Icon: Calendar },
  { to: "/OPD-Out Patient", label: "OPD-Out patient", Icon: Hospital },
  { to: "/IPD-In Patient", label: "IPD-In Patient", Icon: Bed },
  { to: "/pathology", label: "Pathology", Icon: FlaskConical },
  { to: "/blood-bank", label: "Blood Bank", Icon: Droplet },
  { to: "/Radiology", label: "Radiology", Icon: FolderGit2 },
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

  return (
    <>
      {/* MOBILE HAMBURGER */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed  left-4 z-50 bg-[#6046B5] text-white p-2 rounded-md"
      >
        ☰
      </button>

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:relative z-50
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${collapsed ? "md:w-20" : "md:w-64"}
          w-64 h-screen overflow-y-auto
          text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
          transition-all duration-300
        `}
      >
        <div className="p-6">

          {/* LOGO + DESKTOP COLLAPSE */}
          <div className="text-xl font-bold mb-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              ML
            </div>

            {!collapsed && <span>MediLab Hospital</span>}

            {/* DESKTOP COLLAPSE BUTTON */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex ml-auto bg-white/20 hover:bg-white/30  rounded-md transition"
            >
              ☰
            </button>
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-3 text-md font-bold pb-10">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={() => setMobileOpen(false)}
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
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
