import React, { useState } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { CreditCard, Printer, Plus, X } from "lucide-react";

export default function Payment() {
    const [payments, setPayments] = useState([
        {
            id: "TRANID11689",
            date: "01/03/2026 05:58 PM",
            note: "",
            mode: "Transfer To Bank Account",
            amount: 2510.0,
        },
        {
            id: "TRANID11629",
            date: "12/16/2025 09:30 PM",
            note: "",
            mode: "Cash",
            amount: 853.0,
        },
        {
            id: "TRANID11438",
            date: "11/14/2025 05:40 PM",
            note: "",
            mode: "Transfer To Bank Account",
            amount: 1240.0,
        },
        {
            id: "TRANID11312",
            date: "10/15/2025 05:50 PM",
            note: "",
            mode: "Transfer To Bank Account",
            amount: 954.0,
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [amount, setAmount] = useState("");

    const totalAmount = payments.reduce((acc, curr) => acc + curr.amount, 0);

    const handlePayment = (e) => {
        e.preventDefault();
        if (amount) {
            const newPayment = {
                id: `TRANID${Math.floor(Math.random() * 10000)}`,
                date: new Date().toLocaleString(),
                note: "",
                mode: "Online",
                amount: parseFloat(amount),
            };
            setPayments([newPayment, ...payments]);
            setAmount("");
            setIsModalOpen(false);
        }
    };

    return (
        <PatientLayout>
            <IPDHeaderNavbar />
            <div className="min-h-screen p-4 md:p-6 transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="bg-white p-5 border-b flex justify-between items-center bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <CreditCard className="text-indigo-600" />
                            Payment
                        </h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-transform hover:scale-105 shadow-md active:scale-95"
                        >
                            <Plus size={16} /> Make Payment
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto p-2">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="p-4 rounded-tl-lg">Transaction ID</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Note</th>
                                    <th className="p-4">Payment Mode</th>
                                    <th className="p-4 text-right">Paid Amount ($)</th>
                                    <th className="p-4 rounded-tr-lg text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.map((p, i) => (
                                    <tr
                                        key={i}
                                        className="hover:bg-indigo-50/30 transition-colors group"
                                    >
                                        <td className="p-4 font-medium text-indigo-600">{p.id}</td>
                                        <td className="p-4 text-gray-600">{p.date}</td>
                                        <td className="p-4 text-gray-500">{p.note}</td>
                                        <td className="p-4 text-gray-700">{p.mode}</td>
                                        <td className="p-4 text-right font-semibold text-gray-900">
                                            {p.amount.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="text-gray-400 hover:text-indigo-600 transition-colors p-1 rounded-full hover:bg-indigo-50" title="Print">
                                                <Printer size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 font-bold text-gray-800">
                                <tr>
                                    <td colSpan="4" className="p-4 text-right">
                                        Total :
                                    </td>
                                    <td className="p-4 text-right text-indigo-700">
                                        ${totalAmount.toFixed(2)}
                                    </td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            {/* Make Payment Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-zoom-in">
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] p-4 flex justify-between items-center text-white">
                            <h3 className="font-semibold text-lg">Make Payment</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handlePayment} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Payment Amount ($) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all active:scale-95"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PatientLayout>
    );
}
