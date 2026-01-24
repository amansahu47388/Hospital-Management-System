import React, { useRef } from "react";
import { useParams, NavLink } from "react-router-dom";
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

export default function OPDNavbar() {
  const { opdId } = useParams();
  const scrollContainerRef = useRef(null);

  const tabs = [
    { to: `/admin/opd-patients/${opdId}/profile`, label: "Overview", icon: Eye },
    { to: `/admin/opd-patients/${opdId}/visits`, label: "Visits", icon: Calendar },
    {
      to: `/admin/opd-patients/${opdId}/operations`,
      label: "Operations",
      icon: Scissors,
    },
    { to: `/admin/opd-patients/${opdId}/charges`, label: "Charges", icon: Receipt },
    {
      to: `/admin/opd-patients/${opdId}/payments`,
      label: "Payments",
      icon: CreditCard,
    },
    {
      to: `/admin/opd-patients/${opdId}/treatment-history`,
      label: "Treatment History",
      icon: History,
    },
    { to: `/admin/opd-patients/${opdId}/vitals`, label: "Vitals", icon: Heart },
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
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium whitespace-nowrap transition-all
                  ${isActive
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
