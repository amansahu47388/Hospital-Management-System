import React, { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import BillingNavbar from "./BillingNavbar";
import { Link, useLocation } from "react-router-dom";
import {
  User,
  Printer,
  X,
  IndianRupee,
  FileText,
  Check,
  Hospital
} from "lucide-react";


function BillingDetails() {
    const location = useLocation();
    const [patientData, setPatientData] = useState(null);

    // Modals State
    const [showSummary, setShowSummary] = useState(false);
    const [showAddPayment, setShowAddPayment] = useState(false);
    const [showViewPayments, setShowViewPayments] = useState(false);
    const [showGenerateBill, setShowGenerateBill] = useState(false);

    // Simulate fetching data
    useEffect(() => {
        setPatientData({
            caseId: "7637",
            name: "John Marshall (2)",
            gender: "Male",
            phone: "9856475632",
            opdNo: "OPDN7608",
            appointmentDate: "01/22/2026 10:47 AM",
            guardianName: "Smith Marshall",
            age: "30 Year, 11 Month, 17 Day",
            creditLimit: "$",
        });
    }, []);

    return (
        <AdminLayout>
            <div className="p-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 min-h-screen">
                    <div className="mb-4">
                        <Link to="/admin/billing" className="text-sm text-gray-500 hover:text-[#6046B5]">&larr; Back to Billing Search</Link>
                    </div>

                    {patientData && (
                        <div className="animate-fade-in">
                            {/* Patient Info Card */}
                            <div className="flex flex-col md:flex-row gap-6 mb-6">
                                <div className="flex-shrink-0 flex flex-col items-center">
                                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 mb-3 overflow-hidden shadow-inner">
                                        <User className="text-5xl" />
                                    </div>
                                    <button
                                        onClick={() => setShowSummary(true)}
                                        className="w-full bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-xs py-1.5 px-3 rounded hover:bg-[#0b65c2] transition-colors"
                                    >
                                        Bill Summary
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 flex-grow text-sm">
                                    {/* ... Existing Patient Data Fields ... */}
                                    <div className="flex justify-between border-b border-gray-100 py-1"><span className="font-semibold text-gray-700">Case ID</span> <span className="text-gray-600">{patientData.caseId}</span></div>
                                    <div className="flex justify-between border-b border-gray-100 py-1"><span className="font-semibold text-gray-700">Appointment Date</span> <span className="text-gray-600">{patientData.appointmentDate}</span></div>
                                    <div className="flex justify-between border-b border-gray-100 py-1"><span className="font-semibold text-gray-700">Name</span> <span className="text-gray-600">{patientData.name}</span></div>
                                    <div className="flex justify-between border-b border-gray-100 py-1"><span className="font-semibold text-gray-700">Guardian Name</span> <span className="text-gray-600">{patientData.guardianName}</span></div>
                                    <div className="flex justify-between border-b border-gray-100 py-1"><span className="font-semibold text-gray-700">Gender</span> <span className="text-gray-600">{patientData.gender}</span></div>
                                    <div className="flex justify-between border-b border-gray-100 py-1"><span className="font-semibold text-gray-700">Age</span> <span className="text-gray-600">{patientData.age}</span></div>
                                    <div className="flex justify-between border-b border-gray-100 py-1"><span className="font-semibold text-gray-700">Phone</span> <span className="text-gray-600">{patientData.phone}</span></div>
                                    <div className="flex justify-between border-b border-gray-100 py-1"><span className="font-semibold text-gray-700">Credit Limit ($)</span> <span className="text-gray-600">{patientData.creditLimit}</span></div>
                                    <div className="flex justify-between border-b border-gray-100 py-1"><span className="font-semibold text-gray-700">OPD No</span> <span className="text-gray-600">{patientData.opdNo}</span></div>
                                    <div className="flex justify-between py-1"><span className="font-semibold text-gray-700">Barcode</span> <span className="font-mono text-xs">||| || ||||||</span></div>
                                    <div className="flex justify-between py-1"><span className="font-semibold text-gray-700">QR Code</span> <span className="text-gray-400 text-xs">[QR]</span></div>
                                </div>
                            </div>

                            <BillingNavbar />

                            {/* Action Buttons */}
                            <div className="flex flex-wrap justify-end gap-2 mb-4">
                                <button
                                    onClick={() => setShowAddPayment(true)}
                                    className="flex items-center px-3 py-1.5 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-sm rounded hover:bg-[#0b65c2]"
                                >
                                    <IndianRupee className="mr-1" /> Add Payment
                                </button>
                                <button
                                    onClick={() => setShowViewPayments(true)}
                                    className="flex items-center px-3 py-1.5 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-sm rounded hover:bg-[#0b65c2]"
                                >
                                    <FileText className="mr-1" /> View Payments
                                </button>
                                <button
                                    onClick={() => setShowGenerateBill(true)}
                                    className="flex items-center px-3 py-1.5 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-sm rounded hover:bg-[#0b65c2]"
                                >
                                    <Printer className="mr-1" /> Generate Bill
                                </button>
                            </div>

                            {/* Charges Table - Unchanged */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-sm whitespace-nowrap">
                                    <thead className="text-gray-700 font-semibold border-b border-gray-200">
                                        <tr>
                                            <th className="px-3 py-2">Date</th>
                                            <th className="px-3 py-2">Charge Name / Note</th>
                                            <th className="px-3 py-2">Charge Type</th>
                                            <th className="px-3 py-2">Charge Category</th>
                                            <th className="px-3 py-2">Qty</th>
                                            <th className="px-3 py-2">Standard Charge ($)</th>
                                            <th className="px-3 py-2">Applied Charge ($)</th>
                                            <th className="px-3 py-2">TPA Charge ($)</th>
                                            <th className="px-3 py-2">Discount</th>
                                            <th className="px-3 py-2">Tax</th>
                                            <th className="px-3 py-2">Amount ($)</th>
                                            <th className="px-3 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-3 py-2">01/22/2026 10:47 AM</td>
                                            <td className="px-3 py-2">OPD Service</td>
                                            <td className="px-3 py-2">OPD</td>
                                            <td className="px-3 py-2">OPD Service</td>
                                            <td className="px-3 py-2">1 Per Day</td>
                                            <td className="px-3 py-2">122.00</td>
                                            <td className="px-3 py-2">122.00</td>
                                            <td className="px-3 py-2">0.00</td>
                                            <td className="px-3 py-2">0.00 (0.00%)</td>
                                            <td className="px-3 py-2">24.40 (20.00%)</td>
                                            <td className="px-3 py-2">146.40</td>
                                            <td className="px-3 py-2 text-gray-500 cursor-pointer">
                                                <Printer />
                                            </td>
                                        </tr>
                                        <tr className="bg-gray-100 font-semibold">
                                            <td colSpan="10" className="px-3 py-2 text-right">
                                                Total :
                                            </td>
                                            <td className="px-3 py-2">$146.40</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Bill Summary Modal */}
            {showSummary && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-zoom-in">
                        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded-t-lg">
                            <h3 className="text-lg font-semibold">Bill Summary</h3>
                            <div className="flex items-center gap-3">
                                <Printer className="cursor-pointer hover:opacity-80" />
                                <Times className="cursor-pointer hover:opacity-80 text-xl" onClick={() => setShowSummary(false)} />
                            </div>
                        </div>
                        {/* Same Body as before */}
                        <div className="p-6 text-sm text-gray-700">
                            <div className="flex flex-wrap justify-between border-b border-gray-100 pb-4 mb-4">
                                <p><strong>TPA :</strong> Health Life Insurance</p>
                                <p><strong>TPA Validity :</strong> 11/25/2026</p>
                                <p><strong>TPA ID :</strong> 768565654</p>
                            </div>
                            <h4 className="text-[#6046B5] font-semibold mb-2">OPD Charges</h4>
                            {/* Table... */}
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-left mb-2">
                                    <thead className="border-b"><tr><th className="py-2">Service</th><th className="py-2">Charge</th><th className="py-2">Qty</th><th className="py-2 text-right">Discount</th><th className="py-2 text-right">Tax</th><th className="py-2 text-right">Amount</th></tr></thead>
                                    <tbody><tr><td className="py-2">OPD Service</td><td className="py-2">$122.00</td><td className="py-2">1 per day</td><td className="py-2 text-right">$0.00 (0.00%)</td><td className="py-2 text-right">$24.40 (20.00%)</td><td className="py-2 text-right">$146.40</td></tr></tbody>
                                </table>
                            </div>
                            {/* Transactions... */}
                            <h4 className="text-[#6046B5] font-semibold mb-2">Transactions</h4>
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-left mb-2">
                                    <thead className="border-b"><tr><th className="py-2">Transaction ID</th><th className="py-2">Payment Date</th><th className="py-2">Payment Mode</th><th className="py-2 text-right">Amount</th></tr></thead>
                                    <tbody><tr><td className="py-2">TRANID11754</td><td className="py-2">01/22/2026 10:47 AM</td><td className="py-2">Cash</td><td className="py-2 text-right">$146.40</td></tr></tbody>
                                </table>
                            </div>
                            {/* Amount Summary */}
                            <div className="flex justify-end mt-4"><div className="w-full sm:w-1/2 md:w-1/3"><h4 className="text-gray-800 font-semibold mb-3 text-lg border-b pb-1">Amount Summary</h4><div className="flex justify-between py-1"><span>Grand Total:</span><span className="font-medium">$146.40</span></div><div className="flex justify-between py-1"><span>Amount Paid:</span><span className="font-medium">$146.40</span></div><div className="flex justify-between py-1"><span>Refund Amount:</span><span className="font-medium">$0.00</span></div><div className="flex justify-between py-1 border-t mt-2 pt-2"><span>Balance Amount:</span><span className="font-medium">$0.00</span></div></div></div>
                        </div>
                    </div>
                </div>
            )}

            {/* 1. Add Payment Modal */}
            {showAddPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg animate-zoom-in">
                        <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded-t-lg">
                            <h3 className="font-semibold text-lg">Add Payment</h3>
                            <X className="cursor-pointer hover:opacity-80" onClick={() => setShowAddPayment(false)} />
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Date <span className="text-red-500">*</span></label>
                                    <input type="datetime-local" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6046B5]" />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Amount ($) <span className="text-red-500">*</span></label>
                                    <input type="number" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6046B5]" />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">Payment Mode</label>
                                <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6046B5]">
                                    <option>Cash</option>
                                    <option>Card</option>
                                    <option>Cheque</option>
                                    <option>Online</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-1">Note</label>
                                <textarea className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6046B5]" rows="3"></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button className="flex items-center  bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-[#0b65c2] text-white px-4 py-2 rounded font-medium transition-colors">
                                    <Check className="mr-2" /> Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. View Payments Modal */}
            {showViewPayments && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl animate-zoom-in">
                        <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded-t-lg">
                            <h3 className="font-semibold text-lg">Payments</h3>
                            <X className="cursor-pointer hover:opacity-80" onClick={() => setShowViewPayments(false)} />
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Date</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Note</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Payment Mode</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700 text-right">Paid Amount ($)</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr>
                                            <td className="px-4 py-2">01/05/2026 12:14 PM</td>
                                            <td className="px-4 py-2">Payment deposit through Paystack TXN ID: 176759547402</td>
                                            <td className="px-4 py-2">Online</td>
                                            <td className="px-4 py-2 text-right">147.60</td>
                                            <td className="px-4 py-2 text-right"><Printer className="inline cursor-pointer text-gray-500 hover:text-black" /></td>
                                        </tr>
                                    </tbody>
                                    <tfoot className="bg-gray-50 font-semibold border-t">
                                        <tr>
                                            <td colSpan="3" className="px-4 py-2 text-right">Total</td>
                                            <td className="px-4 py-2 text-right">$147.60</td>
                                            <td><X className="cursor-pointer hover:opacity-80" onClick={() => setShowViewPayments(false)} /></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 3. Generate Bill Modal (Receipt Type) */}
            {showGenerateBill && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-zoom-in">
                        {/* Header with Print/Close */}
                        <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded-t-lg">
                            <h3 className="font-semibold text-lg">Bill</h3>
                            <div className="flex items-center gap-3">
                                <Printer className="cursor-pointer hover:opacity-80" />
                                <X className="cursor-pointer hover:opacity-80" onClick={() => setShowGenerateBill(false)} />
                            </div>
                        </div>

                        {/* Receipt Content */}
                        <div className="p-8 font-sans text-gray-800">
                            {/* Header Info */}
                            <div className="flex flex-col md:flex-row justify-between items-start mb-6 border-b pb-4">
                                <div className="flex items-center mb-4 md:mb-0">
                                    {/* Logo Placeholder */}
                                    <div className="w-10 h-10 bg-red-500 rounded flex items-center justify-center text-white mr-3">
                                        <Hospital size={24} />
                                    </div>
                                    <h1 className="text-2xl font-bold uppercase tracking-wide">Smart Hospital & Research Center</h1>
                                </div>
                                <div className="text-sm text-right">
                                    <p><strong>Address:</strong> 25 Kings Street, CA</p>
                                    <p><strong>Phone:</strong> 89562423934</p>
                                    <p><strong>Email:</strong> smarthospitalrc@gmail.com</p>
                                    <p><strong>Website:</strong> www.smart-hospital.in</p>
                                </div>
                            </div>

                            <div className="bg-black text-white text-center py-1 font-bold uppercase mb-6">Payment Receipt</div>

                            {/* Patient / Case Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                                <div>
                                    <p><span className="font-semibold">Patient:</span> Georgia Wareham (1155)</p>
                                    <p><span className="font-semibold">Case ID:</span> 7629</p>
                                </div>
                                <div className="text-right">
                                    <p><span className="font-semibold">Admission Date:</span> 01/30/2026</p>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm border-t border-b border-gray-300">
                                    <thead className="border-b border-gray-300">
                                        <tr>
                                            <th className="py-2 text-left">#</th>
                                            <th className="py-2 text-left">Description</th>
                                            <th className="py-2 text-center">Qty</th>
                                            <th className="py-2 text-right">Discount</th>
                                            <th className="py-2 text-right">Tax</th>
                                            <th className="py-2 text-right">Amount ($)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="py-2">1</td>
                                            <td className="py-2">
                                                <p className="font-semibold">Appointment Fees</p>
                                                <p className="text-xs text-gray-500">Sansa Gomez</p>
                                            </td>
                                            <td className="py-2 text-center">1</td>
                                            <td className="py-2 text-right">0.00 (0.00%)</td>
                                            <td className="py-2 text-right">24.60 (20.00%)</td>
                                            <td className="py-2 text-right">147.60</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end">
                                <div className="w-full sm:w-1/2 text-sm">
                                    <div className="flex justify-between py-1"><span>Net Amount</span><span>$123.00</span></div>
                                    <div className="flex justify-between py-1"><span>Discount</span><span>$0.00 (0.00%)</span></div>
                                    <div className="flex justify-between py-1"><span>Tax</span><span>$24.60 (20.00%)</span></div>
                                    <div className="flex justify-between py-1 font-semibold border-t border-gray-300 mt-2 pt-2"><span>Total</span><span>$147.60</span></div>
                                    <div className="flex justify-between py-1"><span>Paid</span><span>$147.60</span></div>
                                    <div className="flex justify-between py-1"><span>Due</span><span>$0.00</span></div>
                                </div>
                            </div>

                            <div className="border-t border-gray-300 mt-8 pt-4 text-center text-sm text-gray-500">
                                <p>This is a computer-generated receipt.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}

export default BillingDetails;
