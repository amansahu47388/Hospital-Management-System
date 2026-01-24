import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import {
    Plus,
    Edit2,
    Trash2,
    X,
    CheckCircle,
    Loader2,
} from "lucide-react";
import {
    getPatientPayments,
    createPatientPayment,
    updatePatientPayment,
    deletePatientPayment,
    getPatientCharges
} from "../../api/patientApi";
import { getIpdPatientDetail } from "../../api/ipdApi";
import { useNotify } from "../../context/NotificationContext";

export default function IPDPayment() {
    const { ipdId } = useParams();
    const notify = useNotify();

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const [patientId, setPatientId] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalCharges, setTotalCharges] = useState(0);

    const [formData, setFormData] = useState({
        payment_date: new Date().toISOString().slice(0, 10),
        paid_amount: "",
        payment_mode: "Cash",
        note: "",
    });

    const fetchData = useCallback(async () => {
        if (!ipdId) return;
        setLoading(true);
        try {
            const ipdRes = await getIpdPatientDetail(ipdId);
            const pid = ipdRes.data.patient;
            setPatientId(pid);

            const [paymentsRes, chargesRes] = await Promise.all([
                getPatientPayments(pid),
                getPatientCharges(pid)
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
    }, [ipdId, notify]);

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

    const handleSave = async () => {
        if (!formData.paid_amount || !formData.payment_date) {
            notify("error", "Amount and date are required");
            return;
        }

        setLoading(true);
        try {
            if (showAddModal) {
                await createPatientPayment(patientId, formData);
                notify("success", "Payment added successfully");
            } else {
                await updatePatientPayment(patientId, selectedPayment.id, formData);
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
                await deletePatientPayment(patientId, id);
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

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 pb-10">
                <div className="mx-4 md:mx-6">
                    <IPDTabsNavbar />
                </div>

                <div className="mx-4 md:mx-6 bg-white rounded-b-lg shadow-xl overflow-hidden min-h-[500px]">
                    {/* Page Header */}
                    <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Payments</h2>
                        </div>
                        <button
                            onClick={handleOpenAdd}
                            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-semibold"
                        >
                            <Plus size={18} />
                            Add Payment
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600">
                                <tr>
                                    {[
                                        "ID",
                                        "Date",
                                        "Note",
                                        "Payment Mode",
                                        "Paid Amount ($)",
                                        "Action",
                                    ].map((head) => (
                                        <th key={head} className="px-6 py-4 text-sm bg-gray-200">
                                            {head}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 font-outfit font-medium">
                                {loading && payments.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-10 text-center">
                                            <div className="flex items-center justify-center gap-2 text-purple-600">
                                                <Loader2 className="animate-spin" size={24} />
                                                <span>Loading records...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : payments.length > 0 ? (
                                    payments.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-100 transition-colors">
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">TRANID{row.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(row.payment_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 truncate max-w-[200px]">{row.note || "-"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{row.payment_mode}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-bold">${Number(row.paid_amount).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleOpenEdit(row)}
                                                        className="hover:bg-purple-200 text-purple-600 px-2 py-1 rounded-md transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(row.id)}
                                                        className="hover:bg-red-200 text-red-600 px-2 py-1 rounded-md transition-colors"
                                                        title="Delete">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-10 text-center text-gray-500">
                                            No payment records found.
                                        </td>
                                    </tr>
                                )}
                                {payments.length > 0 && (
                                    <tr className="bg-gray-50 font-bold">
                                        <td colSpan="4" className="px-6 py-4 text-right text-sm">Total Paid:</td>
                                        <td className="px-6 py-4 text-sm text-purple-700 font-bold text-lg">${totalPaidSum.toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Payment Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all animate-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center text-white shrink-0">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                {showAddModal ? "Add Payment" : "Edit Payment"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setShowEditModal(false);
                                }}
                                className="hover:bg-white/20 p-1 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4 font-outfit">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-gray-700">Date <span className="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all"
                                        value={formData.payment_date}
                                        onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-bold text-gray-700">Amount ($) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all font-bold text-blue-600"
                                        value={formData.paid_amount}
                                        onChange={(e) => setFormData({ ...formData, paid_amount: e.target.value })}
                                        placeholder="0.00"
                                    />
                                    {showAddModal && <span className="text-[10px] text-gray-400 italic">Auto-filled from total charges: ${totalCharges.toFixed(2)}</span>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Payment Mode</label>
                                <select
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-bold transition-all"
                                    value={formData.payment_mode}
                                    onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
                                >
                                    <option value="Cash">Cash</option>
                                    <option value="Cheque">Cheque</option>
                                    <option value="Transfer to Bank Account">Bank Transfer</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Online">Online</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700">Note</label>
                                <textarea
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm min-h-[100px] resize-none transition-all"
                                    placeholder="Enter payment details..."
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setShowEditModal(false);
                                }}
                                className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-sm hover:bg-white active:bg-gray-100 transition shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-8 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md font-bold text-sm"
                            >
                                {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                                {showAddModal ? "Save Payment" : "Update Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

