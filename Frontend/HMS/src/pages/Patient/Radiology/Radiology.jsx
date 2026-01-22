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

export default function Radiology() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showPaymentsModal, setShowPaymentsModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);

    // Mock Data matching the Radiology screenshot
    const [bills] = useState([
        {
            billNo: "RADIOB557",
            caseId: "115",
            reportingDate: "01/25/2026",
            reportingTime: "02:00 PM",
            doctor: "Sonia Bush (9002)",
            note: "",
            previousReportValue: "",
            amount: 330.00,
            discount: "33.00 (10.00%)",
            tax: "59.40 (20.00%)",
            netAmount: 356.40,
            paidAmount: 250.00,
            balanceAmount: 106.40,
        },
        {
            billNo: "RADIOB552",
            caseId: "7577",
            reportingDate: "01/01/2026",
            reportingTime: "03:47 PM",
            doctor: "Reyan Jain (9011)",
            note: "",
            previousReportValue: "",
            amount: 330.00,
            discount: "33.00 (10.00%)",
            tax: "59.40 (20.00%)",
            netAmount: 356.40,
            paidAmount: 250.00,
            balanceAmount: 106.40,
        },
        {
            billNo: "RADIOB544",
            caseId: "7519",
            reportingDate: "12/01/2025",
            reportingTime: "04:07 PM",
            doctor: "Reyan Jain (9011)",
            note: "NA",
            previousReportValue: "",
            amount: 165.00,
            discount: "8.25 (5.00%)",
            tax: "31.35 (20.00%)",
            netAmount: 188.10,
            paidAmount: 188.10,
            balanceAmount: 0.00,
        },
        {
            billNo: "RADIOB542",
            caseId: "115",
            reportingDate: "11/30/2025",
            reportingTime: "04:22 PM",
            doctor: "Reyan Jain (9011)",
            note: "",
            previousReportValue: "",
            amount: 330.00,
            discount: "33.00 (10.00%)",
            tax: "59.40 (20.00%)",
            netAmount: 356.40,
            paidAmount: 254.00,
            balanceAmount: 102.40,
        },
        {
            billNo: "RADIOB536",
            caseId: "115",
            reportingDate: "11/01/2025",
            reportingTime: "04:14 PM",
            doctor: "Amit Singh (9009)",
            note: "",
            previousReportValue: "",
            amount: 170.00,
            discount: "17.00 (10.00%)",
            tax: "30.60 (20.00%)",
            netAmount: 183.60,
            paidAmount: 100.00,
            balanceAmount: 83.60,
        },
    ]);

    // Mock Details Data
    const billDetails = {
        patientName: "Olivier Thomas (1)",
        age: "41 Year 4 Month 30 Days",
        gender: "Male",
        mobile: "7896451230",
        email: "olivier@gmail.com",
        address: "482 Kingsway, Brooklyn West, CA",
        tpa: "",
        tpaId: "",
        tpaValidity: "",
        generatedBy: "John Hook (9006)",
        prescriptionNo: "IPDP415",

        tests: [
            {
                name: "Resting 12-lead EKG (RLE)",
                sampleCollected: "John Hook (9006) Radiology : In-House Radiology Lab 01/25/2026",
                expectedDate: "01/27/2026",
                approvedBy: "John Hook (9006) 01/28/2026",
                tax: "$29.70 (20.00%)",
                netAmount: 178.20,
            },
            {
                name: "Magnetic resonance imaging (MR)",
                sampleCollected: "John Hook (9006) Radiology : In-House Radiology Lab 01/25/2026",
                expectedDate: "01/27/2026",
                approvedBy: "John Hook (9006) 01/28/2026",
                tax: "$29.70 (20.00%)",
                netAmount: 178.20,
            },
        ],
        total: 330.00,
        totalDiscount: "$33.00 (10.00%)",
        totalTax: "$59.40 (20.00%)",
        netAmount: 356.40,
        totalDeposit: 250.00,
        balanceAmount: 106.40,
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

    // Mock Payment History Data
    const paymentHistory = [
        { date: "01/25/2026 02:00 PM", note: "Transfer to Bank Account", mode: "Transfer to Bank Account", type: "Payment", amount: 250.00, action: "" },
    ];

    return (
        <PatientLayout>
            <div className="min-h-screen transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="p-5 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            Radiology Test Reports
                        </h2>

                        <div className="flex gap-2">
                            <button
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-200"
                                title="Print"
                            >
                                <Printer size={18} />
                            </button>
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
                                    <th className="p-3 whitespace-nowrap">Case ID</th>
                                    <th className="p-3 whitespace-nowrap">Reporting Date</th>
                                    <th className="p-3 whitespace-nowrap">Reference Doctor</th>
                                    <th className="p-3 whitespace-nowrap">Note</th>
                                    <th className="p-3 whitespace-nowrap">Previous Report Value</th>
                                    <th className="p-3 whitespace-nowrap text-right">Amount ($)</th>
                                    <th className="p-3 whitespace-nowrap text-right">Discount ($)</th>
                                    <th className="p-3 whitespace-nowrap text-right">Tax ($)</th>
                                    <th className="p-3 whitespace-nowrap text-right">Net Amount ($)</th>
                                    <th className="p-3 whitespace-nowrap text-right">Paid Amount ($)</th>
                                    <th className="p-3 whitespace-nowrap text-right">Balance Amount ($)</th>
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
                                            {bill.caseId}
                                        </td>
                                        <td className="p-3 text-gray-600 whitespace-nowrap">
                                            <div>{bill.reportingDate}</div>
                                            <div className="text-xs text-gray-400">{bill.reportingTime}</div>
                                        </td>
                                        <td className="p-3 text-gray-600 whitespace-nowrap">
                                            {bill.doctor}
                                        </td>
                                        <td className="p-3 text-gray-600 whitespace-nowrap">
                                            {bill.note || ""}
                                        </td>
                                        <td className="p-3 text-gray-600 whitespace-nowrap">
                                            {bill.previousReportValue || ""}
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
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <div className="flex gap-1 justify-end w-full">
                                                    <button
                                                        onClick={() => handleShowDetails(bill)}
                                                        className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors border border-gray-200"
                                                        title="Show Details"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleShowPayments(bill)}
                                                        className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors border border-gray-200"
                                                        title="View Payments"
                                                    >
                                                        <AlignJustify size={14} />
                                                    </button>
                                                    <button
                                                        className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors border border-gray-200"
                                                        title="Print"
                                                    >
                                                        <Printer size={14} />
                                                    </button>
                                                </div>

                                                {bill.balanceAmount > 0 && (
                                                    <button
                                                        onClick={() => handlePay(bill)}
                                                        className="flex items-center justify-center w-full gap-1 px-2 py-1 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded text-[10px] font-semibold shadow-sm hover:from-blue-600 hover:bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:shadow transition-all"
                                                        title="Pay"
                                                    >
                                                        <CreditCard size={12} />
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
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] p-4 flex justify-between items-center text-white">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                Bill Details
                            </h3>
                            <div className="flex items-center gap-3">
                                <button className="text-white/80 hover:text-white transition-colors" title="Menu">
                                    <div className="scale-150">≡</div>
                                </button>
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

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4 mb-8 text-sm text-gray-700">
                                {/* Row 1 */}
                                <div className="font-semibold">Bill No</div>
                                <div>{selectedBill.billNo}</div>
                                <div className="font-semibold">Case ID</div>
                                <div>{selectedBill.caseId}</div>
                                <div className="font-semibold">Patient Name</div>
                                <div>{billDetails.patientName}</div>
                                <div className="font-semibold">Total</div>
                                <div className="text-right">${billDetails.total.toFixed(2)}</div>

                                {/* Row 2 */}
                                <div className="font-semibold">Prescription No</div>
                                <div>{billDetails.prescriptionNo}</div>
                                <div className="font-semibold">Age</div>
                                <div>{billDetails.age}</div>
                                <div className="font-semibold">Gender</div>
                                <div>{billDetails.gender}</div>
                                <div className="font-semibold">Discount</div>
                                <div className="text-right">{billDetails.totalDiscount}</div>

                                {/* Row 3 */}
                                <div className="font-semibold">Doctor Name</div>
                                <div>{selectedBill.doctor}</div>
                                <div className="font-semibold">Mobile No</div>
                                <div>{billDetails.mobile}</div>
                                <div className="font-semibold">Email</div>
                                <div>{billDetails.email}</div>
                                <div className="font-semibold">Tax</div>
                                <div className="text-right">{billDetails.totalTax}</div>

                                {/* Row 4 */}
                                <div className="font-semibold">Blood Group</div>
                                <div>B+</div>
                                <div className="font-semibold">Address</div>
                                <div className="col-span-2 md:col-span-1">{billDetails.address}</div>
                                <div className="font-semibold">Net Amount</div>
                                <div className="text-right">${billDetails.netAmount.toFixed(2)}</div>

                                {/* Row 5 */}
                                <div className="font-semibold">TPA</div>
                                <div>{billDetails.tpa}</div>
                                <div className="font-semibold">TPA ID</div>
                                <div>{billDetails.tpaId}</div>
                                <div className="font-semibold">TPA Validity</div>
                                <div>{billDetails.tpaValidity}</div>
                                <div className="font-semibold">Total Deposit</div>
                                <div className="text-right">${billDetails.totalDeposit.toFixed(2)}</div>

                                {/* Row 6 */}
                                <div className="font-semibold">Generated By</div>
                                <div>{billDetails.generatedBy}</div>
                                <div className="col-span-4 md:col-span-1"></div>
                                <div className="font-semibold">Due Amount</div>
                                <div className="text-right">${billDetails.balanceAmount.toFixed(2)}</div>

                                {/* Row 7 */}
                                <div className="font-semibold">Note</div>
                                <div className="col-span-7"></div>

                                {/* Row 8 */}
                                <div className="font-semibold">Previous Report Value</div>
                                <div className="col-span-7"></div>

                            </div>

                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm text-left border-t border-b">
                                    <thead className="text-gray-700 font-bold border-b">
                                        <tr>
                                            <th className="p-3">#</th>
                                            <th className="p-3">Test Name</th>
                                            <th className="p-3">Sample Collected</th>
                                            <th className="p-3">Expected Date</th>
                                            <th className="p-3">Approved By / Update Date</th>
                                            <th className="p-3 text-right">Tax (%)</th>
                                            <th className="p-3 text-right">Net Amount</th>
                                            <th className="p-3 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {billDetails.tests.map((test, i) => (
                                            <tr key={i}>
                                                <td className="p-3">{i + 1}</td>
                                                <td className="p-3 font-semibold text-gray-800">
                                                    <div>{test.name}</div>
                                                </td>
                                                <td className="p-3">
                                                    <div className="max-w-xs">{test.sampleCollected}</div>
                                                </td>
                                                <td className="p-3">{test.expectedDate}</td>
                                                <td className="p-3">
                                                    <div className="max-w-xs">{test.approvedBy}</div>
                                                </td>
                                                <td className="p-3 text-right">{test.tax}</td>
                                                <td className="p-3 text-right">${test.netAmount}</td>
                                                <td className="p-3 text-center">
                                                    <button title="Print" className="text-gray-500 hover:text-gray-700"><Printer size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                                    defaultValue={selectedBill.balanceAmount}
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
