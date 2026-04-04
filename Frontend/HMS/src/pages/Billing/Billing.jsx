import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  Stethoscope,
  FlaskConical,
  Scan,
  Menu,
  Search,
  Pill,
  Siren,
  User
} from "lucide-react";
import { searchPatient, getMedicalCases } from "../../api/patientApi";
import { useNotify } from "../../context/NotificationContext";


function Billing() {
    const [caseId, setCaseId] = useState("");
    const [patientName, setPatientName] = useState("");
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [cases, setCases] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [loadingCases, setLoadingCases] = useState(false);
    const navigate = useNavigate();
    const notify = useNotify();

    const modules = [
        {
            id: 1,
            title: "Appointment",
            icon: (
                <Calendar className="text-4xl mb-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            ),
            link: "/admin/appointments",
        },
        {
            id: 2,
            title: "OPD",
            icon: (
                <Stethoscope className="text-4xl mb-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            ),
            link: "/admin/opd-patients",
        },
        {
            id: 3,
            title: "Pathology",
            icon: (
                <FlaskConical className="text-4xl mb-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            ),
            link: "/admin/pathology-bills",
        },
        {
            id: 4,
            title: "Radiology",
            icon: (
                <Scan className="text-4xl mb-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
            ),
            link: "/admin/radiology-bills",
        },
    ];

    const menuModules = [
        ...modules,
        { id: 5, title: 'Pharmacy', link: '/admin/pharmacy-bills', icon: <Pill className="mr-2" /> },
        { id: 6, title: 'Ambulance', link: '/admin/ambulance', icon: <Siren className="mr-2" /> },
    ];

    const handlePatientSearch = async () => {
        if (!patientName.trim()) {
            notify("warning", "Please enter a patient name");
            return;
        }
        try {
            setLoadingPatients(true);
            const res = await searchPatient(patientName);
            const data = res.data || [];
            setPatients(data);
            if (data.length === 0) {
                notify("info", "No patients found");
            }
        } catch (error) {
            console.error("Patient search error:", error);
            notify("error", "Failed to search patients");
        } finally {
            setLoadingPatients(false);
        }
    };

    const handlePatientSelect = async (patientId) => {
        setSelectedPatientId(patientId);
        setCaseId("");
        if (!patientId) {
            setCases([]);
            return;
        }
        try {
            setLoadingCases(true);
            const res = await getMedicalCases(patientId);
            setCases(res.data || []);
        } catch (error) {
            console.error("Fetch cases error:", error);
            notify("error", "Failed to fetch medical cases");
        } finally {
            setLoadingCases(false);
        }
    };

    const handleSearch = () => {
        if (caseId.trim()) {
            // Navigate to the details page
            navigate("/admin/billing/details", { state: { caseId } });
        } else {
            notify("warning", "Please select or enter a Case ID");
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side: Single Module Billing */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
                        <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b border-gray-300 pb-2">
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

                    {/* Right Side: Billing Through Case Id */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 h-fit relative">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-2">
                            <h2 className="text-xl font-semibold text-gray-700">
                                Billing Through Case Id
                            </h2>
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-2 bg-[#6046B5] text-white rounded hover:bg-[#4E379E] transition-colors"
                                >
                                    <Menu />
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

                        <div className="space-y-6">
                            {/* Patient Search */}
                            <div className="w-full">
                                <label htmlFor="patientName" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Search Patient <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center">
                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            id="patientName"
                                            value={patientName}
                                            onChange={(e) => setPatientName(e.target.value)}
                                            placeholder="Enter Patient Name..."
                                            className="w-full border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#6046B5] focus:border-[#6046B5]"
                                            onKeyPress={(e) => e.key === 'Enter' && handlePatientSearch()}
                                        />
                                        {loadingPatients && (
                                            <div className="absolute right-3 top-2.5">
                                                <div className="animate-spin h-4 w-4 border-2 border-[#6046B5] border-t-transparent rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handlePatientSearch}
                                        disabled={loadingPatients}
                                        className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-4 py-2 rounded-r-md text-sm font-medium transition-colors flex items-center disabled:opacity-50"
                                    >
                                        <Search size={16} className="mr-1" /> Search
                                    </button>
                                </div>
                                
                                {patients.length > 0 && (
                                    <div className="mt-2">
                                        <select
                                            value={selectedPatientId}
                                            onChange={(e) => handlePatientSelect(e.target.value)}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#6046B5]"
                                        >
                                            <option value="">Select Patient</option>
                                            {patients.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.first_name} {p.last_name} ({p.id})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Case ID Selection */}
                            <div className="w-full">
                                <label htmlFor="caseId" className="block text-sm font-semibold text-gray-700 mb-1">
                                    Select Case ID <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center">
                                    <select
                                        id="caseId"
                                        value={caseId}
                                        onChange={(e) => setCaseId(e.target.value)}
                                        disabled={loadingCases}
                                        className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#6046B5] focus:border-[#6046B5] disabled:bg-gray-50"
                                    >
                                        <option value="">{loadingCases ? "Loading cases..." : "Select Case ID"}</option>
                                        {cases.map(c => (
                                            <option key={c.id} value={c.case_id}>
                                                {c.case_id}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleSearch}
                                        disabled={!caseId}
                                        className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-6 py-2 rounded-r-md text-sm font-medium transition-colors flex items-center disabled:opacity-50"
                                    >
                                        Proceed
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default Billing;
