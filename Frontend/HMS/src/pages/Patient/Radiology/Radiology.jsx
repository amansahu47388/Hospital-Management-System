import React, { useState, useEffect, useCallback } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import {
    Search,
    Printer,
    Eye,
    X,
    AlignJustify,
    Loader
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useNotify } from "../../../context/NotificationContext";
import { getRadiologyBills, getRadiologyBillDetail } from "../../../api/radiologyApi";
import { createPatientPayment, getPatientPayments } from "../../../api/patientApi";
import { getHeaders } from "../../../api/setupApi";
import { printReport } from "../../../utils/printUtils";

export default function Radiology() {
    const { user } = useAuth();
    const notify = useNotify();

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [bills, setBills] = useState([]);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showPaymentsModal, setShowPaymentsModal] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [headerData, setHeaderData] = useState(null);

    const fetchBills = useCallback(async () => {
        if (!user?.patient_id) return;
        setLoading(true);
        try {
            const [billsRes, headersRes] = await Promise.all([
                getRadiologyBills("", user.patient_id),
                getHeaders()
            ]);
            setBills(billsRes.data || []);
            if (headersRes.data && headersRes.data.length > 0) {
                setHeaderData(headersRes.data[0]);
            }
        } catch (error) {
            console.error("Error fetching radiology bills:", error);
            notify("error", "Failed to load radiology bills");
        } finally {
            setLoading(false);
        }
    }, [user, notify]);

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);

    const handleShowDetails = async (bill) => {
        setLoading(true);
        try {
            const res = await getRadiologyBillDetail(bill.id);
            setSelectedBill(res.data);
            setShowDetailsModal(true);
        } catch (error) {
            notify("error", "Failed to load bill details");
        } finally {
            setLoading(false);
        }
    };

    const handlePay = (bill) => {
        setSelectedBill(bill);
        setPaymentAmount(bill.balance || bill.balance_amount || 0);
        setShowPaymentModal(true);
    };

    const handleShowPayments = async (bill) => {
        setSelectedBill(bill);
        setShowPaymentsModal(true);
        try {
            const res = await getPatientPayments(user.patient_id);
            const history = (res.data || []).filter(p => p.radiology_bill === bill.id);
            setPaymentHistory(history);
        } catch (error) {
            notify("error", "Failed to load payment history");
        }
    };

    const handleProcessPayment = async () => {
        if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
            notify("error", "Please enter a valid amount");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                patient: user.patient_id,
                payment_date: new Date().toISOString().slice(0, 10),
                paid_amount: parseFloat(paymentAmount),
                payment_mode: "Online",
                note: `Payment for Radiology Bill #${selectedBill.id}`,
                radiology_bill: selectedBill.id,
                service_type: "Radiology"
            };

            await createPatientPayment(user.patient_id, payload);
            notify("success", "Payment recorded successfully");
            setShowPaymentModal(false);
            fetchBills();
        } catch (error) {
            notify("error", error.response?.data?.detail || "Payment failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePrint = () => {
        if (!selectedBill) return;

        const content = `
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #6046B5; padding-bottom: 5px; margin-bottom: 20px;">
                <h2 style="margin:0; color:#6046B5; font-size:20px;">RADIOLOGY BILL</h2>
                <div style="text-align:right; font-size:12px; font-weight:bold;">
                    <div>Bill No: RADIOB${selectedBill.id}</div>
                    <div>Date: ${new Date(selectedBill.created_at).toLocaleDateString()}</div>
                </div>
            </div>

            <div class="data-grid" style="background:#f9f9f9; padding:15px; border-radius:8px; border:1px solid #eee;">
                <div class="data-item"><span class="data-label">Patient Name</span><span class="data-value">: ${selectedBill.patient_name || "—"}</span></div>
                <div class="data-item"><span class="data-label">Phone</span><span class="data-value">: ${selectedBill.patient_phone || "—"}</span></div>
                <div class="data-item"><span class="data-label">Case ID</span><span class="data-value">: ${selectedBill.case_id || "—"}</span></div>
                <div class="data-item"><span class="data-label">Doctor</span><span class="data-value">: ${selectedBill.doctor_name || "Self"}</span></div>
            </div>

            <div class="report-section-title">Test Details</div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Test Name</th>
                        <th>Report Date</th>
                        <th>Report Days</th>
                        <th style="text-align:right">Amount (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    ${selectedBill.items?.map((item, idx) => `
                        <tr>
                            <td>${idx + 1}</td>
                            <td>
                                <div>${item.test_name}</div>
                                <div style="font-size:10px; color:#666;">${item.test_detail?.short_name || ""}</div>
                            </td>
                            <td>${new Date(item.report_date).toLocaleDateString()}</td>
                            <td>${item.report_days} Days</td>
                            <td style="text-align:right">${parseFloat(item.price || 0).toFixed(2)}</td>
                        </tr>
                    `).join("") || '<tr><td colspan="5" style="text-align: center;">No items found.</td></tr>'}
                </tbody>
            </table>

            <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
                <div style="width: 250px; font-size: 13px;">
                    <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                        <span>Subtotal:</span>
                        <span>₹${parseFloat(selectedBill.subtotal).toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                        <span>Discount:</span>
                        <span>₹${parseFloat(selectedBill.discount).toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                        <span>Tax:</span>
                        <span>₹${parseFloat(selectedBill.tax).toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-top: 1px solid #eee; font-weight: bold; font-size: 15px; color: #6046B5;">
                        <span>Net Amount:</span>
                        <span>₹${parseFloat(selectedBill.total_amount).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;

        printReport({
            title: `Radiology Bill - RADIOB${selectedBill.id}`,
            headerImg: headerData?.radiology_bill_header,
            footerText: headerData?.radiology_bill_footer,
            content: content
        });
    };

    const filteredBills = bills.filter(bill =>
        String(bill.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bill.case_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <PatientLayout>
            <div className="min-h-screen transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="px-3 py-2 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            Radiology Test Reports
                        </h2>
                    </div>

                    {/* Search Bar */}
                    <div className="px-3 py-2 border-b border-gray-100 bg-white">
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
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6046B5] rounded"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {loading && bills.length === 0 ? (
                            <div className="flex justify-center p-8">
                                <Loader size={30} className="animate-spin text-gray-400" />
                            </div>
                        ) : (
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-50 text-gray-600 text-xs font-semibold">
                                    <tr className="border-b border-gray-200">
                                        <th className="px-2 py-3 text-left">Bill No</th>
                                        <th className="px-2 py-3 text-left">Case ID</th>
                                        <th className="px-2 py-3 text-left">Reporting Date</th>
                                        <th className="px-2 py-3 text-left">Reference Doctor</th>
                                        <th className="px-2 py-3 text-left">Note</th>
                                        <th className="px-2 py-3 text-left">Previous Report Value</th>
                                        <th className="px-2 py-3 text-right">Amount </th>
                                        <th className="px-2 py-3 text-right">Discount</th>
                                        <th className="px-2 py-3 text-right">Tax </th>
                                        <th className="px-2 py-3 text-right">Net Amount </th>
                                        <th className="px-2 py-3 text-right">Paid Amount </th>
                                        <th className="px-2 py-3 text-right">Balance Amount</th>
                                        <th className="px-2 py-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredBills.map((bill, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-indigo-50/30 transition-colors group"
                                        >
                                            <td className="p-3 font-medium text-indigo-600 ">
                                                RADIOB{bill.id}
                                            </td>
                                            <td className="p-3 text-gray-600 ">
                                                {bill.case_id || "-"}
                                            </td>
                                            <td className="p-3 text-gray-600 ">
                                                <div>{new Date(bill.created_at).toLocaleDateString()}</div>
                                                <div className="text-xs text-gray-400">
                                                    {new Date(bill.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="p-3 text-gray-600 ">
                                                {bill.doctor_name || "Self"}
                                            </td>
                                            <td className="p-3 text-gray-600 ">
                                                {bill.note || "-"}
                                            </td>
                                            <td className="p-3 text-gray-600 ">
                                                {bill.previous_report_value ? "Yes" : "No"}
                                            </td>
                                            <td className="p-3 text-gray-600 text-right ">
                                                {parseFloat(bill.subtotal || 0).toFixed(2)}
                                            </td>
                                            <td className="p-3 text-gray-600 text-right ">
                                                {parseFloat(bill.discount || 0).toFixed(2)}
                                            </td>
                                            <td className="p-3 text-gray-600 text-right ">
                                                {parseFloat(bill.tax || 0).toFixed(2)}
                                            </td>
                                            <td className="p-3 text-gray-600 text-right font-medium ">
                                                {parseFloat(bill.total_amount || 0).toFixed(2)}
                                            </td>
                                            <td className="p-3 text-gray-600 text-right ">
                                                {parseFloat(bill.paid_amount || 0).toFixed(2)}
                                            </td>
                                            <td className="p-3 text-right font-bold text-gray-800 ">
                                                {parseFloat(bill.balance || 0).toFixed(2)}
                                            </td>
                                            <td className="p-3 text-center ">
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    <div className="flex gap-1 justify-end w-full">
                                                        <button
                                                            onClick={() => handleShowDetails(bill)}
                                                            className="text-purple-600 hover:bg-purple-100 p-1 rounded"
                                                            title="Show Details"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleShowPayments(bill)}
                                                            className="text-purple-600 hover:bg-purple-100 p-1 rounded"
                                                            title="View Payments"
                                                        >
                                                            <AlignJustify size={16} />
                                                        </button>
                                                        {parseFloat(bill.balance) > 0 && (
                                                            <button
                                                                onClick={() => handlePay(bill)}
                                                                className="flex items-center justify-center w-full gap-1 px-2 py-1 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded text-[10px] font-semibold shadow-sm hover:from-blue-600 hover:bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:shadow transition-all"
                                                                title="Pay"
                                                            >
                                                                Pay
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="p-4 border-t border-gray-200 text-xs text-gray-500 bg-gray-50">
                        Records: 1 to {filteredBills.length} of {filteredBills.length}
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
                                Bill Details - RADIOB{selectedBill.id}
                            </h3>
                            <div className="flex items-center gap-3">
                                <button className="text-white/80 hover:text-white transition-colors" title="Print" onClick={handlePrint}>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 text-sm">
                                <div>
                                    <span className="text-gray-500 block">Bill No</span>
                                    <span className="font-semibold text-gray-800">RADIOB{selectedBill.id}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Date</span>
                                    <span className="font-semibold text-gray-800">
                                        {new Date(selectedBill.created_at).toLocaleDateString()} {new Date(selectedBill.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Case ID</span>
                                    <span className="font-semibold text-gray-800">{selectedBill.case_id || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Doctor</span>
                                    <span className="font-semibold text-gray-800">{selectedBill.doctor_name || "Self"}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Name</span>
                                    <span className="font-semibold text-gray-800">{selectedBill.patient_name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Phone</span>
                                    <span className="font-semibold text-gray-800">{selectedBill.patient_phone}</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                                        <tr>
                                            <th className="p-3">Test Name</th>
                                            <th className="p-3">Report Date</th>
                                            <th className="p-3">Report Days</th>
                                            <th className="p-3 text-right">Tax (₹)</th>
                                            <th className="p-3 text-right">Amount (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {selectedBill.items.map((item, i) => (
                                            <tr key={i}>
                                                <td className="p-3 font-medium text-gray-800">
                                                    <div>{item.test_name}</div>
                                                    <div className="text-[10px] text-gray-400">{item.test_detail?.short_name}</div>
                                                </td>
                                                <td className="p-3">{new Date(item.report_date).toLocaleDateString()}</td>
                                                <td className="p-3">{item.report_days} Days</td>
                                                <td className="p-3 text-right">{parseFloat(item.tax || 0).toFixed(2)}</td>
                                                <td className="p-3 text-right">{parseFloat(item.price || 0).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col items-end gap-2 text-sm text-gray-800 pr-4">
                                <div className="flex justify-between w-64">
                                    <span>Total (₹)</span>
                                    <span className="font-semibold">{parseFloat(selectedBill.subtotal).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Discount (₹)</span>
                                    <span>{parseFloat(selectedBill.discount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Tax (₹)</span>
                                    <span>{parseFloat(selectedBill.tax).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64 font-bold text-base border-t border-gray-200 pt-2 mt-1">
                                    <span>Net Amount (₹)</span>
                                    <span>{parseFloat(selectedBill.total_amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Paid Amount (₹)</span>
                                    <span>{parseFloat(selectedBill.paid_amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64 font-bold text-red-600">
                                    <span>Due Amount (₹)</span>
                                    <span>{parseFloat(selectedBill.balance).toFixed(2)}</span>
                                </div>
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
                                    Payment Amount (₹) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 focus:ring-1 focus:ring-[#6046B5] outline-none transition-all rounded"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={handleProcessPayment}
                                    disabled={isSubmitting}
                                    className={`px-4 py-1.5 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded shadow-md hover:bg-gradient-to-b from-[#6046B5] to-[#8A63D2] transition-all font-medium text-sm flex items-center gap-1 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                >
                                    {isSubmitting ? "Processing..." : "Add"}
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
                                <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Note</th>
                                        <th className="p-4">Payment Mode</th>
                                        <th className="p-4 text-right">Paid Amount (₹)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paymentHistory.map((payment, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="p-4">
                                                {new Date(payment.payment_date).toLocaleDateString()}
                                            </td>
                                            <td className="p-4">{payment.note}</td>
                                            <td className="p-4">{payment.payment_mode}</td>
                                            <td className="p-4 text-right">{parseFloat(payment.paid_amount || 0).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-100 font-bold">
                                        <td className="p-4 text-right" colSpan={3}>Total</td>
                                        <td className="p-4 text-right">₹{paymentHistory.reduce((acc, curr) => acc + parseFloat(curr.paid_amount || 0), 0).toFixed(2)}</td>
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
