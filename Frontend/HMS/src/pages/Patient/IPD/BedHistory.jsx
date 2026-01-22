import React, { useState } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { Bed, Search, Printer, FileText, FileSpreadsheet } from "lucide-react";

export default function BedHistory() {
    const [data] = useState([
        {
            group: "VIP Ward",
            bed: "GF - 101",
            fromDate: "12/02/2021 10:00 AM",
            toDate: "",
            active: "Yes",
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
                            <Bed className="text-indigo-600" />
                            Bed History
                        </h2>

                        <div className="flex gap-2">
                            <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Print">
                                <Printer size={18} />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Export Excel">
                                <FileSpreadsheet size={18} />
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
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="p-4 text-left">Bed Group</th>
                                    <th className="p-4">Bed</th>
                                    <th className="p-4">From Date</th>
                                    <th className="p-4">To Date</th>
                                    <th className="p-4 text-center">Active Bed</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((row, i) => (
                                    <tr
                                        key={i}
                                        className="hover:bg-indigo-50/30 transition-colors group"
                                    >
                                        <td className="p-4 font-medium text-gray-800">{row.group}</td>
                                        <td className="p-4 text-indigo-600 font-medium">{row.bed}</td>
                                        <td className="p-4 text-gray-600">{row.fromDate}</td>
                                        <td className="p-4 text-gray-600">{row.toDate || "-"}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.active === "Yes" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                                {row.active}
                                            </span>
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
