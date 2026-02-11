import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutGrid,
    ClipboardList,
    Microscope,
    History,
    Activity,
    Scissors,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

export default function OPDHeader() {
    const scrollContainerRef = useRef(null);

    const tabs = [
        { to: '/patient-portal/opd-history/overview', label: 'Overview', icon: LayoutGrid },
        { to: '/patient-portal/opd-history/visits', label: 'Visits', icon: ClipboardList },
        { to: '/patient-portal/opd-history/operations', label: 'Operations', icon: Scissors },
        { to: '/patient-portal/opd-history/lab', label: 'Lab Investigation', icon: Microscope },
        { to: '/patient-portal/opd-history/vitals', label: 'Vital', icon: Activity },
    ];

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft += direction === 'right' ? 300 : -300;
        }
    };

    return (
        <div className="bg-white rounded-t-lg shadow-md">
            <div className="flex items-center gap-2 px-2 md:px-4">
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
                                        ? 'text-[#6046B5] bg-purple-50 border border-[#6046B5]'
                                        : 'text-gray-600 hover:text-[#6046B5] hover:bg-gray-50 border border-transparent'
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
