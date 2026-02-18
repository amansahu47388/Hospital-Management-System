import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import {
    Search, Plus, Edit2, Trash2, Eye, FileText, Download, Copy, FileSpreadsheet, FileIcon as FilePdf,
    X, Save, ChevronDown, Printer, CheckCircle, Loader2
} from "lucide-react";
import {
    getPatientOperations,
    createPatientOperation,
    updatePatientOperation,
    deletePatientOperation
} from "../../api/patientApi";
import { getIpdPatientDetail } from "../../api/ipdApi";
import { getDoctors } from "../../api/appointmentApi";
import { getOperationSetups, getHeaders } from "../../api/setupApi";
import { useNotify } from "../../context/NotificationContext";
import { printReport } from "../../utils/printUtils";



export default function IPDOperations() {
    const { ipdId } = useParams();
    const notify = useNotify();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [operations, setOperations] = useState([]);
    const [patientId, setPatientId] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [operationSetups, setOperationSetups] = useState([]);
    const [operationTypes, setOperationTypes] = useState([]);
    const [headerData, setHeaderData] = useState(null);
    const [ipdDetail, setIpdDetail] = useState(null);

    const [formData, setFormData] = useState({
        operation: "",
        operation_type: "",
        doctor: "",
        operation_date: new Date().toISOString().slice(0, 10),
        assistant_consultant_1: "",
        assistant_consultant_2: "",
        ot_technician: "",
        ot_assistant: "",
        anesthesia_type: "",
        anesthetist: "",
        remark: "",
        result: ""
    });

    useEffect(() => {
        const init = async () => {
            if (ipdId) {
                setLoading(true);
                try {
                    const [ipdRes, docRes, setupRes, headerRes] = await Promise.all([
                        getIpdPatientDetail(ipdId),
                        getDoctors(),
                        getOperationSetups(),
                        getHeaders()
                    ]);
                    setPatientId(ipdRes.data.patient);
                    setIpdDetail(ipdRes.data);
                    setDoctors(docRes.data || []);

                    const setups = setupRes.data || [];
                    setOperationSetups(setups);

                    if (headerRes.data && headerRes.data.length > 0) {
                        setHeaderData(headerRes.data[0]);
                    }

                    // Extract unique operation types
                    const types = [...new Set(setups.map(s => s.operation_type).filter(Boolean))];
                    setOperationTypes(types);

                    fetchOperations(ipdRes.data.patient);
                } catch (error) {
                    console.error("Error initializing operations:", error);
                    notify("error", "Failed to load records");
                } finally {
                    setLoading(false);
                }
            }
        };
        init();
    }, [ipdId]);

    const fetchOperations = async (pid = patientId) => {
        if (!pid) return;
        setLoading(true);
        try {
            const response = await getPatientOperations(pid);
            setOperations(response.data);
        } catch (error) {
            console.error("Error fetching operations:", error);
            notify("error", "Failed to fetch operation records");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.operation || !formData.doctor || !formData.operation_date) {
            notify("warning", "Please fill required fields");
            return;
        }
        setLoading(true);
        try {
            // Remove helper field before sending to API
            const { operation_type, ...payload } = formData;
            await createPatientOperation(patientId, payload);
            notify("success", "Operation record added successfully");
            fetchOperations(patientId);
            setShowAddModal(false);
            setFormData({
                operation: "",
                operation_type: "",
                doctor: "",
                operation_date: new Date().toISOString().slice(0, 10),
                assistant_consultant_1: "",
                assistant_consultant_2: "",
                ot_technician: "",
                ot_assistant: "",
                anesthesia_type: "",
                anesthetist: "",
                remark: "",
                result: ""
            });
        } catch (error) {
            notify("error", "Failed to add operation record");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const { operation_type, doctor_name, operation_name, ...payload } = selectedOperation;
            await updatePatientOperation(patientId, selectedOperation.id, payload);
            notify("success", "Operation record updated successfully");
            fetchOperations(patientId);
            setShowEditModal(false);
        } catch (error) {
            notify("error", "Failed to update operation record");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                await deletePatientOperation(patientId, id);
                notify("success", "Record deleted successfully");
                fetchOperations(patientId);
            } catch (error) {
                notify("error", "Failed to delete record");
            }
        }
    };

    const handleOpenDetail = (op) => {
        setSelectedOperation(op);
        setShowDetailModal(true);
    };

    const handlePrint = () => {
        if (!selectedOperation) return;

        const content = `
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #6046B5; padding-bottom: 5px; margin-bottom: 20px;">
                <h2 style="margin:0; color:#6046B5; font-size:20px;">OPERATION REPORT</h2>
                <div style="text-align:right; font-size:12px; font-weight:bold;">
                    <div>No: OTREF${selectedOperation.id}</div>
                    <div>Date: ${selectedOperation.operation_date}</div>
                </div>
            </div>

            <div class="data-grid" style="background:#f8f9fa; padding:15px; border-radius:8px; border:1px solid #eee;">
                <div class="data-item"><span class="data-label">Patient Name</span><span class="data-value">: ${ipdDetail?.patient_detail?.full_name || "—"}</span></div>
                <div class="data-item"><span class="data-label">Patient ID</span><span class="data-value">: PID${ipdDetail?.patient || "—"}</span></div>
                <div class="data-item"><span class="data-label">IPD NO</span><span class="data-value">: IPDN${ipdId}</span></div>
                <div class="data-item"><span class="data-label">Operation Name</span><span class="data-value">: ${selectedOperation.operation_name}</span></div>
            </div>

            <div class="report-section-title">Clinical Details</div>
            <div class="data-grid">
                <div class="data-item"><span class="data-label">Operation Type</span><span class="data-value">: ${selectedOperation.operation_type}</span></div>
                <div class="data-item"><span class="data-label">Consultant Doctor</span><span class="data-value">: ${selectedOperation.doctor_name}</span></div>
                <div class="data-item"><span class="data-label">Anesthetist</span><span class="data-value">: ${selectedOperation.anesthetist || "N/A"}</span></div>
                <div class="data-item"><span class="data-label">Anaesthesia Type</span><span class="data-value">: ${selectedOperation.anesthesia_type || "N/A"}</span></div>
                <div class="data-item"><span class="data-label">OT Technician</span><span class="data-value">: ${selectedOperation.ot_technician || "N/A"}</span></div>
                <div class="data-item"><span class="data-label">OT Assistant</span><span class="data-value">: ${selectedOperation.ot_assistant || "N/A"}</span></div>
                <div class="data-item"><span class="data-label">Assistant 1</span><span class="data-value">: ${selectedOperation.assistant_consultant_1 || "N/A"}</span></div>
                <div class="data-item"><span class="data-label">Assistant 2</span><span class="data-value">: ${selectedOperation.assistant_consultant_2 || "N/A"}</span></div>
            </div>

            <div class="report-section-title">Findings & Results</div>
            <div style="margin-bottom: 20px;">
                <p style="font-weight:bold; font-size:13px; margin-bottom:5px;">Result:</p>
                <div style="padding:10px; background:#f4f4f4; border-radius:5px; font-size:13px;">${selectedOperation.result || "No records."}</div>
            </div>
            <div>
                <p style="font-weight:bold; font-size:13px; margin-bottom:5px;">Remark / Observation:</p>
                <p style="font-size:13px; color:#555; line-height:1.6;">${selectedOperation.remark || "No records."}</p>
            </div>

            <div class="signature-section">
                <div class="sig-box">
                    <div class="sig-line"></div>
                    <div class="sig-label">Doctor Signature</div>
                </div>
                <div class="sig-box">
                    <div class="sig-line"></div>
                    <div class="sig-label">Authorised Signatory</div>
                </div>
            </div>
        `;

        printReport({
            title: `Operation Report - OTREF${selectedOperation.id}`,
            headerImg: headerData?.operation_header,
            footerText: headerData?.operation_footer,
            content: content
        });
    };

    const handleOpenEdit = (op) => {
        setSelectedOperation(op);
        setShowEditModal(true);
    };

    // Filtered setups for dropdowns
    const filteredAddSetups = formData.operation_type
        ? operationSetups.filter(s => s.operation_type === formData.operation_type)
        : [];

    const filteredEditSetups = selectedOperation?.operation_type
        ? operationSetups.filter(s => s.operation_type === selectedOperation.operation_type)
        : operationSetups;

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 pb-10">

                <IPDTabsNavbar />

                <div className="p-4 md:p-6 ">
                    <div className="bg-white rounded shadow p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm">
                        <div className="">
                            <h2 className="text-xl font-bold text-gray-800">Operations</h2>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-semibold"
                        >
                            <Plus size={18} />
                            Add Operation
                        </button>
                    </div>


                    {/* Table Actions */}


                    {/* Table */}
                    <div className="overflow-x-auto mt-6 bg-white rounded shadow overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-sm">Reference No</th>
                                    <th className="px-6 py-4 text-sm">Operation Date</th>
                                    <th className="px-6 py-4 text-sm">Operation Name</th>
                                    <th className="px-6 py-4 text-sm">Operation Type</th>
                                    <th className="px-6 py-4 text-sm">OT Technician</th>
                                    <th className="px-6 py-4 text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white border-b border-gray-200 divide-y divide-gray-100">
                                {loading && operations.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center">
                                            <div className="flex justify-center items-center gap-2">
                                                <Loader2 className="animate-spin" size={20} />
                                                <span>Loading operations...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : operations.length > 0 ? (
                                    operations.map((row, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors text-gray-600 border border-gray-200">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">OTREF{row.id}</td>
                                            <td className="px-6 py-4 text-sm ">{row.operation_date}</td>
                                            <td className="px-6 py-4 text-sm  font-semibold">{row.operation_name}</td>
                                            <td className="px-6 py-4 text-sm ">
                                                <span className="text-gray-900 px-2 py-1 rounded text-xs font-semibold ">
                                                    {row.operation_type || "N/A"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm ">{row.ot_technician || "N/A"}</td>
                                            <td className="px-6 py-4 text-sm ">
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleOpenDetail(row)}
                                                        className="hover:bg-purple-100 text-purple-500 p-1 rounded"
                                                        title="View Detail"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenEdit(row)}
                                                        className="hover:bg-green-100 text-green-500 p-1 rounded"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(row.id)}
                                                        className="hover:bg-red-100 text-red-500 p-1 rounded"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center text-gray-500 italic">
                                            {patientId ? "No operations recorded yet" : "Resolving Patient..."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center text-sm">
                            <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                {showAddModal ? <Plus size={24} /> : <Edit2 size={24} />}
                                {showAddModal ? "Add Operation" : "Edit Operation"}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    setShowEditModal(false);
                                }}
                                className="text-white/80 hover:text-white transition-colors p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto bg-white">

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                    Operation Type<span className="text-red-500 ml-1">*</span>
                                </label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] outline-none text-sm transition-shadow shadow-sm"
                                    value={showAddModal ? formData.operation_type : selectedOperation?.operation_type}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (showAddModal) setFormData({ ...formData, operation_type: val, operation: "" });
                                        else setSelectedOperation({ ...selectedOperation, operation_type: val, operation: "" });
                                    }}
                                >
                                    <option value="">Select Operation Type</option>
                                    {operationTypes.map((type, idx) => (
                                        <option key={idx} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                    Operation Name <span className="text-red-500 ml-1">*</span>
                                </label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] outline-none text-sm transition-shadow shadow-sm disabled:bg-gray-50 disabled:text-gray-400"
                                    value={showAddModal ? formData.operation : selectedOperation?.operation}
                                    disabled={showAddModal ? !formData.operation_type : !selectedOperation?.operation_type}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (showAddModal) setFormData({ ...formData, operation: val });
                                        else setSelectedOperation({ ...selectedOperation, operation: val });
                                    }}
                                >
                                    <option value="">Select Operation</option>
                                    {(showAddModal ? filteredAddSetups : filteredEditSetups).map(setup => (
                                        <option key={setup.id} value={setup.id}>{setup.name}</option>
                                    ))}
                                </select>
                                {(showAddModal ? !formData.operation_type : !selectedOperation?.operation_type) && (
                                    <p className="text-[10px] text-purple-600 font-medium">* Select Operation Type first</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                    Operation Date <span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] outline-none text-sm shadow-sm"
                                    value={showAddModal ? formData.operation_date : selectedOperation?.operation_date}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (showAddModal) setFormData({ ...formData, operation_date: val });
                                        else setSelectedOperation({ ...selectedOperation, operation_date: val });
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                                    Consultant Doctor <span className="text-red-500 ml-1">*</span>
                                </label>
                                <select
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] outline-none text-sm shadow-sm"
                                    value={showAddModal ? formData.doctor : selectedOperation?.doctor}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (showAddModal) setFormData({ ...formData, doctor: val });
                                        else setSelectedOperation({ ...selectedOperation, doctor: val });
                                    }}
                                >
                                    <option value="">Select Doctor</option>
                                    {doctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Assistant Consultant 1</label>
                                <input
                                    type="text"
                                    placeholder="Enter assistant consultant name"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] outline-none text-sm shadow-sm"
                                    value={showAddModal ? formData.assistant_consultant_1 : selectedOperation?.assistant_consultant_1}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (showAddModal) setFormData({ ...formData, assistant_consultant_1: val });
                                        else setSelectedOperation({ ...selectedOperation, assistant_consultant_1: val });
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Assistant Consultant 2</label>
                                <input
                                    type="text"
                                    placeholder="Enter assistant consultant name"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] outline-none text-sm shadow-sm"
                                    value={showAddModal ? formData.assistant_consultant_2 : selectedOperation?.assistant_consultant_2}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (showAddModal) setFormData({ ...formData, assistant_consultant_2: val });
                                        else setSelectedOperation({ ...selectedOperation, assistant_consultant_2: val });
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Anesthetist</label>
                                <input
                                    type="text"
                                    placeholder="Enter anesthetist name"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] outline-none text-sm shadow-sm"
                                    value={showAddModal ? formData.anesthetist : selectedOperation?.anesthetist}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (showAddModal) setFormData({ ...formData, anesthetist: val });
                                        else setSelectedOperation({ ...selectedOperation, anesthetist: val });
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Anesthesia Type</label>
                                <input
                                    type="text"
                                    placeholder="Enter anesthesia type"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] outline-none text-sm shadow-sm"
                                    value={showAddModal ? formData.anesthesia_type : selectedOperation?.anesthesia_type}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (showAddModal) setFormData({ ...formData, anesthesia_type: val });
                                        else setSelectedOperation({ ...selectedOperation, anesthesia_type: val });
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">OT Technician</label>
                                <input
                                    type="text"
                                    placeholder="Enter technician name"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] outline-none text-sm shadow-sm"
                                    value={showAddModal ? formData.ot_technician : selectedOperation?.ot_technician}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (showAddModal) setFormData({ ...formData, ot_technician: val });
                                        else setSelectedOperation({ ...selectedOperation, ot_technician: val });
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">OT Assistant</label>
                                <input
                                    type="text"
                                    placeholder="Enter assistant name"
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] outline-none text-sm shadow-sm"
                                    value={showAddModal ? formData.ot_assistant : selectedOperation?.ot_assistant}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (showAddModal) setFormData({ ...formData, ot_assistant: val });
                                        else setSelectedOperation({ ...selectedOperation, ot_assistant: val });
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Remark</label>
                                <textarea
                                    placeholder="Enter additional remarks..."
                                    rows={2}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] outline-none text-sm shadow-sm resize-none"
                                    value={showAddModal ? formData.remark : selectedOperation?.remark}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (showAddModal) setFormData({ ...formData, remark: val });
                                        else setSelectedOperation({ ...selectedOperation, remark: val });
                                    }}
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 col-span-1 sm:col-span-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Result</label>
                                <textarea
                                    placeholder="Enter operation results..."
                                    rows={2}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] outline-none text-sm shadow-sm resize-none"
                                    value={showAddModal ? formData.result : selectedOperation?.result}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (showAddModal) setFormData({ ...formData, result: val });
                                        else setSelectedOperation({ ...selectedOperation, result: val });
                                    }}
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={showAddModal ? handleSave : handleUpdate}
                                disabled={loading}
                                className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2]  text-white px-10 py-2 rounded flex items-center gap-2 transition-all shadow-md font-bold text-xs disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                {showAddModal ? "CREATE RECORD" : "UPDATE RECORD"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedOperation && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center text-sm">
                            <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                <FileText size={24} />
                                Operation Report Details
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                                    title="Print Report"
                                >
                                    <Printer size={20} />
                                </button>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="text-white p-1 hover:bg-white/10 rounded-lg"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                                {[
                                    { label: "OT Reference No", value: `OTREF${selectedOperation.id}` },
                                    { label: "Operation Date", value: selectedOperation.operation_date },
                                    { label: "Operation Name", value: selectedOperation.operation_name },
                                    { label: "Operation Type", value: selectedOperation.operation_type },
                                    { label: "Consultant Doctor", value: selectedOperation.doctor_name },
                                    { label: "Anesthetist", value: selectedOperation.anesthetist },
                                    { label: "Anaesthesia Type", value: selectedOperation.anesthesia_type },
                                    { label: "OT Technician", value: selectedOperation.ot_technician },
                                    { label: "OT Assistant", value: selectedOperation.ot_assistant },
                                    { label: "Assistant Consultant 1", value: selectedOperation.assistant_consultant_1 },
                                    { label: "Assistant Consultant 2", value: selectedOperation.assistant_consultant_2 },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col gap-1 border-b border-gray-50 pb-2">
                                        <span className="text-sm font-bold text-gray-600">{item.label}</span>
                                        <span className={`text-sm ${item.highlight ? "font-bold text-[#6046B5]" : "text-gray-700"}`}>
                                            {item.value || "Not Recorded"}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 grid grid-cols-1 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    <span className="text-sm font-bold text-gray-600 block mb-2">Remark / Observation</span>
                                    <p className="text-sm text-gray-700 leading-relaxed italic">
                                        "{selectedOperation.remark || "No remarks provided for this operation."}"
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                    <span className="text-sm font-bold text-gray-600 block mb-2">Operation Result</span>
                                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                        {selectedOperation.result || "No result data available."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 px-8 py-4 flex justify-end">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-bold text-xs hover:bg-gray-300 transition-colors"
                            >
                                CLOSE REPORT
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
