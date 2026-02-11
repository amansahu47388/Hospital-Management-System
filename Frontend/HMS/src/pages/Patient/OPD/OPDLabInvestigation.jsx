import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import OPDHeaderNavbar from "../../../components/Patient_module/OPD/OPDHeader";
import { useAuth } from "../../../context/AuthContext";
import { getPathologyBills } from "../../../api/pathologyApi";
import { getRadiologyBills } from "../../../api/radiologyApi";
import { Eye, X, FlaskConical, Microscope, Clock, User, DollarSign, FileText, Calendar, CheckCircle2 } from "lucide-react";

export default function OPDLabInvestigation() {
    const { user } = useAuth();
    const [labData, setLabData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLab, setSelectedLab] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const patientId = user?.patient_id || user?.id;

    useEffect(() => {
        if (patientId) {
            fetchLabInvestigations();
        }
    }, [patientId]);

    const fetchLabInvestigations = async () => {
        setLoading(true);
        try {
            const [pathRes, radRes] = await Promise.all([
                getPathologyBills("", patientId),
                getRadiologyBills("", patientId)
            ]);

            const combinedData = [
                ...(pathRes.data || []).map(bill => ({
                    ...bill,
                    test: bill.items?.[0]?.test_name || "Pathology Test",
                    sampleCollectionDate: bill.created_at,
                    reportDate: bill.items?.[0]?.report_date || "N/A",
                    status: bill.payment_mode || "N/A",
                    result: "In Process",
                    type: "Pathology",
                    iconColor: "text-blue-600",
                    bgColor: "bg-blue-50"
                })),
                ...(radRes.data || []).map(bill => ({
                    ...bill,
                    test: bill.items?.[0]?.test_name || "Radiology Test",
                    sampleCollectionDate: bill.created_at,
                    reportDate: bill.items?.[0]?.report_date || "N/A",
                    status: bill.payment_mode || "N/A",
                    result: "In Process",
                    type: "Radiology",
                    iconColor: "text-purple-600",
                    bgColor: "bg-purple-50"
                }))
            ].sort((a, b) => new Date(b.sampleCollectionDate) - new Date(a.sampleCollectionDate));

            setLabData(combinedData);
        } catch (error) {
            console.error("❌ Error fetching lab investigations:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString, includeTime = false) => {
        if (!dateString || dateString === "N/A") return "N/A";
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        if (includeTime) {
            options.hour = '2-digit',
                options.minute = '2-digit',
                options.hour12 = true
        }
        return new Date(dateString).toLocaleString('en-GB', options);
    };

    const handleOpenModal = (lab) => {
        setSelectedLab(lab);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedLab(null);
    };

    return (
        <PatientLayout>
            <OPDHeaderNavbar />

            <div className="min-h-screen p-4 md:p-6 ">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-5 py-4 border-b flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-gray-800">Lab Investigation</h2>
                    </div>

                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex items-center justify-center p-12">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#6046B5]"></div>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead className="bg-gray-100 text-gray-600">
                                    <tr>
                                        <th className="p-4 text-left">Test</th>
                                        <th className="p-4 text-left">Type</th>
                                        <th className="p-4 text-left">Sample Collection Date</th>
                                        <th className="p-4 text-left">Report Date</th>
                                        <th className="p-4 text-left">Payment Status</th>
                                        <th className="p-4 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {labData.length > 0 ? labData.map((d, i) => (
                                        <tr key={i} className="border-t hover:bg-indigo-50/40 transition">
                                            <td className="p-4 font-medium text-[#6046B5]">{d.test}</td>
                                            <td className="p-4">{d.type}</td>
                                            <td className="p-4">{formatDate(d.sampleCollectionDate)}</td>
                                            <td className="p-4">{d.reportDate !== "N/A" ? new Date(d.reportDate).toLocaleDateString('en-GB') : "N/A"}</td>
                                            <td className="p-4 capitalize">{d.status}</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleOpenModal(d)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-gray-500 italic">No lab investigation records found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Investigation Details Modal */}
            {isModalOpen && selectedLab && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="bg-[#6046B5] p-5 flex justify-between items-center text-white shrink-0">
                            <div className="flex items-center gap-3">
                                {selectedLab.type === "Pathology" ? (
                                    <FlaskConical className="p-2 bg-white/20 rounded-lg" size={40} />
                                ) : (
                                    <Microscope className="p-2 bg-white/20 rounded-lg" size={40} />
                                )}
                                <div>
                                    <h3 className="text-xl font-bold">{selectedLab.type} Investigation Report</h3>
                                    <p className="text-sm text-indigo-100 italic">Bill ID: #{selectedLab.id}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="p-2 hover:bg-white/10 rounded-lg transition"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-8">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Sample Date</p>
                                        <p className="text-sm font-semibold text-gray-800">{formatDate(selectedLab.sampleCollectionDate, true)}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Referred By</p>
                                        <p className="text-sm font-semibold text-gray-800">{selectedLab.doctor_name || "N/A"}</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-4">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Case ID</p>
                                        <p className="text-sm font-semibold text-gray-800">{selectedLab.case_id || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tests Included */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="text-indigo-600" size={18} />
                                    Tests Included in this Bill
                                </h4>
                                <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50/50">
                                    <table className="w-full text-xs">
                                        <thead className="bg-gray-100 text-gray-600">
                                            <tr>
                                                <th className="p-3 text-left">Test Name</th>
                                                <th className="p-3 text-left">Report Date</th>
                                                <th className="p-3 text-right">Standard Charge</th>
                                                <th className="p-3 text-right">Tax (%)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {selectedLab.items?.length > 0 ? selectedLab.items.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition">
                                                    <td className="p-3 font-semibold text-[#6046B5]">{item.test_name}</td>
                                                    <td className="p-3 text-gray-600">{formatDate(item.report_date)}</td>
                                                    <td className="p-3 text-right text-gray-800">₹{parseFloat(item.price || 0).toFixed(2)}</td>
                                                    <td className="p-3 text-right text-gray-600">{item.tax || 0}%</td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="4" className="p-6 text-center text-gray-400 italic">No test details available</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
                                <h4 className="text-sm font-bold text-[#6046B5] mb-4 flex items-center gap-2">
                                    <DollarSign size={18} />
                                    Payment Summary
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Subtotal</p>
                                        <p className="text-lg font-bold text-gray-800">₹{parseFloat(selectedLab.subtotal || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Discount</p>
                                        <p className="text-lg font-bold text-orange-600">- ₹{parseFloat(selectedLab.discount || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Tax Amount</p>
                                        <p className="text-lg font-bold text-gray-800">+ ₹{parseFloat(selectedLab.tax || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Total Amount</p>
                                        <p className="text-lg font-black text-[#6046B5]">₹{parseFloat(selectedLab.total_amount || 0).toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-indigo-200/50 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                                        <span className="text-sm font-medium text-gray-600">Paid Amount</span>
                                        <span className="text-lg font-bold text-green-600">₹{parseFloat(selectedLab.paid_amount || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-sm">
                                        <span className="text-sm font-medium text-gray-600">Balance due</span>
                                        <span className="text-lg font-bold text-red-600">₹{parseFloat(selectedLab.balance || 0).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t bg-gray-50 flex justify-between items-center shrink-0 px-6">
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                <Clock size={14} />
                                Last Updated: {formatDate(selectedLab.updated_at, true)}
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="px-8 py-2.5 bg-[#6046B5] text-white rounded-xl font-bold hover:bg-[#4d3794] transition shadow-lg"
                            >
                                Close Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PatientLayout>
    );
}
