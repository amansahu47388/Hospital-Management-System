import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import OPDTabsNavbar from "../../components/OPDComponent/OPDNavbar";
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    FileText,
    Download,
    Copy,
    FileSpreadsheet,
    FileIcon as FilePdf,
    X,
    Save,
    ChevronDown,
    Printer,
    CheckCircle,
} from "lucide-react";

export default function OPDPayment() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const paymentsData = [
        {
            transactionId: "TRANID11753",
            date: "01/20/2026 08:33 AM",
            note: "",
            paymentMode: "Cash",
            paidAmount: 0.00,
        },
    ];

    const handleOpenEdit = (payment) => {
        setSelectedPayment(payment);
        setShowEditModal(true);
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
                            <h2 className="text-xl font-bold text-gray-800">Payments</h2>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-semibold"
                        >
                            <Plus size={18} />
                            Add Payment
                        </button>
                    </div>


                    {/* Table Actions */}


                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-sm">Transaction ID</th>
                                    <th className="px-6 py-4 text-sm">Date</th>
                                    <th className="px-6 py-4 text-sm">Note</th>
                                    <th className="px-6 py-4 text-sm">Payment Mode</th>
                                    <th className="px-6 py-4 text-sm">Paid Amount ($)</th>
                                    <th className="px-6 py-4 text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white border-b border-gray-200">
                                {paymentsData.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors text-gray-600">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.transactionId}</td>
                                        <td className="px-6 py-4 text-sm ">{row.date}</td>
                                        <td className="px-6 py-4 text-sm ">{row.note || "-"}</td>
                                        <td className="px-6 py-4 text-sm ">{row.paymentMode}</td>
                                        <td className="px-6 py-4 text-sm font-bold">{row.paidAmount.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm ">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(row)}
                                                    className="hover:bg-purple-100 text-purple-500 px-2 py-1 rounded text-xs"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className="hover:bg-red-100 text-red-500 px-2 py-1 rounded text-xs"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-50 font-bold">
                                    <td colSpan="4" className="px-6 py-4 text-right text-sm">Total :</td>
                                    <td className="px-6 py-4 text-sm">$0.00</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 text-xs text-gray-500">
                        Records: {paymentsData.length} to {paymentsData.length} of {paymentsData.length}
                    </div>
                </div>
            </div>

            {/* Add/Edit Payment Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                {showAddModal ? "Add Payment" : "Edit Payment"}
                            </h3>
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

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-gray-700">Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                        defaultValue={showEditModal ? selectedPayment.date : "01/20/2026 09:49 AM"}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-gray-700">Amount ($) <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                        defaultValue={showEditModal ? selectedPayment.paidAmount.toFixed(2) : "0.00"}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Payment Mode</label>
                                <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold">
                                    <option>Cash</option>
                                    <option>Cheque</option>
                                    <option>Transfer to Bank Account</option>
                                    <option>UPI</option>
                                    <option>Online</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Note</label>
                                <textarea
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm min-h-[100px]"
                                    placeholder=""
                                    defaultValue={showEditModal ? selectedPayment.note : ""}
                                ></textarea>
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
        </AdminLayout>
    );
}
