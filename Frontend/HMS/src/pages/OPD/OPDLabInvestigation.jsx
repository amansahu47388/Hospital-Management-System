import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import OPDTabsNavbar from "../../components/OPDComponent/OPDNavbar";
import {Eye} from "lucide-react";

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

export default function OPDLabInvestigation() {
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
            <div className="min-h-screen bg-gray-50">

            <OPDTabsNavbar />

            {/* Page Header */}
            <div className="p-4 md:p-6">
            <div className="bg-white rounded shadow p-4">
                <h2 className="text-xl font-bold text-gray-600">Lab Investigation</h2>
            </div>

            {/* Table Actions */}


            {/* Table */}
            <div className="overflow-x-auto shadow">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold "> Test Name </th>
                            <th className="px-6 py-4 text-sm font-bold  "> Lab </th>
                            <th className="px-6 py-4 text-sm font-bold  "> Sample Collected </th>
                            <th className="px-6 py-4 text-sm font-bold  "> Expected Date </th>
                            <th className="px-6 py-4 text-sm font-bold  "> Approved By </th>
                            <th className="px-6 py-4 text-sm font-bold  "> Action </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        <tr>
                            <td className="px-6 py-4 text-sm font-bold "> {patientData.address} </td>
                            <td className="px-6 py-4 text-sm font-bold "> {patientData.name} </td>
                            <td className="px-6 py-4 text-sm font-bold "> {patientData.age} </td>
                            <td className="px-6 py-4 text-sm font-bold "> {patientData.bloodGroup} </td>
                            <td className="px-6 py-4 text-sm font-bold "> {patientData.gender} </td>
                            <td className="px-6 py-4 text-sm font-bold "> 
                                <button className="px-2 py-1 text-purple-600 hover:bg-purple-100">
                                <Eye size={16}/>
                                </button>
                            </td>
                        </tr>
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
