import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import OPDTabsNavbar from "../../components/OPDComponent/OPDTabsNavbar";
import {
    Search,
    Eye,
    X,
    ChevronDown,
    Printer,
    Copy,
    FileSpreadsheet,
    FileText,
    FileIcon as FilePdf,
    Edit2,
    Trash2,
} from "lucide-react";

export default function OPDTreatmentHistory() {
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedVisit, setSelectedVisit] = useState(null);

    const treatmentData = [
        {
            opdNo: "OPDN7607",
            caseId: 7636,
            date: "01/20/2026 10:02 AM",
            symptoms: "",
            consultant: "Sonia Bush (9002)",
        },
        {
            opdNo: "OPDN7546",
            caseId: 7574,
            date: "12/10/2025 12:40 PM",
            symptoms: "Feeling sad or down\nPersonality change in a way that seems different for that person.",
            consultant: "Reyan Jain (9011)",
        },
        {
            opdNo: "OPDN7416",
            caseId: 7444,
            date: "10/15/2025 12:00 PM",
            symptoms: "Cramps and injuries\nMuscle pain: Muscle spasms, cramps and injuries can all cause muscle pain...",
            consultant: "Reyan Jain (9011)",
        },
    ];

    const handleOpenDetail = (visit) => {
        setSelectedVisit(visit);
        setShowDetailModal(true);
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 pb-10">
                <div className="mx-4 md:mx-6">
                    <OPDTabsNavbar />
                </div>

                <div className="mx-4 md:mx-6 bg-white rounded-b-lg shadow-xl overflow-hidden min-h-[500px]">
                    {/* Page Header */}
                    <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Treatment History</h2>
                        </div>
                    </div>

                    {/* Table Actions */}
                    <div className="px-4 md:px-6 pb-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-gray-100">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="flex items-center gap-2 mr-4">
                                <select className="p-1.5 border border-gray-200 rounded text-xs outline-none">
                                    <option>100</option>
                                    <option>50</option>
                                    <option>25</option>
                                </select>
                            </div>
                            {[Copy, FileSpreadsheet, FileText, FilePdf, Printer].map((Icon, i) => (
                                <button key={i} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-all">
                                    <Icon size={18} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    {[
                                        "OPD No",
                                        "Case ID",
                                        "Appointment Date",
                                        "Symptoms",
                                        "Consultant Doctor",
                                        "Action",
                                    ].map((head) => (
                                        <th key={head} className="px-6 py-4 text-sm font-bold">
                                            <div className="flex items-center gap-1">
                                                {head}
                                                <ChevronDown size={14} />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {treatmentData.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-bold text-[#3daadd] hover:underline cursor-pointer">{row.opdNo}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-semibold">{row.caseId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {row.date.split(' ').slice(0, 1).join(' ')}
                                            <div className="text-[10px] text-gray-400">{row.date.split(' ').slice(1).join(' ')}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 ">
                                            {row.symptoms}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-semibold">{row.consultant}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex justify-end pr-4">
                                                <button
                                                    onClick={() => handleOpenDetail(row)}
                                                    className="p-1 px-3 text-purple-600 hover:text-purple-800 "
                                                    title="Show Details"
                                                    
                                                >
                                                   <Eye size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                        <div>Records: 1 to {treatmentData.length} of {treatmentData.length}</div>
                        <div className="flex gap-1">
                            <button className="p-1 px-2 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>&lt;</button>
                            <button className="p-1 px-3 bg-blue-50 text-[#3daadd] border border-blue-100 rounded">1</button>
                            <button className="p-1 px-2 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>&gt;</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visit Detail Modal */}
            {showDetailModal && selectedVisit && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white text-xl font-bold">Visit Details</h3>
                            <div className="flex items-center gap-4 text-white">
                                <Printer size={20} className="hover:text-white transition-colors cursor-pointer" />
                                <Edit2 size={20} className="hover:text-white transition-colors cursor-pointer" />
                                <Trash2 size={20} className="hover:text-white transition-colors cursor-pointer" />
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-white hover:text-white transition-colors"
                                >
                                    <X size={28} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Case ID</span>
                                    <span className="text-sm text-gray-600">{selectedVisit.caseId}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">OPD No</span>
                                    <span className="text-sm text-gray-600">{selectedVisit.opdNo}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Patient Name</span>
                                    <span className="text-sm text-gray-600 font-bold">Jagat Nawal (1071)</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Guardian Name</span>
                                    <span className="text-sm text-gray-600"></span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Marital Status</span>
                                    <span className="text-sm text-gray-600"></span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Email</span>
                                    <span className="text-sm text-[#3daadd]">nitni25@gmail.com</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Age</span>
                                    <span className="text-sm text-gray-600"></span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Known Allergies</span>
                                    <span className="text-sm text-gray-600"></span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Case</span>
                                    <span className="text-sm text-gray-600"></span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Reference</span>
                                    <span className="text-sm text-gray-600"></span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Consultant Doctor</span>
                                    <span className="text-sm text-gray-600">{selectedVisit.consultant}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Symptoms</span>
                                    <span className="text-sm text-gray-600"></span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Recheckup ID</span>
                                    <span className="text-sm text-gray-600 font-bold">CHKID7610</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Old Patient</span>
                                    <span className="text-sm text-gray-600"></span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2 pt-4">
                                    {/* Empty space matching screenshot layout */}
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Gender</span>
                                    <span className="text-sm text-gray-600">Male</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Phone</span>
                                    <span className="text-sm text-gray-600">96636652541</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Address</span>
                                    <span className="text-sm text-gray-600"></span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Blood Group</span>
                                    <span className="text-sm text-gray-600"></span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Appointment Date</span>
                                    <span className="text-sm text-gray-600">{selectedVisit.date}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Casualty</span>
                                    <span className="text-sm text-gray-600"></span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">TPA</span>
                                    <span className="text-sm text-gray-600"></span>
                                </div>
                                <div className="flex justify-between border-b border-gray-50 pb-2">
                                    <span className="font-bold text-sm text-gray-800">Note</span>
                                    <span className="text-sm text-gray-600"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
