import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FlaskConical,
  Bed,
  Stethoscope,
  Pill,
  UserRound,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/staff", label: "Staff", Icon: Users },
  { to: "/lab", label: "Lab", Icon: FlaskConical },
  { to: "/ward", label: "Ward", Icon: Bed },
  { to: "/treatment", label: "Treatment", Icon: Stethoscope },
  { to: "/pharmacy", label: "Pharmacy", Icon: Pill },
  { to: "/patient", label: "Patient", Icon: UserRound },
];

 function Sidebar() {
  return (
    <aside
      className="w-64 min-h-screen hidden md:block text-white
                 bg-gradient-to-b from-[#6046B5] to-[#8A63D2]"
    >
      <div className="p-6">
        {/* Logo Section */}
        <div className="text-xl font-bold mb-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
            ML
          </div>
          <span>MediLab Hospital</span>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-3 text-md font-bold">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `w-full flex items-center gap-4 py-2 px-2 transition no-underline
                 ${isActive ? "!text-white bg-white/10 rounded-md" : "!text-white hover:!text-gray-200"}`
              }
            >
              <Icon size={20} className="flex-shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}
export default Sidebar;