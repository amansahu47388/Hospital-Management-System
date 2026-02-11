import React, { useState, useEffect, useCallback } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { useAuth } from "../../../context/AuthContext";
import {
    getPatientPayments,
    createPatientPayment,
    updatePatientPayment,
    deletePatientPayment,
    getPatientCharges
} from "../../../api/patientApi";
import { CreditCard, Printer, Plus, X, Loader2, Edit2, Trash2, CheckCircle } from "lucide-react";
import { useNotify } from "../../../context/NotificationContext";

export default function Payment() {
    const { user } = useAuth();
    const notify = useNotify();

    const [loading, setLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const [totalCharges, setTotalCharges] = useState(0);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const [formData, setFormData] = useState({
        payment_date: new Date().toISOString().slice(0, 10),
        paid_amount: "",
        payment_mode: "Online",
        note: "",
    });

    const fetchData = useCallback(async () => {
        if (!user?.patient_id) return;
        setLoading(true);
        try {
            const [paymentsRes, chargesRes] = await Promise.all([
                getPatientPayments(user.patient_id),
                getPatientCharges(user.patient_id)
            ]);

            setPayments(paymentsRes.data || []);
            const chargesData = chargesRes.data || [];
            const chargesSum = chargesData.reduce((sum, c) => sum + Number(c.amount || 0), 0);
            setTotalCharges(chargesSum);
        } catch (error) {
            console.error("Error fetching payment data:", error);
            notify("error", "Failed to load payment records");
        } finally {
            setLoading(false);
        }
    }, [user, notify]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenAdd = () => {
        const totalPaid = payments.reduce((sum, p) => sum + Number(p.paid_amount || 0), 0);
        const remainingAmount = Math.max(0, totalCharges - totalPaid);

        setFormData({
            payment_date: new Date().toISOString().slice(0, 10),
            paid_amount: remainingAmount.toFixed(2),
            payment_mode: "Cash",
            note: "",
        });
        setShowAddModal(true);
    };

    const handleOpenEdit = (payment) => {
        setSelectedPayment(payment);
        setFormData({
            payment_date: payment.payment_date,
            paid_amount: payment.paid_amount,
            payment_mode: payment.payment_mode,
            note: payment.note,
        });
        setShowEditModal(true);
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        if (!formData.paid_amount || !formData.payment_date) {
            notify("error", "Amount and date are required");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                paid_amount: parseFloat(formData.paid_amount),
                service_type: "IPD"
            };

            if (showAddModal) {
                await createPatientPayment(user.patient_id, payload);
                notify("success", "Payment added successfully");
            } else {
                await updatePatientPayment(user.patient_id, selectedPayment.id, payload);
                notify("success", "Payment updated successfully");
            }
            fetchData();
            setShowAddModal(false);
            setShowEditModal(false);
        } catch (error) {
            console.error("Error saving payment:", error);
            notify("error", error.response?.data?.detail || "Failed to save payment");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this payment record?")) {
            setLoading(true);
            try {
                await deletePatientPayment(user.patient_id, id);
                notify("success", "Payment deleted successfully");
                fetchData();
            } catch (error) {
                console.error("Error deleting payment:", error);
                notify("error", "Failed to delete payment");
            } finally {
                setLoading(false);
            }
        }
    };

    const totalPaidSum = payments.reduce((sum, p) => sum + Number(p.paid_amount || 0), 0);
    const balance = totalCharges - totalPaidSum;

    return (
        <PatientLayout>
            <IPDHeaderNavbar />
            <div className="min-h-screen p-4 md:p-6 transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-white p-5 border-b flex flex-col md:flex-row justify-between items-center bg-gray-50/50 gap-4">
                        <div className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <CreditCard className="text-[#6046B5]" />
                                Payment History
                            </h2>
                        </div>
                        <button
                            onClick={handleOpenAdd}
                            className="bg-[#6046B5] hover:bg-[#4a3691] text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all shadow-md active:scale-95"
                        >
                            <Plus size={16} /> Make Payment
                        </button>
                    </div>

                    {loading && payments.length === 0 ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-[#6046B5]" size={40} />
                        </div>
                    ) : (
                        <div className="overflow-x-auto p-2">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                    <tr>
                                        <th className="p-4 text-left">Transaction ID</th>
                                        <th className="p-4 text-left">Date</th>
                                        <th className="p-4 text-left">Note</th>
                                        <th className="p-4 text-left">Mode</th>
                                        <th className="p-4 text-left">Paid Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {payments.length > 0 ? payments.map((p) => (
                                        <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors">
                                            <td className="p-4 font-medium">TRANS{p.id}</td>
                                            <td className="p-4">{new Date(p.payment_date).toLocaleDateString()}</td>
                                            <td className="p-4 truncate max-w-[200px]">{p.note || "-"}</td>
                                            <td className="p-4">{p.payment_mode}</td>
                                            <td className="p-4 font-semibold">
                                                ₹{Number(p.paid_amount).toLocaleString()}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="p-10 text-center text-gray-500">No payment records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                                {payments.length > 0 && (
                                    <tfoot className="bg-gray-50 font-bold text-gray-800 border-t-2">
                                        <tr>
                                            <td colSpan="4" className="p-4 text-left">Total Paid :</td>
                                            <td className="p-4 text-left font-semibold text-sm">₹{totalPaidSum.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Payment Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] p-4 flex justify-between items-center text-white">
                            <h3 className="font-semibold text-lg">
                                {showAddModal ? "Make Payment" : "Update Payment"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                }}
                                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.payment_date}
                                        onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Amount (₹) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.paid_amount}
                                        onChange={(e) => setFormData({ ...formData, paid_amount: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] outline-none text-sm font-bold text-[#6046B5]"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Mode
                                </label>
                                <select
                                    value={formData.payment_mode}
                                    onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] outline-none text-sm font-medium"
                                >
                                    <option value="Online">Online</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Cash">Cash</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Note
                                </label>
                                <textarea
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6046B5] outline-none text-sm min-h-[80px] resize-none"
                                    placeholder="Enter payment details..."
                                ></textarea>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 disabled:opacity-50 text-white px-8 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                    {showAddModal ? "Save Payment" : "Update Payment"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PatientLayout>
    );
}
