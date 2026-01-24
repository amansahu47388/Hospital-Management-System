import React from "react";
import { useParams, NavLink } from "react-router-dom";
import {Eye,Scissors,Receipt,CreditCard,History, Heart,} from "lucide-react";

export default function OPDNavbar() {
  const { opdId } = useParams();

  const tabs = [
    { to: `/admin/opd-patients/${opdId}/profile`, label: "Overview", icon: Eye },
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


  return (
    <div className="bg-white rounded-t-lg shadow-md">
      <div className="flex items-center gap-2 px-2 md:px-4">
        {/* TABS */}
        <div className="flex flex-1 gap-1 overflow-x-auto hide-scrollbar py-3">
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
      </div>
    </div>
  );
}
