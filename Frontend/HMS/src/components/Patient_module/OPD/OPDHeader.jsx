import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, ClipboardList, Microscope, History, Clock, Activity } from 'lucide-react';

export default function OPDHeader() {
    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutGrid },
        { id: 'visits', label: 'Visits', icon: ClipboardList },
        { id: 'lab', label: 'Lab Investigation', icon: Microscope },
        { id: 'treatment', label: 'Treatment History', icon: History },
        { id: 'timeline', label: 'Timeline', icon: Clock },
        { id: 'vitals', label: 'Vital', icon: Activity },
    ];

    return (
        <div className="bg-white rounded-t-lg border-b border-gray-200">
            <div className="flex overflow-x-auto no-scrollbar">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <NavLink
                            key={tab.id}
                            to={`/patient-portal/opd-history/${tab.id}`}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative border-r border-gray-100 last:border-r-0 whitespace-nowrap ${isActive
                                    ? 'text-[#6046B5] bg-gray-50/50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <Icon size={16} />
                                    {tab.label}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#6046B5] to-[#8A63D2]" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </div>
        </div>
    );
}
