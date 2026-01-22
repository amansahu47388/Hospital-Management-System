import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import OPDTabsNavbar from "../../components/OPDComponent/OPDNavbar";

import {
    Search, Plus, Edit2, Trash2, Eye, FileText, Download, Copy, FileSpreadsheet, FileIcon as FilePdf,
    X, Save, ChevronDown, Printer, CheckCircle,
} from "lucide-react";

export default function OPDOperations() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState(null);

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

    const operationsData = [
        {
            referenceNo: "OTREF513",
            date: "01/12/2026 07:52 PM",
            name: "Tooth extraction",
            category: "ENT and Oral Surgery",
            technician: "bhf",
            doctor: "Amit Singh (9009)",
            assistant1: "shyam",
            assistant2: "ram",
            anesthetist: "nan",
            anesthesiaType: "bagv",
            otAssistant: "vv",
            remark: "fg",
            result: "fff",
        },
    ];

    const handleOpenDetail = (op) => {
        setSelectedOperation(op);
        setShowDetailModal(true);
    };

    const handleOpenEdit = (op) => {
        setSelectedOperation(op);
        setShowEditModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this operation?")) {
            // setOperations(operations.filter((op) => op.referenceNo !== id));
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 pb-10">


                <OPDTabsNavbar />

                {/* <div className="mx-4 md:mx-6 bg-white rounded-b-lg shadow-xl overflow-hidden min-h-[500px]"> */}
                {/* Page Header */}

                <div className="p-4 md:p-6 ">
                    <div className="bg-white rounded shadow p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="">
                            <h2 className="text-xl font-bold text-gray-800">Operations</h2>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-semibold"
                        >
                            <Plus size={18} />
                            Add Operation
                        </button>
                    </div>


                    {/* Table Actions */}


                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm">Reference No</th>
                                    <th className="px-4 py-3 text-left text-sm">Operation Date</th>
                                    <th className="px-4 py-3 text-left text-sm">Operation Name</th>
                                    <th className="px-4 py-3 text-left text-sm">Operation Category</th>
                                    <th className="px-4 py-3 text-left text-sm">OT Technician</th>
                                    <th className="px-4 py-3 text-left text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white border-b border-gray-200">
                                {operationsData.length > 0 ? (
                                    operationsData.map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors text-gray-600">
                                            <td className="px-4 py-4 text-sm font-medium text-gray-900">{row.referenceNo}</td>
                                            <td className="px-4 py-4 text-sm ">{row.date}</td>
                                            <td className="px-4 py-4 text-sm  font-semibold">{row.name}</td>
                                            <td className="px-4 py-4 text-sm ">{row.category}</td>
                                            <td className="px-4 py-4 text-sm ">{row.technician}</td>
                                            <td className="px-4 py-4 text-sm ">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleOpenDetail(row)}
                                                        className="hover:bg-blue-100 text-blue-500 px-2 py-1 rounded text-xs"
                                                        title="View Detail"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenEdit(row)}
                                                        className="hover:bg-purple-100 text-purple-500 px-2 py-1 rounded text-xs"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button
                                                        className="hover:bg-red-100 text-red-500 px-2 py-1 rounded text-xs"
                                                        title="Delete"
                                                        onClick={() => handleDelete(row.referenceNo)}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center">
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 text-xs text-gray-500">
                        Records: {operationsData.length} to {operationsData.length} of {operationsData.length}
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                {showAddModal ? <Plus size={24} /> : <Edit2 size={24} />}
                                {showAddModal ? "Add Operation" : "Edit Operation"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setShowEditModal(false);
                                }}
                                className="text-white/80 hover:text-white transition-colors p-1"
                            >
                                <X size={28} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto bg-white">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">
                                    Operation Category <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                                    <option>Select</option>
                                    <option selected={showEditModal}>ENT and Oral Surgery</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">
                                    Operation Name <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                                    <option>Select</option>
                                    <option selected={showEditModal}>Tooth extraction</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">
                                    Operation Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                    defaultValue={showEditModal ? "01/12/2026 7:52 PM" : ""}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">
                                    Consultant Doctor <span className="text-red-500">*</span>
                                </label>
                                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm">
                                    <option>Select</option>
                                    <option selected={showEditModal}>Amit Singh (9009)</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Assistant Consultant 1</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                    defaultValue={showEditModal ? "shyam" : ""}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Assistant Consultant 2</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                    defaultValue={showEditModal ? "ram" : ""}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Anesthetist</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                    defaultValue={showEditModal ? "nan" : ""}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Anesthesia Type</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                    defaultValue={showEditModal ? "bagv" : ""}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">OT Technician</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                    defaultValue={showEditModal ? "bhf" : ""}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">OT Assistant</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                    defaultValue={showEditModal ? "vv" : ""}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Remark</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                    defaultValue={showEditModal ? "fg" : ""}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Result</label>
                                <input
                                    type="text"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                    defaultValue={showEditModal ? "fff" : ""}
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setShowEditModal(false);
                                }}
                                className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2]  text-white px-8 py-2 rounded flex items-center gap-2 transition-all shadow-md font-bold text-xs"
                            >
                                <CheckCircle size={16} />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedOperation && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white text-xl font-bold">Operation Details</h3>
                            <div className="flex items-center gap-2">
                                <Printer size={20} className="text-white cursor-pointer" />
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-white p-1"
                                >
                                    <X size={28} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                            {[
                                { label: "Reference No", value: selectedOperation.referenceNo },
                                { label: "Operation Name", value: selectedOperation.name },
                                { label: "Date", value: selectedOperation.date },
                                { label: "Operation Category", value: selectedOperation.category },
                                { label: "Consultant Doctor", value: selectedOperation.doctor },
                                { label: "Assistant Consultant 1", value: selectedOperation.assistant1 },
                                { label: "Assistant Consultant 2", value: selectedOperation.assistant2 },
                                { label: "Anesthetist", value: selectedOperation.anesthetist },
                                { label: "Anaesthesia Type", value: selectedOperation.anesthesiaType },
                                { label: "OT Technician", value: selectedOperation.technician },
                                { label: "OT Assistant", value: selectedOperation.otAssistant },
                                { label: "Remark", value: selectedOperation.remark },
                                { label: "Result", value: selectedOperation.result },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-2 text-sm">
                                    <span className="font-bold text-gray-700 whitespace-nowrap">{item.label} :</span>
                                    <span className="text-gray-600">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
