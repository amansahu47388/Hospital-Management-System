import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import OPDTabsNavbar from "../../components/OPDComponent/OPDTabsNavbar";

import {
    Search,
    Download,
    Copy,
    FileSpreadsheet,
    FileText,
    FileIcon as FilePdf,
    ChevronDown,
    Printer,
    Plus
} from "lucide-react";

export default function OPDLabInvestigationPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const patientData = {
        id: 1166,
        name: "Olivier Thomas (1)",
        age: "41 Year 4 Month 30 Days",
        gender: "Male",
        phone: "7896541230",
        email: "olivier@gmail.com",
        address: "482 Kingsway, Brooklyn West, CA",
        guardianName: "Edward Thomas",
        maritalStatus: "Married",
        bloodGroup: "B+",
        photo: "https://via.placeholder.com/150",
        admission: {
            date: "01/19/2026 06:24 PM",
            ipdNumber: "OPDN7608",
            caseId: "7611",
            consultant: "Sonia Bush (9002)",
            bed: "TF - 106",
            bedGroup: "General Ward Male",
        },
        vitals: {
            height: "180 Centimeters",
            weight: "85 Kilograms",
            bmi: "22.23",
            bloodPressure: "120/80",
            temperature: "98.6°F",
            heartRate: "72 bpm",
        },
    };

    const labData = []; // Mock empty data for now to show the "No data" UI

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 pb-10">
                

                <div className="mx-4 md:mx-6">
                    <OPDTabsNavbar />
                </div>

                <div className="mx-4 md:mx-6 bg-white rounded-b-lg shadow-xl overflow-hidden min-h-[500px]">
                    {/* Page Header */}
                    <div className="p-4 md:p-6">
                        <h2 className="text-xl font-bold text-gray-800">Lab Investigation</h2>
                    </div>

                    {/* Table Actions */}
                   

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    {["Test Name", "Lab", "Sample Collected", "Expected Date", "Approved By", "Action"].map((head) => (
                                        <th key={head} className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                {head}
                                                <ChevronDown size={14} />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {labData.length > 0 ? (
                                    labData.map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            {/* Rows would go here */}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                <p className="text-red-400 font-medium">No data available in table</p>
                                                <div className="relative">
                                                    <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center">
                                                        <FileText size={48} className="text-gray-200" />
                                                    </div>
                                                    {/* Decorative elements representing the illustration */}
                                                    <div className="absolute -top-2 -right-2 w-10 h-14 bg-white border border-gray-100 rounded shadow-sm transform rotate-12 flex flex-col p-1 gap-1">
                                                        <div className="h-1 bg-gray-100 w-full"></div>
                                                        <div className="h-1 bg-gray-100 w-2/3"></div>
                                                    </div>
                                                </div>
                                                <p className="text-green-600 font-medium cursor-pointer hover:underline flex items-center gap-1">
                                                    <Plus size={16} /> Add new record or search with different criteria.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                        <span>Records: 0 to 0 of 0</span>
                        <div className="flex gap-2">
                            <button disabled className="px-2 py-1 border rounded opacity-50 cursor-not-allowed">&lt;</button>
                            <button disabled className="px-2 py-1 border rounded opacity-50 cursor-not-allowed">&gt;</button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
