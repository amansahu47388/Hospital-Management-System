import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import OPDTabsNavbar from "../../components/OPDComponent/OPDNavbar";
import {
    Search, Plus, Edit2, Trash2, FileText, Download, Copy, FileSpreadsheet, FileIcon as FilePdf, X,
    Save, ChevronDown, Printer, CheckCircle,
} from "lucide-react";

export default function OPDCharges() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCharge, setSelectedCharge] = useState(null);

    const chargesData = [
        {
            date: "01/20/2026 08:33 AM",
            chargeName: "Appointment Fees",
            chargeNote: "",
            chargeType: "Appointment",
            chargeCategory: "Appointment Charges",
            qty: 1,
            standardCharge: 147.60,
            appliedCharge: 147.60,
            tpaCharge: 0.00,
            discount: "0.00 (0.00%)",
            tax: "29.52 (20.00%)",
            amount: 0.00,
        },
    ];

    const handleOpenEdit = (charge) => {
        setSelectedCharge(charge);
        setShowEditModal(true);
    };

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50">
              
                    <OPDTabsNavbar />
            

                {/* <div className="mx-4 md:mx-6 bg-white rounded-b-lg shadow-xl overflow-hidden min-h-[500px]"> */}
                    {/* Page Header */}
                  
                    <div className="p-4 md:p-6 ">
                         <div className="bg-white rounded shadow p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="">
                            <h2 className="text-xl font-bold text-gray-800">Charges</h2>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-semibold"
                        >
                            <Plus size={18} />
                            Add Charges
                        </button>
                        </div>
                   

                    {/* Table Actions */}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm">Date</th>
                                    <th className="px-4 py-3 text-left text-sm">Charge Name</th>
                                    <th className="px-4 py-3 text-left text-sm">Charge Type</th>
                                    <th className="px-4 py-3 text-left text-sm">Charge Category</th>
                                    <th className="px-4 py-3 text-left text-sm">Standard Charge($)</th>
                                    <th className="px-4 py-3 text-left text-sm">Discount</th>
                                    <th className="px-4 py-3 text-left text-sm">Tax</th>
                                    <th className="px-4 py-3 text-left text-sm">Net Amount ($)</th>
                                    <th className="px-4 py-3 text-left text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white border-b border-gray-200">
                                {chargesData.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors text-gray-600">
                                        <td className="px-4 py-4 text-sm ">{row.date}</td>
                                        <td className="px-4 py-4 text-sm ">{row.chargeName}</td>
                                        <td className="px-4 py-4 text-sm ">{row.chargeType}</td>
                                        <td className="px-4 py-4 text-sm ">{row.chargeCategory}</td>
                                        <td className="px-4 py-4 text-sm ">{row.standardCharge.toFixed(2)}</td>
                                        <td className="px-4 py-4 text-sm ">{row.discount}</td>
                                        <td className="px-4 py-4 text-sm ">{row.tax}</td>
                                        <td className="px-4 py-4 text-sm font-bold">{row.amount.toFixed(2)}</td>
                                        <td className="px-4 py-4 text-sm ">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(row)}
                                                    className="hover:bg-purple-100 text-purple-500 px-2 py-1 rounded text-xs"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button className="hover:bg-red-100 text-red-500 px-2 py-1 rounded text-xs"
                                                    title="Delete"
                                                    onClick={() => handleDelete(row.id)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50 font-bold py-4">
                                    <td colSpan="7" className="px-4 py-3 text-right text-xs">Total :</td>
                                    <td className="px-4 py-3 text-xs">$0.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 text-xs text-gray-500">
                        Records: 1 to 1 of 1
                    </div>
                </div>
            </div>

            {/* Add/Edit Charge Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-8 overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white text-lg font-bold flex items-center gap-2">
                                {showAddModal ? "Add Charges" : "Edit Charge"}
                            </h3>
                            <div className="flex items-center gap-4">

                                <button
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                    }}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Charge Type <span className="text-red-500">*</span></label>
                                    <select className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-purple-500 outline-none">
                                        <option>Select</option>
                                        <option selected={showEditModal}>Appointment</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Charge Category <span className="text-red-500">*</span></label>
                                    <select className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-purple-500 outline-none">
                                        <option>Select</option>
                                        <option selected={showEditModal}>Appointment Charges</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1 lg:col-span-1">
                                    <label className="text-[11px] font-bold text-gray-700">Charge Name <span className="text-red-500">*</span></label>
                                    <select className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-purple-500 outline-none">
                                        <option>Select</option>
                                        <option selected={showEditModal}>Appointment Fees</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[11px] font-bold text-gray-700">Standard Charge ($)</label>
                                    <input type="text" className="w-full p-2 bg-gray-50 border border-gray-300 rounded text-xs outline-none" defaultValue={showEditModal ? "123.00" : "0"} readOnly />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-bold text-gray-700">Date <span className="text-red-500">*</span></label>
                                        <input type="text" className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-purple-500 outline-none" defaultValue={showEditModal ? "01/20/2026 08:33 AM" : "01/20/2026 09:49 AM"} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[11px] font-bold text-gray-700">Charge Note</label>
                                        <textarea className="w-full p-2 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-purple-500 outline-none min-h-[100px]" placeholder=""></textarea>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-gray-600">Total ($)</span>
                                        <span className="font-bold">123.00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs gap-4">
                                        <span className="font-bold text-gray-600">Discount Percentage ($)</span>
                                        <div className="flex items-center gap-2 flex-1 justify-end">
                                            <div className="relative w-20">
                                                <input type="text" className="w-full p-1.5 border border-gray-300 rounded text-[10px] text-right pr-6" defaultValue="0.00" />
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">%</span>
                                            </div>
                                            <input type="text" className="w-24 p-1.5 border border-gray-300 rounded text-[10px] text-right" defaultValue="0" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs gap-4">
                                        <span className="font-bold text-gray-600">Tax ($)</span>
                                        <div className="flex items-center gap-2 flex-1 justify-end">
                                            <div className="relative w-20">
                                                <input type="text" className="w-full p-1.5 border border-gray-300 rounded text-[10px] text-right pr-10" defaultValue="20.00" />
                                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">Tax %</span>
                                            </div>
                                            <input type="text" className="w-24 p-1.5 border border-gray-300 rounded text-[10px] text-right" defaultValue="24.60" />
                                        </div>
                                    </div>
                                    <div className="pt-3 border-t border-gray-200 mt-3 flex justify-between items-center">
                                        <span className="font-bold text-gray-800">Net Amount ($)</span>
                                        <span className="font-bold text-lg text-[#6046B5]">147.60</span>
                                    </div>
                                    {showAddModal && (
                                        <div className="pt-4 flex justify-end">
                                            <button className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2]  text-white px-4 py-1.5 rounded flex items-center gap-1 text-[11px] font-bold shadow-sm">
                                                <CheckCircle size={14} /> Add
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {showAddModal && (
                                <div className="mt-8 border-t border-gray-100 pt-6 overflow-x-auto">
                                    <table className="w-full text-left text-[10px]">
                                        <thead className="text-gray-500 font-bold uppercase border-b border-gray-100">
                                            <tr>
                                                <th className="pb-2">Date</th>
                                                <th className="pb-2">Charge Type</th>
                                                <th className="pb-2">Charge Category</th>
                                                <th className="pb-2">Charge Name / Note</th>
                                                <th className="pb-2">Std Charge ($)</th>
                                                <th className="pb-2">Qty</th>
                                                <th className="pb-2">Total ($)</th>
                                                <th className="pb-2">Discount ($)</th>
                                                <th className="pb-2">Tax ($)</th>
                                                <th className="pb-2">Net Amount ($)</th>
                                                <th className="pb-2">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="text-gray-400 italic">
                                                <td colSpan="12" className="py-4 text-center">No rows added yet</td>
                                            </tr>
                                        </tbody>
                                    </table>
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
                                className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2]  text-white px-8 py-2 rounded flex items-center gap-2 transition-all shadow-md font-bold text-xs"
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
