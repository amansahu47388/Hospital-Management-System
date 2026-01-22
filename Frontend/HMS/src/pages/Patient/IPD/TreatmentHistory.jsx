import React, { useState } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { History, Search, Printer, FileText, User, Bed } from "lucide-react";

export default function TreatmentHistory() {
    const [data] = useState([
        {
            ipdNo: "IPDN14",
            symptoms: "Feeling sad or down Personality change in a way that seems different for that person.",
            consultant: "Amit Singh (9009)",
            bed: "GF - 101 - VIP Ward - Ground Floor",
        },
        {
            ipdNo: "IPDN7",
            symptoms: "Atopic dermatitis (Eczema) Atopic dermatitis usually develops in early childhood and is more common in people who have a family history of the condition.",
            consultant: "Amit Singh (9009)",
            bed: "GF - 101 - VIP Ward - Ground Floor",
        },
        {
            ipdNo: "IPDN2",
            symptoms: "Cramps and injuries Muscle pain: Muscle spasms, cramps and injuries can all cause muscle pain. Some infections or tumors may also lead to muscle pain. Tendon and ligament pain: Ligaments and tendons",
            consultant: "Amit Singh (9009)",
            bed: "SF - 105 - Private Ward - 3rd Floor",
        },
    ]);

    return (
        <PatientLayout>
            <IPDHeaderNavbar />
            <div className="min-h-screen p-4 md:p-6 transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="p-5 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <History className="text-indigo-600" />
                            Treatment History
                        </h2>

                        <div className="flex gap-2">
                            <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Print">
                                <Printer size={18} />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Export Excel">
                                <FileText size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50/30">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto p-2">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="p-4 rounded-tl-lg">IPD No</th>
                                    <th className="p-4 w-1/2">Symptoms</th>
                                    <th className="p-4">Consultant</th>
                                    <th className="p-4 rounded-tr-lg">Bed</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((row, i) => (
                                    <tr
                                        key={i}
                                        className="hover:bg-indigo-50/30 transition-colors group"
                                    >
                                        <td className="p-4 font-medium text-indigo-600 whitespace-nowrap align-top">{row.ipdNo}</td>
                                        <td className="p-4 text-gray-700 align-top">
                                            <p className="line-clamp-2 hover:line-clamp-none transition-all duration-300">
                                                {row.symptoms}
                                            </p>
                                        </td>
                                        <td className="p-4 text-gray-600 align-top whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-gray-400" />
                                                {row.consultant}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600 align-top">
                                            <div className="flex items-center gap-2">
                                                <Bed size={14} className="text-gray-400" />
                                                {row.bed}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t text-xs text-gray-500 bg-gray-50">
                        Records: 1 to {data.length} of {data.length}
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
}
