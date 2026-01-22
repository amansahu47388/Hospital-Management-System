import React, { useRef } from "react";
import { NavLink } from "react-router-dom";
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
  const scrollContainerRef = useRef(null);

  // STATIC FOR NOW
  const ipdId = 115;

  const tabs = [
    { id: "profile", label: "Overview", icon: Eye },
    { id: "nurse-notes", label: "Nurse Notes", icon: MessageSquare },
    { id: "prescription", label: "Prescription", icon: FileText },
    { id: "consultant", label: "Consultant Register", icon: Users },
    { id: "lab", label: "Lab Investigation", icon: Beaker },
    { id: "operations", label: "Operations", icon: Scissors },
    { id: "charges", label: "Charges", icon: Receipt },
    { id: "payments", label: "Payment", icon: CreditCard },
    { id: "bed-history", label: "Bed History", icon: Home },
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
                key={tab.id}
                to={`/admin/ipd-patients/${ipdId}/${tab.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all whitespace-nowrap ${
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
