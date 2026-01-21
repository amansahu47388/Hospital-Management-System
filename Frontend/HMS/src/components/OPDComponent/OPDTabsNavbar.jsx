import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  Pill,
  Beaker,
  Scissors,
  Receipt,
  CreditCard,
  Video,
  Clock,
  History,
  Heart,
} from "lucide-react";

export default function OPDTabsNavbar() {
  const scrollContainerRef = useRef(null);

  // STATIC FOR NOW
  const opdId = 210;

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "visits", label: "Visits", icon: Calendar },
    { id: "medication", label: "Medication", icon: Pill },
    { id: "lab-investigation", label: "Lab Investigation", icon: Beaker },
    { id: "operations", label: "Operations", icon: Scissors },
    { id: "charges", label: "Charges", icon: Receipt },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "treatment-history", label: "Treatment History", icon: History },
    { id: "vitals", label: "Vitals", icon: Heart },
  ];

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft +=
        direction === "right" ? 300 : -300;
    }
  };

  return (
    <div className="bg-white rounded-t-lg shadow-md">
      <div className="flex items-center gap-2 px-2 md:px-4">

        {/* LEFT ARROW */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft size={20} />
        </button>

        {/* TABS */}
        <div
          ref={scrollContainerRef}
          className="flex flex-1 gap-1 overflow-x-auto hide-scrollbar py-3"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.id}
                to={`/admin/opd-patients/${opdId}/${tab.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium whitespace-nowrap transition-all
                  ${
                    isActive
                      ? "text-[#6046B5] bg-purple-50 border border-[#6046B5]"
                      : "text-gray-600 hover:text-[#6046B5] hover:bg-gray-50 border border-transparent"
                  }`
                }
              >
                <Icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
