import React from "react";
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
  Video,
  Home,
  Clock,
  History,
  Heart,
} from "lucide-react";

export default function IPDHeaderNavbar() {
  const scrollTabs = (direction) => {
    const el = document.getElementById("ipd-tabs-scroll");
    if (!el) return;
    el.scrollLeft += direction === "left" ? -300 : 300;
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye, active: true },
    { id: "nurse-notes", label: "Nurse Notes", icon: Activity },
    { id: "medication", label: "Medication", icon: Pill },
    { id: "prescription", label: "Prescription", icon: FileText },
    { id: "consultant", label: "Consultant Register", icon: Users },
    { id: "lab", label: "Lab Investigation", icon: Beaker },
    { id: "operations", label: "Operations", icon: Scissors },
    { id: "charges", label: "Charges", icon: Receipt },
    { id: "payments", label: "Payment", icon: CreditCard },
    { id: "live-consultation", label: "Live Consultation", icon: Video },
    { id: "bed-history", label: "Bed History", icon: Home },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "treatment-history", label: "Treatment History", icon: History },
    { id: "vitals", label: "Vitals", icon: Heart },
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
          ‹
        </button>

        {/* Tabs */}
        <div
          id="ipd-tabs-scroll"
          className="flex-1 flex gap-1 overflow-x-auto hide-scrollbar"
        >
          {tabs.map(({ id, label, icon: Icon, active }) => (
            <a
              key={id}
              href={`/patient-portal/ipd-history/${id}`}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 text-xs md:text-sm whitespace-nowrap rounded
                ${
                  active
                    ? "font-semibold text-white border-b-2 border-white"
                    : "font-medium text-white/85 hover:text-white hover:bg-white/10"
                }`}
            >
              <Icon size={16} className="text-white" />
              <span>{label}</span>
            </a>
          ))}
        </div>

        {/* Right Scroll */}
        <button
          type="button"
          onClick={() => scrollTabs("right")}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded bg-white/10 text-white hover:bg-white/20"
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </div>
  );
}
