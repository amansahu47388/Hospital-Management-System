import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import OPDTabsNavbar from "../../components/OPDComponent/OPDTabsNavbar";
//import IPDHeader from "../../components/ipd/IPDHeader";
import {
    FileText,
    Edit2,
    Trash2,
    Plus,
    Search,
    Download,
    Copy,
    FileSpreadsheet,
    FileIcon as FilePdf,
    X,
    Save,
    ChevronDown,
} from "lucide-react";

export default function OPDMedicationPage() {
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
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

    const medicationData = [
        {
            date: "12/28/2025",
            day: "Sunday",
            name: "Alprovit",
            dose: "Time: 07:19 PM",
            qty: "1 CT",
            remark: "bo",
            createdBy: "Super Admin (9001)",
        },
    ];

    const toggleModal = (edit = false) => {
        setEditMode(edit);
        setShowModal(!showModal);
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
                            <h2 className="text-xl font-bold text-gray-800">Medication</h2>
                        </div>
                        <button
                            onClick={() => toggleModal(false)}
                            className="bg-[#6046B5] hover:bg-[#4c3893] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-semibold"
                        >
                            <Plus size={18} />
                            Add Medication Dose
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-y border-gray-100">
                                <tr>
                                    {["Date", "Medicine Name", "Dose1", "Action"].map((head) => (
                                        <th key={head} className="px-6 py-4 text-sm font-bold text-gray-600 uppercase tracking-wider">
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {medicationData.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{row.date}</div>
                                            <div className="text-xs text-gray-500">({row.day})</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-semibold">{row.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-xs text-gray-600 leading-relaxed">
                                                    <p><span className="font-bold">Time:</span> {row.dose.split(": ")[1]}</p>
                                                    <p><span className="font-bold">{row.qty}</span></p>
                                                    <p><span className="font-bold">Remark:</span> {row.remark}</p>
                                                    <p><span className="font-bold">Created By:</span> {row.createdBy}</p>
                                                </div>
                                                <button
                                                    onClick={() => toggleModal(true)}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded shadow-sm"
                                                >
                                                    <Plus size={12} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex gap-2">
                                                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
                                                    <FileText size={16} />
                                                </button>
                                                <button
                                                    onClick={() => toggleModal(true)}
                                                    className="p-1.5 hover:bg-gray-100 rounded text-gray-500"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500">
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

            {/* Medication Dose Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                {editMode ? <Edit2 size={24} /> : <Plus size={24} />}
                                {editMode ? "Edit Medication Dose" : "Add Medication Dose"}
                            </h3>
                            <div className="flex items-center gap-2">
                                {editMode && <Trash2 size={20} className="text-white/80 hover:text-white cursor-pointer" />}
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-white/80 hover:text-white transition-colors p-1"
                                >
                                    <X size={28} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Date */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-gray-700">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm"
                                        defaultValue={editMode ? "2025-12-28" : ""}
                                    />
                                </div>

                                {/* Time */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-gray-700">
                                        Time <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="time"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm"
                                            defaultValue={editMode ? "19:19" : ""}
                                        />
                                    </div>
                                </div>

                                {/* Medicine Category */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-gray-700">
                                        Medicine Category <span className="text-red-500">*</span>
                                    </label>
                                    <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm">
                                        <option>Select</option>
                                        <option selected={editMode}>Syrup</option>
                                        <option>Tablet</option>
                                    </select>
                                </div>

                                {/* Medicine Name */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-gray-700">
                                        Medicine Name <span className="text-red-500">*</span>
                                    </label>
                                    <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm">
                                        <option>Select</option>
                                        <option selected={editMode}>Alprovit</option>
                                    </select>
                                </div>

                                {/* Dosage */}
                                <div className="flex flex-col gap-1.5 sm:col-span-2">
                                    <label className="text-sm font-bold text-gray-700">
                                        Dosage <span className="text-red-500">*</span>
                                    </label>
                                    <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm">
                                        <option>Select</option>
                                        <option selected={editMode}>1 CT</option>
                                    </select>
                                </div>

                                {/* Remarks */}
                                <div className="flex flex-col gap-1.5 sm:col-span-2">
                                    <label className="text-sm font-bold text-gray-700">Remarks</label>
                                    <textarea
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm"
                                        rows="3"
                                        defaultValue={editMode ? "bo" : ""}
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className=" bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-[#269a4d] text-white px-8 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md font-bold text-sm tracking-wide transform active:scale-95"
                            >
                                <Save size={18} />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
