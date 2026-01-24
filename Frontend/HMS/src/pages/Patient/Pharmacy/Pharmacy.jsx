import React, { useState } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import {
    Search,
    Printer,
    FileText,
    Eye,
    CreditCard,
    X,
    Download,
    FileSpreadsheet,
    AlignJustify,
} from "lucide-react";

export default function Pharmacy() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showPaymentsModal, setShowPaymentsModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    // Mock Data matching the screenshot
    const [bills] = useState([
        {
            billNo: "PHARMAB539",
            caseId: "115",
            date: "01/30/2026",
            time: "01:30 PM",
            doctor: "Sansa Gomez (9008)",
            note: "",
            discount: "0.00 (0.00%)",
            netAmount: 558.23,
            paidAmount: 420.0,
            refundAmount: 0.0,
            balanceAmount: 138.23,
        },
        {
            billNo: "PHARMAB533",
            caseId: "7577",
            date: "01/01/2026",
            time: "05:25 PM",
            doctor: "Reyan Jain (9011)",
            note: "",
            discount: "47.25 (10.00%)",
            netAmount: 470.81,
            paidAmount: 350.0,
            refundAmount: 0.0,
            balanceAmount: 120.81,
        },
        {
            billNo: "PHARMAB530",
            caseId: "7519",
            date: "12/25/2025",
            time: "01:30 PM",
            doctor: "Amit Singh (9009)",
            note: "",
            discount: "62.10 (12.00%)",
            netAmount: 495.99,
            paidAmount: 320.0,
            refundAmount: 0.0,
            balanceAmount: 175.99,
        },
        {
            billNo: "PHARMAB525",
            caseId: "115",
            date: "12/01/2025",
            time: "05:14 PM",
            doctor: "Sansa Gomez (9008)",
            note: "",
            discount: "18.00 (10.00%)",
            netAmount: 170.1,
            paidAmount: 210.0,
            refundAmount: 39.9,
            balanceAmount: 0.0,
        },
        {
            billNo: "PHARMAB522",
            caseId: "115",
            date: "11/25/2025",
            time: "08:00 PM",
            doctor: "Reyan Jain (9011)",
            note: "",
            discount: "58.50 (10.00%)",
            netAmount: 577.13,
            paidAmount: 410.0,
            refundAmount: 0.0,
            balanceAmount: 167.13,
        },
    ]);

    // Mock Details Data
    const billDetails = {
        medicines: [
            {
                category: "Syrup",
                name: "Alprovit",
                batchNo: "5673",
                unit: "mm",
                expiry: "Aug/2026",
                qty: 4,
                tax: "5.00%",
                discount: "10.00%",
                amount: 162.0,
            },
            {
                category: "Capsule",
                name: "WORMSTOP",
                batchNo: "7844",
                unit: "mg",
                expiry: "Oct/2026",
                qty: 5,
                tax: "15.00%",
                discount: "10.00%",
                amount: 337.5,
            },
        ],
        total: 499.5,
        discount: "0.00 (0.00%)",
        tax: "58.73 (11.76%)",
        netAmount: 558.23,
        paidAmount: 420.0,
        refundAmount: 0.0,
        dueAmount: 138.23,
        collectedBy: "Harry Grant (9012)",
    };

    const handleShowDetails = (bill) => {
        setSelectedBill(bill);
        setShowDetailsModal(true);
    };

    const handlePay = (bill) => {
        setSelectedBill(bill);
        setShowPaymentModal(true);
    };

    const handleShowPayments = (bill) => {
        setSelectedBill(bill);
        setShowPaymentsModal(true);
    };

    const paymentHistory = [
        { date: "01/30/2026 01:30 PM", note: "", mode: "Cash", type: "Payment", amount: 420.00, action: "" },
    ];

    return (
        <PatientLayout>
            <div className="min-h-screen   transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="p-5 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            Pharmacy Bill
                        </h2>

                        <div className="flex gap-2">
                            <button
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Print"
                            >
                                <Printer size={18} />
                            </button>
                            <button
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Export Excel"
                            >
                                <FileSpreadsheet size={18} />
                            </button>
                            <button
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Export PDF"
                            >
                                <FileText size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="p-4 border-b border-gray-100 bg-white">
                        <div className="relative max-w-sm">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                                <tr className="border-b border-gray-200">
                                    <th className="p-4 whitespace-nowrap">Bill No</th>
                                    <th className="p-4 whitespace-nowrap">Case ID</th>
                                    <th className="p-4 whitespace-nowrap">Date</th>
                                    <th className="p-4 whitespace-nowrap">Doctor Name</th>
                                    <th className="p-4 whitespace-nowrap">Note</th>
                                    <th className="p-4 whitespace-nowrap text-right">
                                        Discount ($)
                                    </th>
                                    <th className="p-4 whitespace-nowrap text-right">
                                        Net Amount ($)
                                    </th>
                                    <th className="p-4 whitespace-nowrap text-right">
                                        Paid Amount ($)
                                    </th>
                                    <th className="p-4 whitespace-nowrap text-right">
                                        Refund Amount ($)
                                    </th>
                                    <th className="p-4 whitespace-nowrap text-right">
                                        Balance Amount ($)
                                    </th>
                                    <th className="p-4 whitespace-nowrap text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bills.map((bill, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-indigo-50/30 transition-colors group"
                                    >
                                        <td className="p-4 font-medium text-indigo-600 whitespace-nowrap">
                                            {bill.billNo}
                                        </td>
                                        <td className="p-4 text-gray-600 whitespace-nowrap">
                                            {bill.caseId}
                                        </td>
                                        <td className="p-4 text-gray-600 whitespace-nowrap">
                                            <div>{bill.date}</div>
                                            <div className="text-xs text-gray-400">{bill.time}</div>
                                        </td>
                                        <td className="p-4 text-gray-600 whitespace-nowrap">
                                            {bill.doctor}
                                        </td>
                                        <td className="p-4 text-gray-600 whitespace-nowrap">
                                            {bill.note || "-"}
                                        </td>
                                        <td className="p-4 text-gray-600 text-right whitespace-nowrap">
                                            {bill.discount}
                                        </td>
                                        <td className="p-4 text-gray-600 text-right font-medium whitespace-nowrap">
                                            {bill.netAmount.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-gray-600 text-right whitespace-nowrap">
                                            {bill.paidAmount.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-gray-600 text-right whitespace-nowrap">
                                            {bill.refundAmount.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-right font-bold text-gray-800 whitespace-nowrap">
                                            {bill.balanceAmount.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleShowDetails(bill)}
                                                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors border border-gray-200"
                                                    title="Show Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleShowPayments(bill)}
                                                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors border border-gray-200"
                                                    title="View Payments"
                                                >
                                                    <AlignJustify size={16} />
                                                </button>
                                                {bill.balanceAmount > 0 && (
                                                    <button
                                                        onClick={() => handlePay(bill)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded text-xs font-semibold shadow-sm hover:from-blue-600 hover:bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:shadow transition-all"
                                                        title="Pay"
                                                    >
                                                        <CreditCard size={14} />
                                                        Pay
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t text-xs text-gray-500 bg-gray-50">
                        Records: 1 to {bills.length} of {bills.length}
                    </div>
                </div>
            </div>

            {/* Bill Details Modal */}
            {showDetailsModal && selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] p-4 flex justify-between items-center text-white">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                Bill Details - {selectedBill.billNo}
                            </h3>
                            <div className="flex items-center gap-3">
                                <button className="text-white/80 hover:text-white transition-colors" title="Print">
                                    <Printer size={20} />
                                </button>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-white/80 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            <div className="bg-white border text-center p-4 mb-4 shadow-sm">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <span className="text-orange-500 font-bold text-xl uppercase">Smart Hospital & Research Center</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                    Address: 25 Kings Street, CA <br />
                                    Phone No: 89662423934 <br />
                                    Email: smarthospitalrc@gmail.com <br />
                                    Website: www.smart-hospital.in
                                </div>
                                <div className="mt-2 bg-black text-white py-1 font-bold uppercase text-sm">
                                    Pharmacy Bill
                                </div>
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-sm">
                                <div>
                                    <span className="text-gray-500 block">Bill No</span>
                                    <span className="font-semibold text-gray-800">{selectedBill.billNo}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Date</span>
                                    <span className="font-semibold text-gray-800">{selectedBill.date} {selectedBill.time}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Case ID</span>
                                    <span className="font-semibold text-gray-800">{selectedBill.caseId}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Prescription</span>
                                    <span className="font-semibold text-gray-800">IPDP415</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Name</span>
                                    <span className="font-semibold text-gray-800">Olivier Thomas (1)</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Phone</span>
                                    <span className="font-semibold text-gray-800">7896451230</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Doctor</span>
                                    <span className="font-semibold text-gray-800">{selectedBill.doctor}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">TPA</span>
                                    <span className="font-semibold text-gray-800">Health Life Insurance</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm text-left border">
                                    <thead className="bg-gray-100 text-gray-700 font-semibold border-b">
                                        <tr>
                                            <th className="p-3">Medicine Category</th>
                                            <th className="p-3">Medicine Name</th>
                                            <th className="p-3">Batch No</th>
                                            <th className="p-3">Unit</th>
                                            <th className="p-3">Expiry Date</th>
                                            <th className="p-3 text-center">Quantity</th>
                                            <th className="p-3">Tax</th>
                                            <th className="p-3">Discount</th>
                                            <th className="p-3 text-right">Amount ($)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {billDetails.medicines.map((med, i) => (
                                            <tr key={i}>
                                                <td className="p-3">{med.category}</td>
                                                <td className="p-3 font-medium text-gray-800">{med.name}</td>
                                                <td className="p-3">{med.batchNo}</td>
                                                <td className="p-3">{med.unit}</td>
                                                <td className="p-3">{med.expiry}</td>
                                                <td className="p-3 text-center">{med.qty}</td>
                                                <td className="p-3">{med.tax}</td>
                                                <td className="p-3">{med.discount}</td>
                                                <td className="p-3 text-right">{med.amount.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col items-end gap-2 text-sm text-gray-800 pr-4">
                                <div className="flex justify-between w-64">
                                    <span>Total ($)</span>
                                    <span className="font-semibold">{billDetails.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Discount</span>
                                    <span>{billDetails.discount}</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Tax ($)</span>
                                    <span>{billDetails.tax}</span>
                                </div>
                                <div className="flex justify-between w-64 font-bold text-base border-t pt-2 mt-1">
                                    <span>Net Amount ($)</span>
                                    <span>{billDetails.netAmount}</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Paid Amount ($)</span>
                                    <span>{billDetails.paidAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Refund Amount ($)</span>
                                    <span>{billDetails.refundAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64 font-bold text-red-600">
                                    <span>Due Amount ($)</span>
                                    <span>{billDetails.dueAmount}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t text-right text-gray-500 text-xs">
                                Collected By: {billDetails.collectedBy}
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Make Payment Modal */}
            {showPaymentModal && selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] p-4 flex justify-between items-center text-white">
                            <h3 className="text-lg font-bold">Make Payment</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Amount ($) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    defaultValue={selectedBill.balanceAmount}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none transition-all"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                {/* <button
                        onClick={() => setShowPaymentModal(false)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                    >
                        Cancel
                    </button> */}
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-6 py-2 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-lg shadow-md hover:shadow-lg hover:opacity-90 transition-all font-medium"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payments Modal */}
            {showPaymentsModal && selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] p-4 flex justify-between items-center text-white">
                            <h3 className="text-lg font-bold">Payments</h3>
                            <button
                                onClick={() => setShowPaymentsModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-0">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-700 font-bold border-b">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Note</th>
                                        <th className="p-4">Payment Mode</th>
                                        <th className="p-4">Payment Type</th>
                                        <th className="p-4 text-right">Paid Amount ($)</th>
                                        <th className="p-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paymentHistory.map((payment, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="p-4">{payment.date}</td>
                                            <td className="p-4">{payment.note}</td>
                                            <td className="p-4">{payment.mode}</td>
                                            <td className="p-4">{payment.type}</td>
                                            <td className="p-4 text-right">{payment.amount.toFixed(2)}</td>
                                            <td className="p-4 text-right">
                                                <button className="text-gray-500 hover:text-indigo-600" title="Print">
                                                    <Printer size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-100 font-bold">
                                        <td className="p-4 text-right" colSpan={4}>Total</td>
                                        <td className="p-4 text-right">${paymentHistory.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </PatientLayout>
    );
}
