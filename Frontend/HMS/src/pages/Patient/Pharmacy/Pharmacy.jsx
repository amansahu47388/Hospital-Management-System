import React, { useState, useEffect, useCallback } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import {
    Search, Printer, Eye, X, AlignJustify,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getPharmacyBills } from "../../../api/pharmacyApi";
import { getPatientPayments, createPatientPayment } from "../../../api/patientApi";
import { getHeaders } from "../../../api/setupApi";
import { printReport } from "../../../utils/printUtils";
import { useNotify } from "../../../context/NotificationContext";

export default function Pharmacy() {
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
    const [headerData, setHeaderData] = useState(null);

    const fetchBills = useCallback(async () => {
        if (!user?.patient_id) return;
        setLoading(true);
        try {
            const [billsRes, headersRes] = await Promise.all([
                getPharmacyBills({ patient_id: user.patient_id }),
                getHeaders()
            ]);
            setBills(billsRes.data || []);
            if (headersRes.data && headersRes.data.length > 0) {
                setHeaderData(headersRes.data[0]);
            }
        } catch (error) {
            console.error("Error fetching bills:", error);
            notify("error", "Failed to load pharmacy bills");
        } finally {
            setLoading(false);
        }
    }, [user, notify]);

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);

    const handleShowDetails = (bill) => {
        setSelectedBill(bill);
        setShowDetailsModal(true);
    };

    const handlePay = (bill) => {
        setSelectedBill(bill);
        setPaymentAmount(bill.balance_amount);
        setShowPaymentModal(true);
    };

    const handleShowPayments = async (bill) => {
        setSelectedBill(bill);
        setShowPaymentsModal(true);
        try {
            const res = await getPatientPayments(user.patient_id);
            const history = (res.data || []).filter(p => p.pharmacy_bill === bill.id);
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

        try {
            const payload = {
                patient: user.patient_id,
                payment_date: new Date().toISOString().slice(0, 10),
                paid_amount: parseFloat(paymentAmount),
                payment_mode: "Online",
                note: `Payment for Bill #${selectedBill.id}`,
                pharmacy_bill: selectedBill.id,
                service_type: "Pharmacy"
            };

            await createPatientPayment(user.patient_id, payload);
            notify("success", "Payment recorded successfully");
            setShowPaymentModal(false);
            fetchBills();
        } catch (error) {
            notify("error", error.response?.data?.detail || "Payment failed");
        }
    };

    const handlePrint = () => {
        if (!selectedBill) return;

        const content = `
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #6046B5; padding-bottom: 5px; margin-bottom: 20px;">
                <h2 style="margin:0; color:#6046B5; font-size:20px;">PHARMACY BILL</h2>
                <div style="text-align:right; font-size:12px; font-weight:bold;">
                    <div>Bill No: PHARMAB${selectedBill.id}</div>
                    <div>Date: ${new Date(selectedBill.bill_date).toLocaleDateString()}</div>
                </div>
            </div>

            <div class="data-grid" style="background:#f9f9f9; padding:15px; border-radius:8px; border:1px solid #eee;">
                <div class="data-item"><span class="data-label">Patient Name</span><span class="data-value">: ${selectedBill.patient_name || "—"}</span></div>
                <div class="data-item"><span class="data-label">Phone</span><span class="data-value">: ${selectedBill.patient_phone || "—"}</span></div>
                <div class="data-item"><span class="data-label">Case ID</span><span class="data-value">: ${selectedBill.case_id || "—"}</span></div>
                <div class="data-item"><span class="data-label">Doctor</span><span class="data-value">: ${selectedBill.doctor_name || "Self"}</span></div>
            </div>

            <div class="report-section-title">Medicine Details</div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Medicine</th>
                        <th>Batch</th>
                        <th>Unit</th>
                        <th>Expiry</th>
                        <th style="text-align:center">Qty</th>
                        <th style="text-align:right">Tax (%)</th>
                        <th style="text-align:right">Price (₹)</th>
                    </tr>
                </thead>
                <tbody>
                    ${selectedBill.items?.map((item, idx) => `
                        <tr>
                            <td>${idx + 1}</td>
                            <td>
                                <b>${item.medicine_name}</b><br/>
                                <small>${item.medicine_category}</small>
                            </td>
                            <td>${item.batch_no}</td>
                            <td>${item.medicine_unit}</td>
                            <td>${item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : "-"}</td>
                            <td style="text-align:center">${item.quantity}</td>
                            <td style="text-align:right">${item.tax_percentage}%</td>
                            <td style="text-align:right">${parseFloat(item.amount).toFixed(2)}</td>
                        </tr>
                    `).join("") || '<tr><td colspan="8" style="text-align: center;">No items found.</td></tr>'}
                </tbody>
            </table>

            <div style="display: flex; justify-content: flex-end; margin-top: 20px;">
                <div style="width: 250px; font-size: 13px;">
                    <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                        <span>Total:</span>
                        <span>₹${parseFloat(selectedBill.total_amount).toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                        <span>Discount:</span>
                        <span>₹${parseFloat(selectedBill.discount_amount).toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                        <span>Tax:</span>
                        <span>₹${parseFloat(selectedBill.tax_amount).toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-top: 1px solid #eee; font-weight: bold; font-size: 15px; color: #6046B5;">
                        <span>Net Amount:</span>
                        <span>₹${parseFloat(selectedBill.net_amount).toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                        <span>Paid:</span>
                        <span>₹${parseFloat(selectedBill.paid_amount).toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 4px 0; font-weight: bold; color: #dc2626;">
                        <span>Due:</span>
                        <span>₹${parseFloat(selectedBill.balance_amount).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;

        printReport({
            title: `Pharmacy Bill - PHARMAB${selectedBill.id}`,
            headerImg: headerData?.pharmacy_bill_header,
            footerText: headerData?.pharmacy_bill_footer,
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
                            Pharmacy Bill
                        </h2>
                    </div>

                    {/* Search Bar */}
                    <div className="px-3 py-2 bg-white">
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
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-2 py-3 text-left">Bill No</th>
                                    <th className="px-2 py-3 text-left">Case ID</th>
                                    <th className="px-2 py-3 text-left">Date</th>
                                    <th className="px-2 py-3 text-left">Doctor Name</th>
                                    <th className="px-2 py-3 text-left">Note</th>
                                    <th className="px-2 py-3 text-left">Discount</th>
                                    <th className="px-2 py-3 text-left">Net Amount</th>
                                    <th className="px-2 py-3 text-left">Paid Amount</th>
                                    <th className="px-2 py-3 text-left">Refund Amount</th>
                                    <th className="px-2 py-3 text-left">Balance Amount</th>
                                    <th className="px-2 py-3 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredBills.map((bill, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-indigo-50/30 transition-colors group border-b border-gray-200"
                                    >
                                        <td className="px-2 py-3 font-medium text-indigo-600 whitespace-nowrap">
                                            PHARMAB{bill.id}
                                        </td>
                                        <td className="px-2 py-3 text-gray-600 whitespace-nowrap">
                                            {bill.case_id || "-"}
                                        </td>
                                        <td className="px-2 py-3 text-gray-600 whitespace-nowrap">
                                            <div>{new Date(bill.bill_date).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(bill.bill_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-2 py-3 text-gray-600 whitespace-nowrap">
                                            {bill.doctor_name || "Self"}
                                        </td>
                                        <td className="px-2 py-3 text-gray-600 whitespace-nowrap">
                                            {bill.note || "-"}
                                        </td>
                                        <td className="px-2 py-3 text-gray-600 text-right whitespace-nowrap">
                                            {parseFloat(bill.discount_amount).toFixed(2)}
                                        </td>
                                        <td className="px-2 py-3 text-gray-600 text-right font-medium whitespace-nowrap">
                                            {parseFloat(bill.net_amount).toFixed(2)}
                                        </td>
                                        <td className="px-2 py-3 text-gray-600 text-right whitespace-nowrap">
                                            {parseFloat(bill.paid_amount).toFixed(2)}
                                        </td>
                                        <td className="px-2 py-3 text-gray-600 text-right whitespace-nowrap">
                                            {parseFloat(bill.refund_amount).toFixed(2)}
                                        </td>
                                        <td className="px-2 py-3 text-right font-bold text-gray-800 whitespace-nowrap">
                                            {parseFloat(bill.balance_amount).toFixed(2)}
                                        </td>
                                        <td className="px-2 py-3 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleShowDetails(bill)}
                                                    className=""
                                                    title="Show Details">
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleShowPayments(bill)}
                                                    className=""
                                                    title="View Payments">
                                                    <AlignJustify size={16} />
                                                </button>
                                                {parseFloat(bill.balance_amount) > 0 && (
                                                    <button
                                                        onClick={() => handlePay(bill)}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded text-xs font-semibold shadow-sm hover:from-blue-600 hover:bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:shadow transition-all"
                                                        title="Pay">
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
                                Bill Details - PHARMAB{selectedBill.id}
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
                                    <span className="font-semibold text-gray-800">PHARMAB{selectedBill.id}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Date</span>
                                    <span className="font-semibold text-gray-800">
                                        {new Date(selectedBill.bill_date).toLocaleDateString()} {new Date(selectedBill.bill_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                                            <th className="p-3 text-right">Amount (₹)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white">
                                        {selectedBill.items.map((med, i) => (
                                            <tr key={i}>
                                                <td className="p-3">{med.medicine_category}</td>
                                                <td className="p-3 font-medium text-gray-800">{med.medicine_name}</td>
                                                <td className="p-3">{med.batch_no}</td>
                                                <td className="p-3">{med.medicine_unit}</td>
                                                <td className="p-3">{med.expiry_date ? new Date(med.expiry_date).toLocaleDateString() : "-"}</td>
                                                <td className="p-3 text-center">{med.quantity}</td>
                                                <td className="p-3">{med.tax_percentage}%</td>
                                                <td className="p-3">{med.discount_percentage}%</td>
                                                <td className="p-3 text-right">{parseFloat(med.amount).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex flex-col items-end gap-2 text-sm text-gray-800 pr-4">
                                <div className="flex justify-between w-64">
                                    <span>Total (₹)</span>
                                    <span className="font-semibold">{parseFloat(selectedBill.total_amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Discount (₹)</span>
                                    <span>{parseFloat(selectedBill.discount_amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Tax (₹)</span>
                                    <span>{parseFloat(selectedBill.tax_amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64 font-bold text-base border-t pt-2 mt-1">
                                    <span>Net Amount (₹)</span>
                                    <span>{parseFloat(selectedBill.net_amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Paid Amount (₹)</span>
                                    <span>{parseFloat(selectedBill.paid_amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64">
                                    <span>Refund Amount (₹)</span>
                                    <span>{parseFloat(selectedBill.refund_amount).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between w-64 font-bold text-red-600">
                                    <span>Due Amount (₹)</span>
                                    <span>{parseFloat(selectedBill.balance_amount).toFixed(2)}</span>
                                </div>
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
                                    Payment Amount (₹) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={paymentAmount}
                                    onChange={(e) => setPaymentAmount(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none transition-all"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={handleProcessPayment}
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
                                        <th className="p-4 text-right">Paid Amount (₹)</th>
                                        <th className="p-4 text-right">Action</th>
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
                                            <td className="p-4 text-right">{parseFloat(payment.paid_amount).toFixed(2)}</td>
                                            <td className="p-4 text-right">
                                                <button className="text-gray-500 hover:text-indigo-600" title="Print">
                                                    <Printer size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr className="bg-gray-100 font-bold">
                                        <td className="p-4 text-right" colSpan={3}>Total</td>
                                        <td className="p-4 text-right">₹{paymentHistory.reduce((acc, curr) => acc + parseFloat(curr.paid_amount), 0).toFixed(2)}</td>
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
