import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import OPDTabsNavbar from "../../components/OPDComponent/OPDTabsNavbar";
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Save,
    CheckCircle,
    Calendar,
    ChevronDown,
    Trash,
} from "lucide-react";

export default function OPDVitalsPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedVital, setSelectedVital] = useState(null);

    const vitalsData = [
        {
            date: "12/29/2025 10:02 AM",
            height: "",
            weight: "13",
            pulse: "",
            temperature: "",
            bp: "",
        },
    ];

    const handleOpenEdit = (item) => {
        setSelectedVital(item);
        setShowEditModal(true);
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
                            <h2 className="text-xl font-bold text-gray-800">Vitals</h2>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-semibold text-sm"
                        >
                            <Plus size={18} />
                            Add Vital
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    {[
                                        "Date",
                                        "Height\n(1 - 200 Centimeters)",
                                        "Weight\n(0 - 150 Kilograms)",
                                        "Pulse\n(70 - 100 Beats per)",
                                        "Temperature\n(95.8 - 99.3 Fahrenheit)",
                                        "BP\n(90/60 - 140/90 mmHg)",
                                        "Action",
                                    ].map((head, idx) => (
                                        <th key={idx} className="px-6 py-4 text-xs font-bold whitespace-pre-wrap">
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {vitalsData.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600 font-bold">{row.date.split(' ')[0]}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.height || "-"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.weight} <span className="text-xs text-gray-400">({row.date.split(' ')[1]} {row.date.split(' ')[2]})</span></td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.pulse || "-"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.temperature || "-"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.bp || "-"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(row)}
                                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Vital Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                {showAddModal ? "Add Vital" : "Edit Vital"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setShowEditModal(false);
                                }}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="grid grid-cols-12 gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div className="col-span-12 md:col-span-5 flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-700">Vital Name <span className="text-red-500">*</span></label>
                                    <select className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 outline-none text-sm">
                                        <option>Select</option>
                                        <option selected={showEditModal}>Weight</option>
                                        <option>Height</option>
                                        <option>Pulse</option>
                                        <option>Temperature</option>
                                        <option>BP</option>
                                    </select>
                                </div>
                                <div className="col-span-12 md:col-span-3 flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-700">Vital Value <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 outline-none text-sm"
                                        defaultValue={showEditModal ? selectedVital.weight : ""}
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-3 flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-700">Date <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500 outline-none text-sm pr-8"
                                            defaultValue={showEditModal ? selectedVital.date : "01/20/2026 09:58 AM"}
                                        />
                                        <Calendar className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                    </div>
                                </div>
                                <div className="col-span-12 md:col-span-1 flex justify-center pb-1">
                                    {showAddModal && (
                                        <button className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors">
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {showAddModal && (
                                <div className="mt-4">
                                    <button className="bg-[#4fb8ea] hover:bg-[#3daadd] text-white px-4 py-1.5 rounded flex items-center gap-1 text-[11px] font-bold shadow-sm transition-all focus:ring-2 focus:ring-blue-300">
                                        <Plus size={14} /> Add
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setShowEditModal(false);
                                }}
                                className="bg-[#4fb8ea] hover:bg-[#3daadd] text-white px-8 py-2 rounded flex items-center gap-2 transition-all shadow-md font-bold text-xs"
                            >
                                <CheckCircle size={16} />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
