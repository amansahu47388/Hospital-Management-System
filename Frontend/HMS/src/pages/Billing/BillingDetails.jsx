import React, { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import BillingNavbar from "./BillingNavbar";
import BillSummary from "../../components/Billing/BillSummary";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    User, Printer, X, IndianRupee, FileText, Check, Timer, Hospital, Search, Eye, Menu, Scan,
    FlaskConical, Ambulance, Loader2
} from "lucide-react";
import { getMedicalCases, getPatientCharges, getPatientPayments, createPatientPayment } from "../../api/patientApi";
import { getPathologyBills } from "../../api/pathologyApi";
import { getRadiologyBills } from "../../api/radiologyApi";
import { getPharmacyBills } from "../../api/pharmacyApi";
import { getAmbulanceBills } from "../../api/ambulanceApi";
import { getOpdPatientList } from "../../api/opdApi";
import { getIpdPatientList } from "../../api/ipdApi";
import { useNotify } from "../../context/NotificationContext";


function BillingDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const activeTab = query.get("tab") || "OPD";

    const notify = useNotify();
    const [patientData, setPatientData] = useState(null);
    const [searchCaseId, setSearchCaseId] = useState("");
    const [loading, setLoading] = useState(false);
    const [charges, setCharges] = useState([]);
    const [payments, setPayments] = useState([]);

    // Module Specific States
    const [pathologyBills, setPathologyBills] = useState([]);
    const [radiologyBills, setRadiologyBills] = useState([]);
    const [pharmacyBills, setPharmacyBills] = useState([]);
    const [ambulanceBills, setAmbulanceBills] = useState([]);
    const [opdVisits, setOpdVisits] = useState([]);
    const [ipdAdmissions, setIpdAdmissions] = useState([]);

    const [showSingleModuleBilling, setShowSingleModuleBilling] = useState(false);

    // Modals State
    const [showSummary, setShowSummary] = useState(false);
    const [showAddPayment, setShowAddPayment] = useState(false);
    const [showViewPayments, setShowViewPayments] = useState(false);
    const [showGenerateBill, setShowGenerateBill] = useState(false);

    // Add Payment State
    const [paymentData, setPaymentData] = useState({
        amount: "",
        mode: "Cash",
        note: "",
        date: new Date().toISOString().slice(0, 16)
    });

    const fetchDetails = async (caseIdValue) => {
        try {
            setLoading(true);
            const caseRes = await getMedicalCases(null, caseIdValue);
            if (caseRes.data && caseRes.data.length > 0) {
                const caseObj = caseRes.data[0];
                const patient = caseObj.patient_details;

                setPatientData({
                    id: patient.id,
                    caseId: caseObj.case_id,
                    case_id_internal: caseObj.id, // Store internal ID for filtering
                    name: `${patient.full_name} (${patient.id})`,
                    gender: patient.gender,
                    phone: patient.phone,
                    opdNo: "OPDN" + (caseObj.id + 7500),
                    appointmentDate: new Date(caseObj.created_at).toLocaleString(),
                    guardianName: patient.emergency_contact_name || "N/A",
                    age: patient.age || "N/A",
                    creditLimit: "5000.00",
                });

                // Fetch Charges and Payments
                const [chargesRes, paymentsRes, pathoRes, radioRes, pharmRes, ambuRes, opdRes, ipdRes] = await Promise.all([
                    getPatientCharges(patient.id),
                    getPatientPayments(patient.id),
                    getPathologyBills(null, patient.id),
                    getRadiologyBills(null, patient.id),
                    getPharmacyBills(),
                    getAmbulanceBills(),
                    getOpdPatientList({ patient_id: patient.id }),
                    getIpdPatientList({ patient_id: patient.id })
                ]);

                setCharges(chargesRes.data || []);
                setPayments(paymentsRes.data || []);
                setPathologyBills(pathoRes.data || []);
                setRadiologyBills(radioRes.data || []);
                setOpdVisits(opdRes.data || []);
                setIpdAdmissions(ipdRes.data || []);

                // Local filtering for Pharmacy and Ambulance
                setPharmacyBills((pharmRes.data || []).filter(b => b.patient_id === patient.id || b.patient === patient.id));
                setAmbulanceBills((ambuRes.data || []).filter(b => b.patient_id === patient.id || b.patient === patient.id));
            } else {
                notify("error", "No Case found with this ID");
                setPatientData(null);
                setCharges([]);
                setPayments([]);
            }
        } catch (error) {
            console.error("Search error:", error);
            notify("error", "Error fetching details");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (!searchCaseId.trim()) return notify("warning", "Enter Case ID");
        fetchDetails(searchCaseId);
    };

    const handleAddPayment = async () => {
        if (!paymentData.amount) return notify("warning", "Amount is required");
        if (!patientData) return notify("error", "No patient selected");

        try {
            const payload = {
                paid_amount: paymentData.amount,
                payment_mode: paymentData.mode,
                note: paymentData.note,
                payment_date: paymentData.date.split('T')[0] // API expects date only typically
            };
            await createPatientPayment(patientData.id, payload);
            notify("success", "Payment added successfully");
            setShowAddPayment(false);
            // Refresh payments and charges (if needed)
            const paymentsRes = await getPatientPayments(patientData.id);
            setPayments(paymentsRes.data || []);
            setPaymentData({
                amount: "",
                mode: "Cash",
                note: "",
                date: new Date().toISOString().slice(0, 16)
            });
        } catch (error) {
            notify("error", "Failed to add payment");
        }
    };

    useEffect(() => {
        if (location.state?.caseId) {
            setSearchCaseId(location.state.caseId);
            fetchDetails(location.state.caseId);
        }
    }, [location.state]);

    return (
        <AdminLayout>
            <div className="p-4 bg-gray-50 min-h-screen">
                <div className="bg-white rounded shadow-sm overflow-hidden mb-6 border-t-2 border-gray-200">
                    {/* TOP HEADER */}
                    <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-white relative z-50">
                        <h2 className="text-gray-700 font-semibold">OPD/IPD Billing Through Case Id</h2>
                        {/* Floating Module Billing Icon */}
                        <div>
                            <button
                                onClick={() => setShowSingleModuleBilling(!showSingleModuleBilling)}
                                className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:from-[#8A63D2] hover:to-[#6046B5] text-white p-2 rounded"
                            >
                                <Menu size={18} />
                            </button>

                            {showSingleModuleBilling && (
                                <div className="absolute top-8 right-0 w-64 bg-white shadow-xl border border-gray-200 rounded z-50">
                                    <div className="px-3 py-2 bg-gray-100 text-sm font-semibold text-gray-700">Single Module Billing</div>
                                    <div className="py-2">
                                        <div onClick={() => navigate("/admin/appointments")} className="px-4 py-2 flex items-center gap-3 hover:bg-gray-100 cursor-pointer text-sm">
                                            <Timer size={16} className="text-gray-500" /> Appointment
                                        </div>
                                        <div onClick={() => navigate("/admin/opd-patients")} className="px-4 py-2 flex items-center gap-3 hover:bg-gray-100 cursor-pointer text-sm">
                                            <User size={16} className="text-gray-500" /> OPD
                                        </div>
                                        <div onClick={() => navigate("/admin/pathology-bills")} className="px-4 py-2 flex items-center gap-3 hover:bg-gray-100 cursor-pointer text-sm">
                                            <FlaskConical size={16} className="text-gray-500" /> Pathology
                                        </div>
                                        <div onClick={() => navigate("/admin/radiology-bills")} className="px-4 py-2 flex items-center gap-3 hover:bg-gray-100 cursor-pointer text-sm">
                                            <Scan size={16} className="text-gray-500" /> Radiology
                                        </div>
                                        <div onClick={() => navigate("/admin/ambulance")} className="px-4 py-2 flex items-center gap-3 hover:bg-gray-100 cursor-pointer text-sm">
                                            <Ambulance size={16} className="text-gray-500" /> Ambulance
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-4 relative">
                        {/* SEARCH ROW */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">Case ID <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={searchCaseId}
                                    onChange={(e) => setSearchCaseId(e.target.value)}
                                    className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 w-48"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:from-[#8A63D2] hover:to-[#6046B5] text-white px-3 py-2 rounded text-sm flex items-center gap-1 disabled:opacity-50"
                            >
                                {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />} Search
                            </button>
                        </div>

                        {/* PATIENT INFO CARD */}
                        {patientData && (
                            <div className="flex flex-col md:flex-row gap-8 relative pb-4">
                                {/* Photo & Barcode Section */}
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-36 bg-gray-100 border border-gray-200 rounded overflow-hidden mb-2">
                                        <img
                                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop"
                                            alt="Patient"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setShowSummary(true)}
                                        className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:from-[#8A63D2] hover:to-[#6046B5] text-white text-xs py-2 px-4 rounded transition-colors"
                                    >
                                        Bill Summary
                                    </button>
                                </div>

                                {/* Patient Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-1 flex-grow text-[13px]">
                                    <div className="flex justify-between items-center py-1">
                                        <span className="font-semibold text-gray-700 min-w-32">Case ID</span>
                                        <span className="text-gray-600 flex-grow text-right md:text-left">{patientData.caseId}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="font-semibold text-gray-700 min-w-32">Appointment Date</span>
                                        <span className="text-gray-600 flex-grow text-right md:text-left">{patientData.appointmentDate}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-1">
                                        <span className="font-semibold text-gray-700 min-w-32">Name</span>
                                        <span className="text-gray-600 flex-grow text-right md:text-left">{patientData.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="font-semibold text-gray-700 min-w-32">Guardian Name</span>
                                        <span className="text-gray-600 flex-grow text-right md:text-left">{patientData.guardianName}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-1">
                                        <span className="font-semibold text-gray-700 min-w-32">Gender</span>
                                        <span className="text-gray-600 flex-grow text-right md:text-left">{patientData.gender}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="font-semibold text-gray-700 min-w-32">Age</span>
                                        <span className="text-gray-600 flex-grow text-right md:text-left">{patientData.age}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-1">
                                        <span className="font-semibold text-gray-700 min-w-32">Phone</span>
                                        <span className="text-gray-600 flex-grow text-right md:text-left">{patientData.phone}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                        <span className="font-semibold text-gray-700 min-w-32">Credit Limit ($)</span>
                                        <span className="text-gray-600 flex-grow text-right md:text-left">{patientData.creditLimit}</span>
                                    </div>

                                    <div className="flex justify-between items-center py-1">
                                        <span className="font-semibold text-gray-700 min-w-32">OPD No</span>
                                        <span className="text-gray-600 flex-grow text-right md:text-left">{patientData.opdNo}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* TABS & ACTIONS ROW */}
                <div className="bg-white rounded shadow-sm overflow-hidden flex flex-col">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between ">
                        <div className="flex-grow">
                            <BillingNavbar />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-2 bg-gray-50 lg:bg-transparent">
                            <button
                                onClick={() => setShowAddPayment(true)}
                                className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-2 text-sm rounded flex items-center gap-1 shadow"
                            >
                                <IndianRupee size={16} /> Add Payment
                            </button>
                            <button
                                onClick={() => setShowViewPayments(true)}
                                className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-2 text-sm rounded flex items-center gap-1 shadow"
                            >
                                <Eye size={16} /> View Payments
                            </button>
                            <div className="flex items-center">
                                <button
                                    onClick={() => setShowGenerateBill(true)}
                                    className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-2 text-sm rounded-l flex items-center gap-1 shadow"
                                >
                                    <FileText size={16} /> Generate Bill
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* TABS & TABLES */}
                    <div className="p-1">
                        {activeTab === "OPD" && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-[13px] whitespace-nowrap">
                                    <thead className="bg-[#f2f2f2] text-gray-700 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="px-3 py-2 text-left ">Date</th>
                                            <th className="px-3 py-2 text-left">Charge Name</th>
                                            <th className="px-3 py-2 text-left">Charge Type</th>
                                            <th className="px-3 py-2 text-left">Charge Category</th>
                                            <th className="px-3 py-2 text-left">Standard Charge ($)</th>
                                            <th className="px-3 py-2 text-left">Discount</th>
                                            <th className="px-3 py-2 text-left">Tax</th>
                                            <th className="px-3 py-2 text-left">Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {(() => {
                                            const filteredCharges = charges.filter(c => c.charge_type?.toUpperCase().includes("OPD") || !c.charge_type);
                                            const mappedVisits = opdVisits.map(v => ({
                                                id: `opd-${v.opd_id}`,
                                                charge_date: v.appointment_date || v.created_at,
                                                charge_name: "OPD Visit / Consultation",
                                                charge_type: "OPD",
                                                charge_category: "Consultation",
                                                standard_charge: (Number(v.total_amount || 0) + Number(v.discount || 0)).toFixed(2),
                                                discount: Number(v.discount || 0).toFixed(2),
                                                tax: "0.00",
                                                amount: Number(v.total_amount || 0).toFixed(2)
                                            }));
                                            const allOpdItems = [...filteredCharges, ...mappedVisits];

                                            if (allOpdItems.length === 0) {
                                                return (
                                                    <tr>
                                                        <td colSpan="9" className="px-3 py-10 text-center text-gray-400 font-medium">No OPD charges found</td>
                                                    </tr>
                                                );
                                            }

                                            return (
                                                <>
                                                    {allOpdItems.map((charge) => (
                                                        <tr key={charge.id} className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer ">
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{charge.charge_date ? new Date(charge.charge_date).toLocaleDateString() : new Date().toLocaleDateString()}</td>
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{charge.charge_name}</td>
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{charge.charge_type || "OPD"}</td>
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{charge.charge_category}</td>
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{Number(charge.standard_charge || 0).toFixed(2)}</td>
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{Number(charge.discount || 0).toFixed(2)}</td>
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{Number(charge.tax || 0).toFixed(2)}</td>
                                                            <td className="px-3 py-3 text-gray-800 font-medium font-bold">{Number(charge.amount || 0).toFixed(2)}</td>
                                                            <td className="px-3 py-3 text-gray-500">
                                                                <Printer size={16} className="cursor-pointer mx-auto hover:text-[#6046B5]" />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr className="bg-[#f9f9f9] font-bold border-b border-gray-100">
                                                        <td colSpan="8" className="px-3 py-2 text-right text-gray-800">
                                                            Total : ${allOpdItems.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0).toFixed(2)}
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                </>
                                            );
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "IPD" && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-[13px] whitespace-nowrap">
                                    <thead className="bg-[#f2f2f2] text-gray-700 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Date</th>
                                            <th className="px-3 py-2 text-left">Charge Name</th>
                                            <th className="px-3 py-2 text-left">Charge Type</th>
                                            <th className="px-3 py-2 text-left">Charge Category</th>
                                            <th className="px-3 py-2 text-left">Standard Charge ($)</th>
                                            <th className="px-3 py-2 text-left">Discount</th>
                                            <th className="px-3 py-2 text-left">Tax</th>
                                            <th className="px-3 py-2 text-left">Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {(() => {
                                            const filteredCharges = charges.filter(c => c.charge_type?.toUpperCase().includes("IPD"));

                                            // IPD might have admissions/bed charges too, but currently they seem to go through PatientCharges
                                            const allIpdItems = [...filteredCharges];

                                            if (allIpdItems.length === 0) {
                                                return (
                                                    <tr>
                                                        <td colSpan="9" className="px-3 py-10 text-center text-gray-400 font-medium">No IPD charges found</td>
                                                    </tr>
                                                );
                                            }

                                            return (
                                                <>
                                                    {allIpdItems.map((charge) => (
                                                        <tr key={charge.id} className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer ">
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{charge.charge_date || new Date(charge.created_at).toLocaleDateString()}</td>
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{charge.charge_name}</td>
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{charge.charge_type || "IPD"}</td>
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{charge.charge_category}</td>
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{Number(charge.standard_charge || 0).toFixed(2)}</td>
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{Number(charge.discount || 0).toFixed(2)}</td>
                                                            <td className="px-3 py-3 text-gray-600 font-medium">{Number(charge.tax || 0).toFixed(2)}</td>
                                                            <td className="px-3 py-3 text-gray-800 font-medium font-bold">{Number(charge.amount || 0).toFixed(2)}</td>
                                                            <td className="px-3 py-3 text-gray-500">
                                                                <Printer size={16} className="cursor-pointer mx-auto hover:text-[#6046B5]" />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    <tr className="bg-[#f9f9f9] font-bold border-b border-gray-100">
                                                        <td colSpan="8" className="px-3 py-2 text-right text-gray-800">
                                                            Total : ${allIpdItems.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0).toFixed(2)}
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                </>
                                            );
                                        })()}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "Pharmacy" && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-[13px] whitespace-nowrap">
                                    <thead className="bg-[#f2f2f2] text-gray-700 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="px-3 py-2 text-left ">Bill No</th>
                                            <th className="px-3 py-2 text-left ">Date</th>
                                            <th className="px-3 py-2 text-left ">Doctor</th>
                                            <th className="px-3 py-2 text-left ">Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Discount ($)</th>
                                            <th className="px-3 py-2 text-left ">Tax ($)</th>
                                            <th className="px-3 py-2 text-left ">Net Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Paid Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Balance ($)</th>
                                            <th className="px-3 py-2 text-left ">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pharmacyBills.length > 0 ? (
                                            pharmacyBills.map((bill) => (
                                                <tr key={bill.id} className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.id}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.date || new Date(bill.created_at).toLocaleDateString()}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.doctor_name || "N/A"}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.total_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.discount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.tax || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-800 font-medium font-bold">{Number(bill.net_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-green-600 font-medium font-bold">{Number(bill.paid_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-red-600 font-medium font-bold">{Number(bill.balance_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-center">
                                                        <Printer size={16} className="cursor-pointer mx-auto text-gray-400 hover:text-[#6046B5]" title="Print Bill" />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="px-3 py-10 text-center text-gray-400 font-medium">No Pharmacy bills found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "Pathology" && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-[13px] whitespace-nowrap">
                                    <thead className="bg-[#f2f2f2] text-gray-700 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Bill No</th>
                                            <th className="px-3 py-2 text-left">Date</th>
                                            <th className="px-3 py-2 text-left">Doctor</th>
                                            <th className="px-3 py-2 text-left">Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Discount ($)</th>
                                            <th className="px-3 py-2 text-left">Net Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Paid Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Balance ($)</th>
                                            <th className="px-3 py-2 text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pathologyBills.length > 0 ? (
                                            pathologyBills.map((bill) => (
                                                <tr key={bill.id} className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.id}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.date || new Date(bill.created_at).toLocaleDateString()}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.doctor_name || "N/A"}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.total_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.discount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-800 font-medium font-bold">{Number(bill.total_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-green-600 font-medium font-bold">{Number(bill.paid_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-red-600 font-medium font-bold">{Number(bill.balance || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-center">
                                                        <Printer size={16} className="cursor-pointer mx-auto text-gray-400 hover:text-[#6046B5]" title="Print Bill" />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="px-3 py-10 text-center text-gray-400 font-medium">No Pathology bills found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "Radiology" && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-[13px] whitespace-nowrap">
                                    <thead className="bg-[#f2f2f2] text-gray-700 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="px-3 py-2 text-left ">Bill No</th>
                                            <th className="px-3 py-2 text-left ">Date</th>
                                            <th className="px-3 py-2 text-left ">Doctor</th>
                                            <th className="px-3 py-2 text-left ">Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Discount ($)</th>
                                            <th className="px-3 py-2 text-left ">Net Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Paid Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Balance ($)</th>
                                            <th className="px-3 py-2 text-left ">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {radiologyBills.length > 0 ? (
                                            radiologyBills.map((bill) => (
                                                <tr key={bill.id} className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.id}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.date || new Date(bill.created_at).toLocaleDateString()}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.doctor_name || "N/A"}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.total_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.discount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-800 font-medium font-bold">{Number(bill.total_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-green-600 font-medium font-bold">{Number(bill.paid_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-red-600 font-medium font-bold">{Number(bill.balance || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-center">
                                                        <Printer size={16} className="cursor-pointer mx-auto text-gray-400 hover:text-[#6046B5]" title="Print Bill" />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="px-3 py-10 text-center text-gray-400 font-medium">No Radiology bills found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "Ambulance" && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-[13px] whitespace-nowrap">
                                    <thead className="bg-[#f2f2f2] text-gray-700 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="px-3 py-2 text-left ">Bill No</th>
                                            <th className="px-3 py-2 text-left ">Vehicle No</th>
                                            <th className="px-3 py-2 text-left ">Date</th>
                                            <th className="px-3 py-2 text-left ">Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Paid Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Balance Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {ambulanceBills.length > 0 ? (
                                            ambulanceBills.map((bill) => (
                                                <tr key={bill.id} className="hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.id || "N/A"}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.ambulance_number || bill.vehicle_no || "N/A"}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.date || new Date(bill.created_at).toLocaleDateString()}</td>
                                                    <td className="px-3 py-3 text-gray-800 font-medium font-bold">{Number(bill.net_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-green-600 font-medium font-bold">{Number(bill.paid_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-red-600 font-medium font-bold">{Number(bill.balance || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-center">
                                                        <Printer size={16} className="cursor-pointer mx-auto text-gray-400 hover:text-[#6046B5]" title="Print Bill" />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-3 py-10 text-center text-gray-400 font-medium">No Ambulance bills found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
                                    <input
                                        type="datetime-local"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6046B5]"
                                        value={paymentData.date}
                                        onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 text-sm font-medium mb-1">Amount ($) <span className="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6046B5]"
                                        value={paymentData.amount}
                                        onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">Payment Mode</label>
                                <select
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6046B5]"
                                    value={paymentData.mode}
                                    onChange={(e) => setPaymentData({ ...paymentData, mode: e.target.value })}
                                >
                                    <option>Cash</option>
                                    <option>Card</option>
                                    <option>Cheque</option>
                                    <option>Bank Transfer</option>
                                    <option>Online</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-1">Note</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6046B5]"
                                    rows="3"
                                    value={paymentData.note}
                                    onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleAddPayment}
                                    className="flex items-center  bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-[#0b65c2] text-white px-4 py-2 rounded font-medium transition-colors"
                                >
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl animate-zoom-in">
                        <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded-t-lg">
                            <h3 className="font-semibold text-lg">Payments</h3>
                            <X className="cursor-pointer hover:opacity-80" onClick={() => setShowViewPayments(false)} />
                        </div>
                        <div className="p-6">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Date</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Note</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Payment Mode</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700 text-right">Paid Amount ($)</th>

                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 border-b border-gray-200">
                                        {payments.length > 0 ? (
                                            payments.map((p) => (
                                                <tr key={p.id}>
                                                    <td className="px-4 py-2">{p.payment_date}</td>
                                                    <td className="px-4 py-2">{p.note || "-"}</td>
                                                    <td className="px-4 py-2">{p.payment_mode}</td>
                                                    <td className="px-4 py-2 text-right">{p.paid_amount}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-10 text-center text-gray-400">No payments found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot className="bg-gray-50 font-semibold border-t">
                                        <tr>
                                            <td colSpan="3" className="px-2 py-2 text-right">Total</td>
                                            <td className="px-2 py-2 text-right">${payments.reduce((sum, p) => sum + parseFloat(p.paid_amount || 0), 0).toFixed(2)}</td>
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
                            {/* Patient / Case Info */}
                            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                                <div>
                                    <p><span className="font-semibold">Patient:</span> {patientData?.name}</p>
                                    <p><span className="font-semibold">Case ID:</span> {patientData?.caseId}</p>
                                </div>
                                <div className="text-right">
                                    <p><span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-sm border-t border-b border-gray-300">
                                    <thead className="border-b border-gray-300">
                                        <tr>
                                            <th className="py-2 text-left">#</th>
                                            <th className="py-2 text-left">Description</th>
                                            <th className="py-2 text-right">Discount</th>
                                            <th className="py-2 text-right">Tax</th>
                                            <th className="py-2 text-right">Amount ($)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {charges.map((c, idx) => (
                                            <tr key={c.id}>
                                                <td className="py-2 text-left">{idx + 1}</td>
                                                <td className="py-2">
                                                    <p className="font-semibold">{c.charge_name}</p>
                                                    <p className="text-xs text-gray-500">{c.charge_type}</p>
                                                </td>
                                                <td className="py-2 text-right">${c.discount || "0.00"}</td>
                                                <td className="py-2 text-right">${c.tax || "0.00"}</td>
                                                <td className="py-2 text-right">${c.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="flex justify-end">
                                <div className="w-full sm:w-1/2 text-sm">
                                    <div className="flex justify-between py-1">
                                        <span>Sub Total</span>
                                        <span>${charges.reduce((sum, c) => sum + parseFloat(c.standard_charge || 0), 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-1 text-red-600">
                                        <span>Discount</span>
                                        <span>-${charges.reduce((sum, c) => sum + parseFloat(c.discount || 0), 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-1 text-green-600">
                                        <span>Tax</span>
                                        <span>+${charges.reduce((sum, c) => sum + parseFloat(c.tax || 0), 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-1 font-semibold border-t border-gray-300 mt-2 pt-2">
                                        <span>Total</span>
                                        <span>${charges.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-1 text-[#6046B5] font-bold">
                                        <span>Total Paid</span>
                                        <span>${payments.reduce((sum, p) => sum + parseFloat(p.paid_amount || 0), 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between py-1 border-t mt-1">
                                        <span>Balance Due</span>
                                        <span className="font-bold">
                                            ${(charges.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0) - payments.reduce((sum, p) => sum + parseFloat(p.paid_amount || 0), 0)).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}

            {/* Bill Summary Modal */}
            <BillSummary
                isOpen={showSummary}
                onClose={() => setShowSummary(false)}
                charges={charges}
                payments={payments}
            />

        </AdminLayout>
    );
}

export default BillingDetails;
