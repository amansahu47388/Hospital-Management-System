import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Link, useNavigate } from "react-router-dom";
import {
    FaCalendarAlt,
    FaStethoscope,
    FaFlask,
    FaXRay,
    FaBars,
    FaSearch,
} from "react-icons/fa";
import { MdLocalPharmacy, MdEmergency } from "react-icons/md";

function Billing() {
    const [caseId, setCaseId] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    const modules = [
        {
            id: 1,
            title: "Appointment",
            icon: (
                <FaCalendarAlt className="text-4xl mb-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            ),
            link: "/admin/appointments",
        },
        {
            id: 2,
            title: "OPD",
            icon: (
                <FaStethoscope className="text-4xl mb-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            ),
            link: "/admin/opd-patients",
        },
        {
            id: 3,
            title: "Pathology",
            icon: (
                <FaFlask className="text-4xl mb-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            ),
            link: "/admin/pathology-bills",
        },
        {
            id: 4,
            title: "Radiology",
            icon: (
                <FaXRay className="text-4xl mb-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            ),
            link: "/admin/radiology-bills",
        },
    ];

    const menuModules = [
        ...modules,
        { id: 5, title: 'Pharmacy', link: '/admin/pharmacy-bills', icon: <MdLocalPharmacy className="mr-2" /> },
        { id: 6, title: 'Ambulance', link: '/admin/ambulance', icon: <MdEmergency className="mr-2" /> },
    ];

    const handleSearch = () => {
        if (caseId.trim()) {
            // Navigate to the details page
            navigate("/admin/billing/details", { state: { caseId } });
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side: Single Module Billing */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-2">
                            Single Module Billing
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {modules.map((module) => (
                                <Link
                                    key={module.id}
                                    to={module.link}
                                    className="group flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg cursor-pointer transition-all duration-300 bg-white hover:bg-gradient-to-b hover:from-[#6046B5] hover:to-[#8A63D2] hover:border-transparent hover:shadow-lg"
                                >
                                    {module.icon}
                                    <h3 className="text-lg font-medium text-gray-700 group-hover:text-white transition-colors duration-300">
                                        {module.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: OPD/IPD Billing Through Case Id */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-fit relative">
                        <div className="flex justify-between items-center mb-6 border-b pb-2">
                            <h2 className="text-xl font-semibold text-gray-700">
                                OPD/IPD Billing Through Case Id
                            </h2>
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-2 bg-[#6046B5] text-white rounded hover:bg-[#4E379E] transition-colors"
                                >
                                    <FaBars />
                                </button>
                                {/* Menu Dropdown */}
                                {showMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 z-10 p-2">
                                        <div className="bg-gray-100 p-2 text-sm text-gray-700 font-semibold mb-2 rounded">Single Module Billing</div>
                                        <ul className="space-y-1">
                                            {menuModules.map((mod) => (
                                                <li key={mod.id}>
                                                    <Link
                                                        to={mod.link}
                                                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-[#6046B5] hover:to-[#8A63D2] hover:text-white rounded transition-colors"
                                                        onClick={() => setShowMenu(false)}
                                                    >
                                                        {mod.icon && <span className="mr-2 text-lg">{mod.icon}</span>}
                                                        {!mod.icon && <span className="mr-2 text-lg">▪</span>}
                                                        {mod.title}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className="w-full sm:w-auto flex-grow">
                                <label htmlFor="caseId" className="block text-sm font-medium text-gray-700 mb-1 sm:hidden">
                                    Case ID <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center">
                                    <span className="hidden sm:inline-block text-sm font-semibold text-gray-700 mr-2 whitespace-nowrap">
                                        Case ID <span className="text-red-500">*</span>
                                    </span>
                                    <input
                                        type="text"
                                        id="caseId"
                                        value={caseId}
                                        onChange={(e) => setCaseId(e.target.value)}
                                        placeholder="Enter Case ID"
                                        className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#6046B5] focus:border-[#6046B5]"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-[#0b65c2] text-white px-4 py-2 rounded-r-md text-sm font-medium transition-colors flex items-center"
                                    >
                                        <span className="mr-1"><FaSearch /></span> Search
                                    </button>
                                </div>

                            </div>
                        </div>
                        {/* Placeholder for results or additional content can go here */}
                        <div className="mt-8 min-h-[100px] text-center text-gray-300">
                            <p>Enter Case ID to proceed to billing details</p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Billing;
