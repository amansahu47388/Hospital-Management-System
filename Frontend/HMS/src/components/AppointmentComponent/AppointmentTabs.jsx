import React from "react";
export default function AppointmentTabs({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "today", label: "Today Appointment" },
    { key: "upcoming", label: "Upcoming Appointment" },
    { key: "old", label: "Old Appointment" },
  ];

  return (
    <div className="flex gap-6 border-b border-gray-200 text-sm font-semibold">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`pb-2 ${
            activeTab === tab.key
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-600"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
