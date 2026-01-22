import React, { useState } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import {
    Search,
    Printer,
    FileText,
    Eye,
    CreditCard,
    X,
    FileSpreadsheet,
    AlignJustify,
} from "lucide-react";

export default function Ambulance() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showPaymentsModal, setShowPaymentsModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    // Mock Data matching the Ambulance screenshot
    const [bills] = useState([
        {
            billNo: "ACB502",
            vehicleNo: "MP20SC1797",
            vehicleModel: "BS4",
            driverName: "Ravi",
            driverContact: "7865412358",
            amount: 150.00,
            discount: "0.00 (0.00%)",
            tax: "22.50 (15.00%)",
            netAmount: 172.50,
            paidAmount: 172.50,
            balanceAmount: 0.00,
            date: "01/30/2026 10:05 PM",
            caseId: "115",
            patientName: "Olivier Thomas (1)",
            chargeCategory: "Private Ambulance",
            chargeName: "Private",
            collectedBy: "Super Admin (9001)",
        },
        {
            billNo: "ACB496",
            vehicleNo: "MP20DDHK2562",
            vehicleModel: "BS4FGD",
            driverName: "David Wood",
            driverContact: "9806545404",
            amount: 150.00,
            discount: "0.00 (0.00%)",
            tax: "22.50 (15.00%)",
            netAmount: 172.50,
            paidAmount: 172.50,
            balanceAmount: 0.00,
            date: "01/25/2026 02:30 PM",
            caseId: "7577",
            patientName: "Olivier Thomas (1)",
            chargeCategory: "Private Ambulance",
            chargeName: "Private",
            collectedBy: "David Wood (9008)",
        },
        {
            billNo: "ACB488",
            vehicleNo: "MP20DFG56",
            vehicleModel: "BS440",
            driverName: "David Wood",
            driverContact: "7446165065",
            amount: 150.00,
            discount: "0.00 (0.00%)",
            tax: "22.50 (15.00%)",
            netAmount: 172.50,
            paidAmount: 172.50,
            balanceAmount: 0.00,
            date: "01/20/2026 11:15 AM",
            caseId: "7519",
            patientName: "Olivier Thomas (1)",
            chargeCategory: "Private Ambulance",
            chargeName: "Private",
            collectedBy: "David Wood (9008)",
        },
        {
            billNo: "ACB480",
            vehicleNo: "MP20DDHK2562",
            vehicleModel: "BS4FGD",
            driverName: "David Wood",
            driverContact: "9806545404",
            amount: 150.00,
            discount: "15.00 (10.00%)",
            tax: "20.25 (15.00%)",
            netAmount: 155.25,
            paidAmount: 155.25,
            balanceAmount: 0.00,
            date: "01/15/2026 09:00 AM",
            caseId: "7519",
            patientName: "Olivier Thomas (1)",
            chargeCategory: "Private Ambulance",
            chargeName: "Private",
            collectedBy: "David Wood (9008)",
        },
        {
            billNo: "ACB478",
            vehicleNo: "MP20SC1797",
            vehicleModel: "BS4",
            driverName: "Ravi",
            driverContact: "7865412358",
            amount: 150.00,
            discount: "0.00 (0.00%)",
            tax: "22.50 (15.00%)",
            netAmount: 172.50,
            paidAmount: 172.50,
            balanceAmount: 0.00,
            date: "01/10/2026 05:45 PM",
            caseId: "115",
            patientName: "Olivier Thomas (1)",
            chargeCategory: "Private Ambulance",
            chargeName: "Private",
            collectedBy: "Ravi (9010)",
        },
        {
            billNo: "ACB472",
            vehicleNo: "MP20PL3265",
            vehicleModel: "MKL265",
            driverName: "Ankit",
            driverContact: "968854556",
            amount: 150.00,
            discount: "0.00 (0.00%)",
            tax: "22.50 (15.00%)",
            netAmount: 172.50,
            paidAmount: 172.50,
            balanceAmount: 0.00,
            date: "01/05/2026 01:20 PM",
            caseId: "115",
            patientName: "Olivier Thomas (1)",
            chargeCategory: "Private Ambulance",
            chargeName: "Private",
            collectedBy: "Ankit (9012)",
        },
        {
            billNo: "ACB465",
            vehicleNo: "MP20DDHK2562",
            vehicleModel: "BS4FGD",
            driverName: "David Wood",
            driverContact: "9806545404",
            amount: 150.00,
            discount: "0.00 (0.00%)",
            tax: "22.50 (15.00%)",
            netAmount: 172.50,
            paidAmount: 172.50,
            balanceAmount: 0.00,
            date: "01/01/2026 08:00 AM",
            caseId: "115",
            patientName: "Olivier Thomas (1)",
            chargeCategory: "Private Ambulance",
            chargeName: "Private",
            collectedBy: "David Wood (9008)",
        },
        {
            billNo: "ACB459",
            vehicleNo: "MP20DDHK2562",
            vehicleModel: "BS4FGD",
            driverName: "David Wood",
            driverContact: "9806545404",
            amount: 150.00,
            discount: "0.00 (0.00%)",
            tax: "22.50 (15.00%)",
            netAmount: 172.50,
            paidAmount: 172.50,
            balanceAmount: 0.00,
            date: "12/28/2025 04:10 PM",
            caseId: "115",
            patientName: "Olivier Thomas (1)",
            chargeCategory: "Private Ambulance",
            chargeName: "Private",
            collectedBy: "David Wood (9008)",
        },
        {
            billNo: "ACB458",
            vehicleNo: "MP20QW2343",
            vehicleModel: "HJG1650",
            driverName: "Oliver",
            driverContact: "984865101",
            amount: 150.00,
            discount: "15.00 (10.00%)",
            tax: "20.25 (15.00%)",
            netAmount: 155.25,
            paidAmount: 155.25,
            balanceAmount: 0.00,
            date: "12/25/2025 10:00 AM",
            caseId: "115",
            patientName: "Olivier Thomas (1)",
            chargeCategory: "Private Ambulance",
            chargeName: "Private",
            collectedBy: "Oliver (9015)",
        },
    ]);

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

    // Mock Payment History Data
    const paymentHistory = [
        { date: "01/30/2026 10:05 PM", note: "", mode: "Cash", type: "Payment", amount: 172.50, action: "" },
    ];

    return (
        <PatientLayout>
            <div className="min-h-screen transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="p-5 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            Ambulance Bill
                        </h2>

                        <div className="flex gap-2">
                            <button
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200"
                                title="Export Excel"
                            >
                                <FileSpreadsheet size={18} />
                            </button>
                            <button
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200"
                                title="Export PDF"
                            >
                                <FileText size={18} />
                            </button>
                            <button
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200"
                                title="Export PDF"
                            >
                                <FileText size={18} />
                            </button>
                            <button
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200"
                                title="Print"
                            >
                                <Printer size={18} />
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
                                    <th className="p-3 whitespace-nowrap">Bill No</th>
                                    <th className="p-3 whitespace-nowrap">Vehicle Number</th>
                                    <th className="p-3 whitespace-nowrap">Vehicle Model</th>
                                    <th className="p-3 whitespace-nowrap">Driver Name</th>
                                    <th className="p-3 whitespace-nowrap">Driver Contact</th>
                                    <th className="p-3 whitespace-nowrap text-right">Amount ($)</th>
                                    <th className="p-3 whitespace-nowrap text-right">Discount ($)</th>
                                    <th className="p-3 whitespace-nowrap text-right">Tax(%)</th>
                                    <th className="p-3 whitespace-nowrap text-right">Net Amount ($)</th>
                                    <th className="p-3 whitespace-nowrap text-right">Paid ($)</th>
                                    <th className="p-3 whitespace-nowrap text-right">Balance ($)</th>
                                    <th className="p-3 whitespace-nowrap text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bills.map((bill, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-indigo-50/30 transition-colors group"
                                    >
                                        <td className="p-3 font-medium text-indigo-600 whitespace-nowrap">
                                            {bill.billNo}
                                        </td>
                                        <td className="p-3 text-gray-600 whitespace-nowrap">
                                            {bill.vehicleNo}
                                        </td>
                                        <td className="p-3 text-gray-600 whitespace-nowrap">
                                            {bill.vehicleModel}
                                        </td>
                                        <td className="p-3 text-gray-600 whitespace-nowrap">
                                            {bill.driverName}
                                        </td>
                                        <td className="p-3 text-gray-600 whitespace-nowrap">
                                            {bill.driverContact}
                                        </td>
                                        <td className="p-3 text-gray-600 text-right whitespace-nowrap">
                                            {bill.amount.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-gray-600 text-right whitespace-nowrap">
                                            {bill.discount}
                                        </td>
                                        <td className="p-3 text-gray-600 text-right whitespace-nowrap">
                                            {bill.tax}
                                        </td>
                                        <td className="p-3 text-gray-600 text-right font-medium whitespace-nowrap">
                                            {bill.netAmount.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-gray-600 text-right whitespace-nowrap">
                                            {bill.paidAmount.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-right font-bold text-gray-800 whitespace-nowrap">
                                            {bill.balanceAmount.toFixed(2)}
                                        </td>
                                        <td className="p-3 text-center whitespace-nowrap">
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
                                                <button
                                                    onClick={() => handlePay(bill)}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded text-xs font-semibold shadow-sm hover:opacity-90 transition-all"
                                                    title="Pay"
                                                >
                                                    <CreditCard size={14} />
                                                    Pay
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

            {/* Bill Details Modal */}
            {showDetailsModal && selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-[#0BB7AF] p-4 flex justify-between items-center text-white">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                Bill Details
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

                        {/* Header override with gradient requested by user */}
                        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] p-4 flex justify-between items-center text-white -mt-[64px] relative z-10">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                Bill Details
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
                        <div className="flex-1 overflow-y-auto p-6 bg-white">
                            <div className="text-center mb-6">
                                <div className="flex justify-center items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-yellow-400 flex items-center justify-center rounded text-red-600 font-bold text-xl">+</div>
                                    <h2 className="text-2xl font-bold text-gray-800">Smart Hospital & Research Center</h2>
                                </div>
                                <div className="text-sm font-bold bg-[#333] text-white py-1 uppercase max-w-sm mx-auto rounded-sm mt-2">Ambulance</div>
                            </div>

                            <div className="flex justify-between items-center mb-6 text-sm whitespace-nowrap">
                                <div>
                                    <span className="font-semibold text-gray-600">Bill: {selectedBill.billNo}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-600">Date {selectedBill.date}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 mb-6 text-sm">
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Patient Name</span>
                                    <span className="font-medium text-gray-800">{selectedBill.patientName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Driver Name</span>
                                    <span className="font-medium text-gray-800">{selectedBill.driverName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Vehicle Number</span>
                                    <span className="font-medium text-gray-800">{selectedBill.vehicleNo}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Vehicle Model</span>
                                    <span className="font-medium text-gray-800">{selectedBill.vehicleModel}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Case ID</span>
                                    <span className="font-medium text-gray-800">{selectedBill.caseId}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Charge Category</span>
                                    <span className="font-medium text-gray-800">{selectedBill.chargeCategory}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Charge Name</span>
                                    <span className="font-medium text-gray-800">{selectedBill.chargeName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Collected By</span>
                                    <span className="font-medium text-gray-800">{selectedBill.collectedBy}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-2 text-sm text-gray-800 pr-4 mt-8">
                                <div className="flex justify-between w-64">
                                    <span>Amount ($)</span>
                                    <span className="font-semibold text-right">{selectedBill.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Discount ($)</span>
                                    <span className="text-right">0.00 (0.00%)</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Tax ($)</span>
                                    <span className="text-right">{selectedBill.tax.split(" ")[0]} ({selectedBill.tax.split(" ")[1].replace(/[()]/g, '')})</span>
                                </div>
                                <div className="flex justify-between w-64 font-bold text-base border-t pt-2 mt-1">
                                    <span>Net Amount ($)</span>
                                    <span className="text-right">{selectedBill.netAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Paid Amount ($)</span>
                                    <span className="text-right">{selectedBill.paidAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64 font-bold text-base border-t pt-2 mt-1">
                                    <span>Due Amount ($)</span>
                                    <span className="text-right">{selectedBill.balanceAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t text-sm text-gray-600">
                                This invoice is printed electronically, so no signature is required
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payments Modal */}
            {showPaymentsModal && selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all scale-100">
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
                                <thead className="bg-[#f8f9fa] text-gray-700 font-bold border-b">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Note</th>
                                        <th className="p-4">Payment Mode</th>
                                        <th className="p-4">Payment Type</th>
                                        <th className="p-4 text-right">Paid Amount ($)</th>
                                        <th className="p-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr className="bg-[#f0f0f0]">
                                        <td className="p-4">{paymentHistory[0].date}</td>
                                        <td className="p-4">{paymentHistory[0].note}</td>
                                        <td className="p-4">{paymentHistory[0].mode}</td>
                                        <td className="p-4">{paymentHistory[0].type}</td>
                                        <td className="p-4 text-right">{paymentHistory[0].amount.toFixed(2)}</td>
                                        <td className="p-4 text-center">
                                            <button className="text-gray-500 hover:text-indigo-600" title="Print">
                                                <Printer size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                    <tr className="bg-[#e9ecef] font-bold">
                                        <td className="p-4 text-right" colSpan={4}>Total</td>
                                        <td className="p-4 text-right">${paymentHistory[0].amount.toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Make Payment Modal */}
            {showPaymentModal && selectedBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded shadow-2xl w-full max-w-xl overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] p-4 flex justify-between items-center text-white">
                            <h3 className="text-lg font-bold">Make Payment</h3>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-white/80 hover:text-white transition-colors"
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div className="mb-6 flex items-center">
                                <label className="block text-sm font-medium text-gray-700 w-40">
                                    Payment Amount ($) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    defaultValue="0.00"
                                    className="flex-1 p-2 border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-4 py-1.5 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded shadow-md hover:opacity-90 transition-all font-medium text-sm flex items-center gap-1"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PatientLayout>
    );
}
