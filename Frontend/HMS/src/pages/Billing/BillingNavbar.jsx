import React from "react";
import { Link, useLocation } from "react-router-dom";

function BillingNavbar() {
    const location = useLocation();
    const tabs = [
        { name: "OPD", path: "?tab=OPD" },
        { name: "IPD", path: "?tab=IPD" },
        { name: "Pharmacy", path: "?tab=Pharmacy" },
        { name: "Pathology", path: "?tab=Pathology" },
        { name: "Radiology", path: "?tab=Radiology" },
        { name: "Ambulance", path: "?tab=Ambulance" },
    ];

    // Helper to check active state based on query param or default
    const query = new URLSearchParams(location.search);
    const currentTab = query.get("tab") || "OPD";

    return (
        <div className="mb-4 overflow-x-auto">
            <div className="flex space-x-1 border-b border-gray-200 min-w-max">
                {tabs.map((tab) => (
                    <Link
                        key={tab.name}
                        to={tab.path}
                        className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 hover:text-[#6046B5] ${currentTab === tab.name
                            ? "border-[#6046B5] text-[#6046B5]"
                            : "border-transparent text-gray-500"
                            }`}
                    >
                        {tab.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default BillingNavbar;
