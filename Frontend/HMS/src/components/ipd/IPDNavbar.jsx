import React, { useRef } from "react";
import { useParams, NavLink } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileText,
  Pill,
  Users,
  Beaker,
  Scissors,
  Receipt,
  CreditCard,
  Video,
  Home,
  Clock,
  History,
  Heart,
  MessageSquare,
} from "lucide-react";

export default function IPDNavbar() {
  const { ipdId } = useParams();
  const scrollContainerRef = useRef(null);

  const tabs = [
    { to: `/admin/ipd-patients/${ipdId}/profile`, label: "Overview", icon: Eye },
    {
      to: `/admin/ipd-patients/${ipdId}/nurse-notes`,
      label: "Nurse Notes",
      icon: MessageSquare,
    },
    {
      to: `/admin/ipd-patients/${ipdId}/prescription`,
      label: "Prescription",
      icon: FileText,
    },
    {
      to: `/admin/ipd-patients/${ipdId}/consultant`,
      label: "Consultant Register",
      icon: Users,
    },
    {
      to: `/admin/ipd-patients/${ipdId}/operations`,
      label: "Operations",
      icon: Scissors,
    },
    {
      to: `/admin/ipd-patients/${ipdId}/charges`,
      label: "Charges",
      icon: Receipt,
    },
    {
      to: `/admin/ipd-patients/${ipdId}/payments`,
      label: "Payment",
      icon: CreditCard,
    },
    {
      to: `/admin/ipd-patients/${ipdId}/bed-history`,
      label: "Bed History",
      icon: Home,
    },
    {
      to: `/admin/ipd-patients/${ipdId}/treatment-history`,
      label: "Treatment History",
      icon: History,
    },
    { to: `/admin/ipd-patients/${ipdId}/vitals`, label: "Vitals", icon: Heart },
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

        {/* LEFT */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft size={20} />
        </button>

        {/* TABS */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto hide-scrollbar gap-1 flex-1 py-3"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all whitespace-nowrap ${isActive
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

        {/* RIGHT */}
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
