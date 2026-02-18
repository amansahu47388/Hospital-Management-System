import React from "react";
import { NavLink } from "react-router-dom";
import {
  Eye,
  Activity,
  Pill,
  FileText,
  Users,
  Beaker,
  Scissors,
  Receipt,
  CreditCard,
  Home,
  Clock,
  History,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function IPDHeaderNavbar() {
  const scrollTabs = (direction) => {
    const el = document.getElementById("ipd-tabs-scroll");
    if (!el) return;
    el.scrollLeft += direction === "left" ? -300 : 300;
  };

  const tabs = [
    { to: "/patient-portal/ipd-history/overview", label: "Overview", icon: Eye },
    { to: "/patient-portal/ipd-history/nurse-notes", label: "Nurse Notes", icon: Activity },
    { to: "/patient-portal/ipd-history/prescription", label: "Prescription", icon: FileText },
    { to: "/patient-portal/ipd-history/consultant-register", label: "Consultant Register", icon: Users },
    { to: "/patient-portal/ipd-history/operations", label: "Operations", icon: Scissors },
    { to: "/patient-portal/ipd-history/charges", label: "Charges", icon: Receipt },
    { to: "/patient-portal/ipd-history/payments", label: "Payment", icon: CreditCard },
    { to: "/patient-portal/ipd-history/bed-history", label: "Bed History", icon: Home },
    { to: "/patient-portal/ipd-history/treatment-history", label: "Treatment History", icon: History },
    { to: "/patient-portal/ipd-history/vitals", label: "Vitals", icon: Heart },
  ];

  return (
    <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center gap-2 px-2 md:px-4 py-2">
        {/* Left Scroll */}
        <button
          type="button"
          onClick={() => scrollTabs("left")}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded bg-white/10 text-white hover:bg-white/20"
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Tabs */}
        <div
          id="ipd-tabs-scroll"
          className="flex-1 flex gap-1 overflow-x-auto hide-scrollbar"
        >
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm whitespace-nowrap rounded transition-all
                ${isActive
                  ? "font-semibold text-white border-b-2 border-white bg-white/10"
                  : "font-medium text-white/85 hover:text-white hover:bg-white/10"
                }`}
            >
              <Icon size={16} className="text-white" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Right Scroll */}
        <button
          type="button"
          onClick={() => scrollTabs("right")}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded bg-white/10 text-white hover:bg-white/20"
          aria-label="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
