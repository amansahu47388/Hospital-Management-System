import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import OPDTabsNavbar from "../../components/OPDComponent/OPDTabsNavbar";
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

export default function OPDPaymentPage() {
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
                <div className="mx-4 md:mx-6">
                    <OPDTabsNavbar />
                </div>

                <div className="mx-4 md:mx-6 bg-white rounded-b-lg shadow-xl overflow-hidden min-h-[500px]">
                    {/* Page Header */}
                    <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
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
                                        "Transaction ID",
                                        "Date",
                                        "Note",
                                        "Payment Mode",
                                        "Paid Amount ($)",
                                        "Action",
                                    ].map((head) => (
                                        <th key={head} className="px-6 py-4 text-sm font-bold uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                {head}
                                                <ChevronDown size={14} />
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paymentsData.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{row.transactionId}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.note || "-"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{row.paymentMode}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-bold">{row.paidAmount.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div className="flex gap-2">
                                                <button className="p-1.5 hover:bg-gray-100 rounded text-gray-500" title="Print">
                                                    <Printer size={16} />
                                                </button>
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
                                <tr className="bg-gray-50 font-bold">
                                    <td colSpan="4" className="px-6 py-4 text-right text-sm">Total :</td>
                                    <td className="px-6 py-4 text-sm">$0.00</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 text-sm text-gray-500">
                        Records: 1 to 1 of 1
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
                                <X size={28} />
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
                                className="bg-[#4fb8ea] hover:bg-[#3daadd] text-white px-8 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md font-bold text-sm"
                            >
                                <CheckCircle size={18} />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
