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
import { postCaseBillingPayment } from "../../api/billingApi";
import { getPathologyBills, updatePathologyBill } from "../../api/pathologyApi";
import { getRadiologyBills, updateRadiologyBill } from "../../api/radiologyApi";
import { getPharmacyBills, updatePharmacyBill } from "../../api/pharmacyApi";
import { getAmbulanceBills, updateAmbulanceBill } from "../../api/ambulanceApi";
import { getOpdPatientList, updateOpdPatient } from "../../api/opdApi";
import { getIpdPatientList, updateIpdPatient } from "../../api/ipdApi";
import { getHeaders } from "../../api/setupApi";
import { printReport } from "../../utils/printUtils";
import { useNotify } from "../../context/NotificationContext";


function BillingDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search);
    const activeTab = query.get("tab") || "All";

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
    const [opdRows, setOpdRows] = useState([]);
    const [ipdRows, setIpdRows] = useState([]);
    const [headerData, setHeaderData] = useState(null);

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
        date: new Date().toISOString().slice(0, 16),
        selectedBill: null, // Track which bill to pay
        selectedBillType: null // Track bill type (pathology_bill, pharmacy_bill, etc.)
    });

    const formatVisitRows = (rows = [], kind = "opd") => {
        return rows.map((r) => {
            const net = Number(r.net_amount ?? r.total_amount ?? 0);
            const paid = Number(r.paid_amount || 0);
            const pk = kind === "ipd" ? r.ipd_id : r.opd_id;
            return {
                ...r,
                id: r.id ?? pk,
                opd_id: r.opd_id ?? (kind === "opd" ? pk : undefined),
                ipd_id: r.ipd_id ?? (kind === "ipd" ? pk : undefined),
                net,
                net_amount: net,
                paid,
                balance: net - paid,
            };
        });
    };

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
                    photo: patient.photo, // Add patient photo
                    opdNo: "OPDN" + (caseObj.id + 7500),
                    appointmentDate: new Date(caseObj.created_at).toLocaleString(),
                    guardianName: patient.emergency_contact_name || "N/A",
                    age: patient.age || "N/A",
                    creditLimit: "5000.00",
                });

                // Fetch Charges and Payments
                const [chargesRes, paymentsRes, pathoRes, radioRes, pharmRes, ambuRes, opdRes, ipdRes] = await Promise.all([
                    getPatientCharges(patient.id, caseObj.case_id),
                    getPatientPayments(patient.id, caseObj.case_id),
                    getPathologyBills(null, null, caseObj.case_id),
                    getRadiologyBills(null, null, caseObj.case_id),
                    getPharmacyBills({ case_id: caseObj.case_id }),
                    getAmbulanceBills(null, null, caseObj.case_id),
                    getOpdPatientList({ case_id: caseObj.case_id }),
                    getIpdPatientList({ case_id: caseObj.case_id })
                ]);

                setCharges(chargesRes.data || []);
                setPayments(paymentsRes.data || []);
                setPathologyBills(pathoRes.data || []);
                setRadiologyBills(radioRes.data || []);
                setPharmacyBills(pharmRes.data || []);
                setAmbulanceBills(ambuRes.data || []);
                setOpdRows(formatVisitRows(opdRes.data || [], "opd"));
                setIpdRows(formatVisitRows(ipdRes.data || [], "ipd"));
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

    const calculateTotalBalance = () => {
        const pathBalance = pathologyBills.reduce((sum, b) => sum + parseFloat(b.balance || 0), 0);
        const radBalance = radiologyBills.reduce((sum, b) => sum + parseFloat(b.balance || 0), 0);
        const pharmBalance = pharmacyBills.reduce((sum, b) => sum + parseFloat(b.balance_amount || 0), 0);
        const ambBalance = ambulanceBills.reduce((sum, b) => sum + parseFloat(b.balance || 0), 0);
        const opdBalance = opdRows.reduce((sum, r) => sum + parseFloat(r.balance || 0), 0);
        const ipdBalance = ipdRows.reduce((sum, r) => sum + parseFloat(r.balance || 0), 0);

        return pathBalance + radBalance + pharmBalance + ambBalance + opdBalance + ipdBalance;
    };

    const handleAddPayment = async () => {
        if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
            notify("error", "Please enter a valid amount");
            return;
        }

        try {
            const payAmt = parseFloat(paymentData.amount);
            const totalBalance = calculateTotalBalance();
            const fullSettlement =
                activeTab === "All" && totalBalance > 0 && payAmt + 0.01 >= totalBalance;

            if (fullSettlement) {
                await postCaseBillingPayment({
                    patient_id: patientData.id,
                    case_id: patientData.caseId,
                    paid_amount: payAmt.toFixed(2),
                    payment_mode: paymentData.mode,
                    note: paymentData.note || "Full case settlement — all modules",
                    payment_date: paymentData.date.slice(0, 10),
                    settle_all: true,
                });
            } else if (activeTab === "All") {
                const payload = {
                    payment_date: paymentData.date.slice(0, 10),
                    paid_amount: payAmt.toFixed(2),
                    payment_mode: paymentData.mode,
                    note: paymentData.note || "Partial / on-account payment",
                    case: patientData.case_id_internal,
                    service_type: "General",
                };
                await createPatientPayment(patientData.id, payload);
            } else if (paymentData.selectedBill) {
                const payload = {
                    payment_date: paymentData.date.slice(0, 10),
                    paid_amount: payAmt.toFixed(2),
                    payment_mode: paymentData.mode,
                    note: paymentData.note || `${activeTab} payment`,
                    case: patientData.case_id_internal,
                    service_type: activeTab,
                };
                await createPatientPayment(patientData.id, payload);
                // If a specific bill was selected in a module tab, update that bill directly
                const amount = parseFloat(paymentData.amount);
                if (activeTab === "Pathology") {
                    const bill = pathologyBills.find(b => b.id === parseInt(paymentData.selectedBill));
                    if (bill) await updatePathologyBill(bill.id, { paid_amount: (parseFloat(bill.paid_amount || 0) + amount).toString() });
                }
                else if (activeTab === "Radiology") {
                    const bill = radiologyBills.find(b => b.id === parseInt(paymentData.selectedBill));
                    if (bill) await updateRadiologyBill(bill.id, { paid_amount: (parseFloat(bill.paid_amount || 0) + amount).toString() });
                }
                else if (activeTab === "Pharmacy") {
                    const bill = pharmacyBills.find(b => b.id === parseInt(paymentData.selectedBill));
                    if (bill) await updatePharmacyBill(bill.id, { paid_amount: (parseFloat(bill.paid_amount || 0) + amount).toString() });
                }
                else if (activeTab === "Ambulance") {
                    const bill = ambulanceBills.find(b => b.id === parseInt(paymentData.selectedBill));
                    if (bill) await updateAmbulanceBill(bill.id, { paid_amount: (parseFloat(bill.paid_amount || 0) + amount).toString() });
                }
                else if (activeTab === "OPD") {
                    const visit = opdRows.find(
                        (r) =>
                            String(r.opd_id) === String(paymentData.selectedBill) ||
                            String(r.id) === String(paymentData.selectedBill)
                    );
                    if (visit) {
                        const newPaid = parseFloat(visit.paid_amount || 0) + amount;
                        await updateOpdPatient(visit.id || visit.opd_id, {
                            paid_amount: newPaid.toFixed(2),
                        });
                    }
                }
                else if (activeTab === "IPD") {
                    const adm = ipdRows.find(
                        (r) =>
                            String(r.ipd_id) === String(paymentData.selectedBill) ||
                            String(r.id) === String(paymentData.selectedBill)
                    );
                    if (adm) {
                        const newPaid = parseFloat(adm.paid_amount || 0) + amount;
                        await updateIpdPatient(adm.id || adm.ipd_id, {
                            paid_amount: newPaid.toFixed(2),
                        });
                    }
                }
            } else if (activeTab !== "All") {
                await createPatientPayment(patientData.id, {
                    payment_date: paymentData.date.slice(0, 10),
                    paid_amount: payAmt.toFixed(2),
                    payment_mode: paymentData.mode,
                    note: paymentData.note || `${activeTab} — on account`,
                    case: patientData.case_id_internal,
                    service_type: activeTab,
                });
            }

            notify("success", "Payment added successfully");
            setShowAddPayment(false);
            setPaymentData({
                date: new Date().toISOString().slice(0, 16),
                amount: "",
                mode: "Cash",
                note: "",
                selectedBill: null,
                selectedBillType: null
            });
            fetchDetails(patientData.caseId);
        } catch (err) {
            console.error("Error adding payment:", err);
            const d = err.response?.data;
            let msg = "Failed to add payment";
            if (typeof d === "string") msg = d;
            else if (d?.detail) msg = typeof d.detail === "string" ? d.detail : JSON.stringify(d.detail);
            notify("error", msg);
        }
    };

    useEffect(() => {
        const fetchHeaders = async () => {
            try {
                const res = await getHeaders();
                if (res.data && res.data.length > 0) {
                    setHeaderData(res.data[0]);
                }
            } catch (error) {
                console.error("Error fetching bill headers:", error);
            }
        };
        fetchHeaders();

        if (location.state?.caseId) {
            setSearchCaseId(location.state.caseId);
            fetchDetails(location.state.caseId);
        }
    }, [location.state]);

    const handlePrintBill = () => {
        if (!patientData || charges.length === 0) return;

        const totalCharges = charges.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
        const totalPayments = payments.reduce((sum, p) => sum + parseFloat(p.paid_amount || 0), 0);
        const balance = totalCharges - totalPayments;

        const content = `
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #6046B5; padding-bottom: 5px; margin-bottom: 20px;">
                <h2 style="margin:0; color:#6046B5; font-size:20px;">FINAL BILL / RECEIPT</h2>
                <div style="text-align:right; font-size:12px; font-weight:bold;">
                    <div>Case ID: ${patientData.caseId}</div>
                    <div>Date: ${new Date().toLocaleDateString()}</div>
                </div>
            </div>

            <div class="data-grid" style="background:#f9f9f9; padding:15px; border-radius:8px; border:1px solid #eee; margin-bottom:20px;">
                <div class="data-item"><span class="data-label">Patient Name</span><span class="data-value">: ${patientData.name}</span></div>
                <div class="data-item"><span class="data-label">Age / Gender</span><span class="data-value">: ${patientData.age} / ${patientData.gender}</span></div>
                <div class="data-item"><span class="data-label">Phone</span><span class="data-value">: ${patientData.phone}</span></div>
                <div class="data-item"><span class="data-label">Appointment</span><span class="data-value">: ${patientData.appointmentDate}</span></div>
            </div>

            <div class="report-section-title">Billing Breakdown</div>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Description</th>
                        <th style="text-align:right">Subtotal ($)</th>
                        <th style="text-align:right">Discount ($)</th>
                        <th style="text-align:right">Tax ($)</th>
                        <th style="text-align:right">Total ($)</th>
                    </tr>
                </thead>
                <tbody>
                    ${charges.map((c, idx) => `
                        <tr>
                            <td>${idx + 1}</td>
                            <td>
                                <div style="font-weight:600">${c.charge_name}</div>
                                <div style="font-size:10px; color:#666;">${c.charge_type}</div>
                            </td>
                            <td style="text-align:right">${Number(c.standard_charge || 0).toFixed(2)}</td>
                            <td style="text-align:right">${Number(c.discount || 0).toFixed(2)}</td>
                            <td style="text-align:right">${Number(c.tax || 0).toFixed(2)}</td>
                            <td style="text-align:right; font-weight:600">${Number(c.amount || 0).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div style="display:flex; justify-content:flex-end; margin-top:30px;">
                <div style="width:280px; font-size:13px; line-height:1.8;">
                    <div style="display:flex; justify-content:space-between;"><span>Grand Total</span><span>$${totalCharges.toFixed(2)}</span></div>
                    <div style="display:flex; justify-content:space-between; color:green;"><span>Total Paid</span><span>$${totalPayments.toFixed(2)}</span></div>
                    <div style="display:flex; justify-content:space-between; font-weight:bold; color:${balance > 0 ? 'red' : 'green'}; border-top:1px solid #eee; margin-top:5px; padding-top:5px;">
                        <span>Final Balance</span><span>$${balance.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div class="signature-section" style="margin-top:50px;">
                <div class="sig-box">
                    <div class="sig-line"></div>
                    <div class="sig-label">Patient/Guardian Signature</div>
                </div>
                <div class="sig-box">
                    <div class="sig-line"></div>
                    <div class="sig-label">Authorised Accountant</div>
                </div>
            </div>
        `;

        printReport({
            title: `Final Bill - ${patientData.caseId}`,
            headerImg: headerData?.opd_bill_header, // Generic billing header or OPD bill header
            footerText: headerData?.opd_bill_footer,
            content: content
        });
    };




    const calculateTotals = (rows) => {
        return rows.reduce((acc, r) => {
            acc.net += r.net;
            acc.paid += r.paid;
            acc.balance += r.balance;
            return acc;
        }, { net: 0, paid: 0, balance: 0 });
    };

    const opdTotals = calculateTotals(opdRows);
    const ipdTotals = calculateTotals(ipdRows);

    return (
        <AdminLayout>
            <div className="p-4 bg-gray-50 min-h-screen">
                <div className="bg-white rounded shadow-sm overflow-hidden mb-6 border-t-2 border-gray-200">
                    {/* TOP HEADER */}
                    <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-white">
                        <h2 className="text-gray-700 font-semibold">Billing Through Case Id</h2>
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
                                    className="border border-gray-300 rounded px-3 py-1 focus:border-[#6046B5] focus:outline-none focus:ring-0.5 focus:ring-[#8A63D2]"
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
                                        {patientData.photo ? (
                                            <img
                                                src={patientData.photo}
                                                alt="Patient"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // Fallback to default avatar if image fails to load
                                                    e.target.onerror = null;
                                                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(patientData.name) + "&size=200&background=6046B5&color=fff";
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200">
                                                <div className="text-center">
                                                    <div className="text-4xl font-bold text-purple-600">
                                                        {patientData.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="text-xs text-purple-500 mt-1">No Photo</div>
                                                </div>
                                            </div>
                                        )}
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
                            {/* <div className="flex items-center">
                                <button
                                    onClick={() => setShowGenerateBill(true)}
                                    className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-2 text-sm rounded-l flex items-center gap-1 shadow"
                                >
                                    <FileText size={16} /> Generate Bill
                                </button>
                            </div> */}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="p-6">
                        {activeTab === "All" && (
                            <div className="space-y-6">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                                        <p className="text-gray-500 text-xs font-semibold uppercase">Total Charges</p>
                                        <p className="text-2xl font-bold">${(calculateTotalBalance() + payments.reduce((s, p) => s + parseFloat(p.paid_amount || 0), 0)).toFixed(2)}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                                        <p className="text-gray-500 text-xs font-semibold uppercase">Total Paid</p>
                                        <p className="text-2xl font-bold">${payments.reduce((s, p) => s + parseFloat(p.paid_amount || 0), 0).toFixed(2)}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
                                        <p className="text-gray-500 text-xs font-semibold uppercase">Total Balance</p>
                                        <div className="flex justify-between items-end">
                                            <p className="text-2xl font-bold text-red-600">${calculateTotalBalance().toFixed(2)}</p>
                                            {calculateTotalBalance() > 0 && (
                                                <button
                                                    onClick={() => {
                                                        setPaymentData({
                                                            ...paymentData,
                                                            amount: calculateTotalBalance().toFixed(2),
                                                            note: "Full settlement for all services"
                                                        });
                                                        setShowAddPayment(true);
                                                    }}
                                                    className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200 transition-colors"
                                                >
                                                    Pay All
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
                                        <p className="text-gray-500 text-xs font-semibold uppercase">Services Summary</p>
                                        <p className="text-sm font-medium">Items: {pathologyBills.length + radiologyBills.length + pharmacyBills.length + ambulanceBills.length + opdRows.length + ipdRows.length}</p>
                                    </div>
                                </div>

                                {/* Consolidated Bills Table */}
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-700">Consolidated Billing Breakdown</h3>
                                        <button
                                            onClick={() => setShowSummary(true)}
                                            className="flex items-center text-sm text-[#6046B5] hover:underline"
                                        >
                                            <Printer size={16} className="mr-1" /> Full Summary Report
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-100 border-b uppercase text-xs font-bold text-gray-600">
                                                <tr>
                                                    <th className="px-4 py-3 text-center">#</th>
                                                    <th className="px-4 py-3">Service Module</th>
                                                    <th className="px-4 py-3">Bill/Visit ID</th>
                                                    <th className="px-4 py-3 text-right">Net Amount</th>
                                                    <th className="px-4 py-3 text-right">Paid</th>
                                                    <th className="px-4 py-3 text-right">Balance</th>
                                                    <th className="px-4 py-3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {[
                                                    ...pathologyBills.map(b => ({ ...b, module: "Pathology", displayId: `BILL#${b.id}` })),
                                                    ...radiologyBills.map(b => ({ ...b, module: "Radiology", displayId: `BILL#${b.id}` })),
                                                    ...pharmacyBills.map(b => ({ ...b, module: "Pharmacy", displayId: `BILL#${b.id}`, amount: b.net_amount, balance: b.balance_amount })),
                                                    ...ambulanceBills.map(b => ({ ...b, module: "Ambulance", displayId: `BILL#${b.id}`, amount: b.net_amount, balance: b.balance })),
                                                    ...opdRows.map(r => ({ ...r, module: "OPD", displayId: `VISIT#${r.opd_id}`, amount: r.net_amount || r.total_amount, balance: r.balance })),
                                                    ...ipdRows.map(r => ({ ...r, module: "IPD", displayId: `ADM#${r.ipd_id}`, amount: r.net_amount || r.total_amount, balance: r.balance }))
                                                ].map((item, idx) => (
                                                    <tr key={`consolidated-${item.module}-${item.id || idx}`} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 text-center text-gray-400">{idx + 1}</td>
                                                        <td className="px-4 py-3 font-medium">{item.module}</td>
                                                        <td className="px-4 py-3">{item.displayId}</td>
                                                        <td className="px-4 py-3 text-right">${parseFloat(item.amount || 0).toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-right text-green-600">${parseFloat(item.paid_amount || 0).toFixed(2)}</td>
                                                        <td className="px-4 py-3 text-right font-semibold text-red-600">${parseFloat(item.balance || 0).toFixed(2)}</td>
                                                        <td className="px-4 py-3">
                                                            {parseFloat(item.balance || 0) <= 0 ? (
                                                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Paid</span>
                                                            ) : (
                                                                <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">Pending</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {pathologyBills.length + radiologyBills.length + pharmacyBills.length + ambulanceBills.length + opdRows.length + ipdRows.length === 0 && (
                                                    <tr>
                                                        <td colSpan="7" className="px-4 py-10 text-center text-gray-400">No billing records found for this case.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                            <tfoot className="bg-gray-50 font-bold border-t">
                                                <tr>
                                                    <td colSpan="5" className="px-4 py-3 text-right uppercase text-xs">Grand Total Balance:</td>
                                                    <td className="px-4 py-3 text-right text-lg text-red-600">${calculateTotalBalance().toFixed(2)}</td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>

                                {/* Recent Transactions Section */}
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                                        <h3 className="font-semibold text-gray-700">Recent Transactions</h3>
                                        <button onClick={() => setShowViewPayments(true)} className="text-xs text-[#6046B5] hover:underline">View All</button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-sm">
                                            <thead className="bg-gray-100 border-b text-gray-600">
                                                <tr>
                                                    <th className="px-4 py-3">Date</th>
                                                    <th className="px-4 py-3">Mode</th>
                                                    <th className="px-4 py-3">Type</th>
                                                    <th className="px-4 py-3 text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {payments.slice(0, 5).map((p) => (
                                                    <tr key={p.id}>
                                                        <td className="px-4 py-2">{p.payment_date}</td>
                                                        <td className="px-4 py-2">{p.payment_mode}</td>
                                                        <td className="px-4 py-2 text-xs">
                                                            <span className="bg-purple-50 text-purple-600 px-2 py-0.5 rounded">{p.service_type || "General"}</span>
                                                        </td>
                                                        <td className="px-4 py-2 text-right font-medium">${parseFloat(p.paid_amount || 0).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "OPD" && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-[13px] whitespace-nowrap">
                                    <thead className="bg-[#f2f2f2] text-gray-700 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="px-3 py-2 text-left ">Date</th>
                                            <th className="px-3 py-2 text-left">Charge Name</th>
                                            <th className="px-3 py-2 text-left">Charge Category</th>
                                            <th className="px-3 py-2 text-left">Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Discount ($)</th>
                                            <th className="px-3 py-2 text-left">Tax ($)</th>
                                            <th className="px-3 py-2 text-left">Net Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Paid Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Balance ($)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 border-b border-gray-300">
                                        {opdRows.length > 0 ? opdRows.map((row, idx) => (
                                            <tr key={`opd-${row.id || idx}`} className="hover:bg-gray-50">
                                                <td className="px-3 py-2 text-gray-600 font-medium whitespace-nowrap">
                                                    {new Date(row.appointment_date || row.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-3 py-2 text-gray-600 font-medium">{row.charge_name}</td>
                                                <td className="px-3 py-2 text-gray-600 font-medium">{row.charge_category}</td>
                                                <td className="px-3 py-2 text-gray-600 font-medium">{Number(row.amount || 0).toFixed(2)}</td>
                                                <td className="px-3 py-2 text-gray-600 font-medium">{Number(row.discount || 0).toFixed(2)}</td>
                                                <td className="px-3 py-2 text-gray-600 font-medium">{Number(row.tax || 0).toFixed(2)}</td>
                                                <td className="px-3 py-2 font-semibold text-gray-800">
                                                    {row.net.toFixed(2)}
                                                </td>
                                                <td className="px-3 py-2 text-green-600 font-semibold">
                                                    {row.paid.toFixed(2)}
                                                </td>
                                                <td className="px-3 py-2 text-red-600 font-semibold">
                                                    {row.balance.toFixed(2)}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="9" className="text-center py-6 text-gray-400">
                                                    No OPD charges found
                                                </td>
                                            </tr>
                                        )}

                                        <tr className="bg-gray-100 font-bold border-b border-gray-300">
                                            <td colSpan="6" className="text-right px-3 py-2 text-gray-800">Total :</td>
                                            <td className="px-3 py-2 text-gray-800">${opdTotals.net.toFixed(2)}</td>
                                            <td className="px-3 py-2 text-green-600">${opdTotals.paid.toFixed(2)}</td>
                                            <td className="px-3 py-2 text-red-600">${opdTotals.balance.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "IPD" && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-[13px] whitespace-nowrap">
                                    <thead className="bg-[#f2f2f2] text-gray-700 font-semibold border-b border-gray-300">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Date</th>
                                            <th className="px-3 py-2 text-left">Charge Name</th>
                                            <th className="px-3 py-2 text-left">Charge Category</th>
                                            <th className="px-3 py-2 text-left">Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Discount ($)</th>
                                            <th className="px-3 py-2 text-left">Tax ($)</th>
                                            <th className="px-3 py-2 text-left">Net Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Paid Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Balance ($)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 border-b border-gray-300">
                                        {ipdRows.length > 0 ? ipdRows.map((row, idx) => (
                                            <tr key={`ipd-${row.id || idx}`} className="hover:bg-gray-50 border-b border-gray-300">
                                                <td className="px-3 py-2 text-gray-600 font-medium whitespace-nowrap">
                                                    {new Date(row.admission_date || row.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-3 py-2 text-gray-600 font-medium">{row.charge_name || "IPD Admission"}</td>
                                                <td className="px-3 py-2 text-gray-600 font-medium">{row.charge_category || "General Ward"}</td>
                                                <td className="px-3 py-2 text-gray-600 font-medium">{Number(row.amount || 0).toFixed(2)}</td>
                                                <td className="px-3 py-2 text-gray-600 font-medium">{Number(row.discount || 0).toFixed(2)}</td>
                                                <td className="px-3 py-2 text-gray-600 font-medium">{Number(row.tax || 0).toFixed(2)}</td>
                                                <td className="px-3 py-2 font-semibold text-gray-800">
                                                    {row.net.toFixed(2)}
                                                </td>
                                                <td className="px-3 py-2 text-green-600 font-semibold">
                                                    {row.paid.toFixed(2)}
                                                </td>
                                                <td className="px-3 py-2 text-red-600 font-semibold">
                                                    {row.balance.toFixed(2)}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="9" className="text-center py-6 text-gray-400">
                                                    No IPD charges found
                                                </td>
                                            </tr>
                                        )}

                                        <tr className="bg-gray-100 font-bold border-b border-gray-100">
                                            <td colSpan="6" className="text-right px-3 py-2 text-gray-800">Total :</td>
                                            <td className="px-3 py-2 text-gray-800">${ipdTotals.net.toFixed(2)}</td>
                                            <td className="px-3 py-2 text-green-600">${ipdTotals.paid.toFixed(2)}</td>
                                            <td className="px-3 py-2 text-red-600">${ipdTotals.balance.toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "Pharmacy" && (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-left text-[13px] whitespace-nowrap">
                                    <thead className="bg-[#f2f2f2] text-gray-700 font-semibold border-b border-gray-300">
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
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 border-b border-gray-300">
                                        {pharmacyBills.length > 0 ? (
                                            pharmacyBills.map((bill) => (
                                                <tr key={bill.id} className="hover:bg-gray-50 border-b border-gray-300 cursor-pointer">
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.id}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{new Date(bill.bill_date).toLocaleDateString()}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.doctor_name || "N/A"}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.total_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.discount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.tax || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-800 font-medium font-bold">{Number(bill.net_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-green-600 font-medium font-bold">{Number(bill.paid_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-red-600 font-medium font-bold">{Number(bill.balance_amount || 0).toFixed(2)}</td>
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
                                    <thead className="bg-[#f2f2f2] text-gray-700 font-semibold border-b border-gray-300">
                                        <tr>
                                            <th className="px-3 py-2 text-left">Bill No</th>
                                            <th className="px-3 py-2 text-left">Date</th>
                                            <th className="px-3 py-2 text-left">Doctor</th>
                                            <th className="px-3 py-2 text-left">Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Discount ($)</th>
                                            <th className="px-3 py-2 text-left">Net Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Paid Amount ($)</th>
                                            <th className="px-3 py-2 text-left">Balance ($)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 border-b border-gray-300">
                                        {pathologyBills.length > 0 ? (
                                            pathologyBills.map((bill) => (
                                                <tr key={bill.id} className="hover:bg-gray-50 border-b border-gray-300 cursor-pointer">
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.id}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.date || new Date(bill.created_at).toLocaleDateString()}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.doctor_name || "N/A"}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.total_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.discount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-800 font-medium font-bold">{Number(bill.total_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-green-600 font-medium font-bold">{Number(bill.paid_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-red-600 font-medium font-bold">{Number(bill.balance || 0).toFixed(2)}</td>
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
                                    <thead className="bg-[#f2f2f2] text-gray-700 font-semibold border-b border-gray-300">
                                        <tr>
                                            <th className="px-3 py-2 text-left ">Bill No</th>
                                            <th className="px-3 py-2 text-left ">Date</th>
                                            <th className="px-3 py-2 text-left ">Doctor</th>
                                            <th className="px-3 py-2 text-left ">Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Discount ($)</th>
                                            <th className="px-3 py-2 text-left ">Net Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Paid Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Balance ($)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {radiologyBills.length > 0 ? (
                                            radiologyBills.map((bill) => (
                                                <tr key={bill.id} className="hover:bg-gray-50 border-b border-gray-300 cursor-pointer">
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.id}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.date || new Date(bill.created_at).toLocaleDateString()}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.doctor_name || "N/A"}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.total_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{Number(bill.discount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-gray-800 font-medium font-bold">{Number(bill.total_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-green-600 font-medium font-bold">{Number(bill.paid_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-red-600 font-medium font-bold">{Number(bill.balance || 0).toFixed(2)}</td>
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
                                    <thead className="bg-[#f2f2f2] text-gray-700 font-semibold border-b border-gray-300">
                                        <tr>
                                            <th className="px-3 py-2 text-left ">Bill No</th>
                                            <th className="px-3 py-2 text-left ">Vehicle No</th>
                                            <th className="px-3 py-2 text-left ">Date</th>
                                            <th className="px-3 py-2 text-left ">Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Paid Amount ($)</th>
                                            <th className="px-3 py-2 text-left ">Balance Amount ($)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {ambulanceBills.length > 0 ? (
                                            ambulanceBills.map((bill) => (
                                                <tr key={bill.id} className="hover:bg-gray-50 border-b border-gray-300 cursor-pointer">
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.id || "N/A"}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.ambulance_number || bill.vehicle_no || "N/A"}</td>
                                                    <td className="px-3 py-3 text-gray-600 font-medium">{bill.date || new Date(bill.created_at).toLocaleDateString()}</td>
                                                    <td className="px-3 py-3 text-gray-800 font-medium font-bold">{Number(bill.net_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-green-600 font-medium font-bold">{Number(bill.paid_amount || 0).toFixed(2)}</td>
                                                    <td className="px-3 py-3 text-red-600 font-medium font-bold">{Number(bill.balance || 0).toFixed(2)}</td>
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
                                        step="0.01"
                                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6046B5]"
                                        value={paymentData.amount}
                                        onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                                        placeholder="Enter amount"
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

                            {/* Bill Selector based on active tab */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Select Bill to Pay <span className="text-gray-500 text-xs">(Optional)</span>
                                </label>
                                <select
                                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#6046B5]"
                                    value={paymentData.selectedBill || ""}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        let billType = null;
                                        let balanceAmount = "";

                                        if (selectedId) {
                                            // Determine bill type based on active tab
                                            if (activeTab === "Pathology") {
                                                billType = "pathology_bill";
                                                const bill = pathologyBills.find(b => b.id === parseInt(selectedId));
                                                balanceAmount = bill ? Number(bill.balance || 0).toFixed(2) : "";
                                            }
                                            else if (activeTab === "Radiology") {
                                                billType = "radiology_bill";
                                                const bill = radiologyBills.find(b => b.id === parseInt(selectedId));
                                                balanceAmount = bill ? Number(bill.balance || 0).toFixed(2) : "";
                                            }
                                            else if (activeTab === "Pharmacy") {
                                                billType = "pharmacy_bill";
                                                const bill = pharmacyBills.find(b => b.id === parseInt(selectedId));
                                                balanceAmount = bill ? Number(bill.balance_amount || 0).toFixed(2) : "";
                                            }
                                            else if (activeTab === "Ambulance") {
                                                billType = "ambulance_bill";
                                                const bill = ambulanceBills.find(b => b.id === parseInt(selectedId));
                                                balanceAmount = bill ? Number(bill.balance || 0).toFixed(2) : "";
                                            }
                                            else if (activeTab === "OPD") {
                                                billType = "opd_patient";
                                                const visit = opdRows.find(r => r.opd_id === parseInt(selectedId));
                                                balanceAmount = visit ? Number(visit.balance || 0).toFixed(2) : "";
                                            }
                                            else if (activeTab === "IPD") {
                                                billType = "ipd_patient";
                                                const admission = ipdRows.find(r => r.ipd_id === parseInt(selectedId));
                                                balanceAmount = admission ? Number(admission.balance || 0).toFixed(2) : "";
                                            }
                                        }

                                        setPaymentData({
                                            ...paymentData,
                                            selectedBill: selectedId || null,
                                            selectedBillType: billType,
                                            amount: balanceAmount // Auto-fill amount with balance
                                        });
                                    }}
                                >
                                    <option value="">General Payment (No specific bill)</option>

                                    {activeTab === "Pathology" && pathologyBills.filter(b => b.balance > 0).map(bill => (
                                        <option key={bill.id} value={bill.id}>
                                            Bill #{bill.id} - Balance: ${Number(bill.balance || 0).toFixed(2)}
                                        </option>
                                    ))}

                                    {activeTab === "Radiology" && radiologyBills.filter(b => b.balance > 0).map(bill => (
                                        <option key={bill.id} value={bill.id}>
                                            Bill {bill.id} - Balance: ${Number(bill.balance || 0).toFixed(2)}
                                        </option>
                                    ))}

                                    {activeTab === "Pharmacy" && pharmacyBills.filter(b => b.balance_amount > 0).map(bill => (
                                        <option key={bill.id} value={bill.id}>
                                            Bill {bill.id} - Balance: ${Number(bill.balance_amount || 0).toFixed(2)}
                                        </option>
                                    ))}


                                    {activeTab === "Ambulance" && ambulanceBills.filter(b => b.balance > 0).map(bill => (
                                        <option key={bill.id} value={bill.id}>
                                            Bill {bill.id} - Balance: ${Number(bill.balance || 0).toFixed(2)}
                                        </option>
                                    ))}

                                    {activeTab === "OPD" && opdRows.filter(r => r.balance > 0).map(row => (
                                        <option key={row.opd_id} value={row.opd_id}>
                                            OPD Visit {row.opd_id} - Balance: ${Number(row.balance || 0).toFixed(2)}
                                        </option>
                                    ))}

                                    {activeTab === "IPD" && ipdRows.filter(r => r.balance > 0).map(row => (
                                        <option key={row.ipd_id} value={row.ipd_id}>
                                            IPD Admission {row.ipd_id} - Balance: ${Number(row.balance || 0).toFixed(2)}
                                        </option>
                                    ))}
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[85vh] flex flex-col animate-zoom-in">
                        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded-t-lg sticky top-0 z-10 shrink-0">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <IndianRupee size={22} />
                                Payment History
                            </h3>
                            <button
                                onClick={() => setShowViewPayments(false)}
                                className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                            <div className="overflow-x-auto thin-scrollbar">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Date</th>
                                            <th className="px-4 py-2 font-semibold text-gray-700">Service Type</th>
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
                                                    <td className="px-4 py-2">
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                            {p.service_type || 'General'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-2">{p.note || "-"}</td>
                                                    <td className="px-4 py-2">{p.payment_mode}</td>
                                                    <td className="px-4 py-2 text-right">{p.paid_amount}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-10 text-center text-gray-400">No payments found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot className="bg-gray-50 font-semibold border-t">
                                        <tr>
                                            <td colSpan="4" className="px-2 py-2 text-right">Total</td>
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-zoom-in">
                        {/* Header with Print/Close */}
                        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded-t-lg sticky top-0 z-10 shrink-0">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <FileText size={22} />
                                Consolidated Bill
                            </h3>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handlePrintBill}
                                    className="hover:bg-white/20 p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold border border-white/30"
                                >
                                    <Printer size={18} /> Print
                                </button>
                                <button
                                    onClick={() => setShowGenerateBill(false)}
                                    className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-y-auto custom-scrollbar p-8">
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
                            <div className="overflow-x-auto mb-6 thin-scrollbar">
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
                pathologyBills={pathologyBills}
                radiologyBills={radiologyBills}
                pharmacyBills={pharmacyBills}
                ambulanceBills={ambulanceBills}
                opdRows={opdRows}
                ipdRows={ipdRows}
            />

        </AdminLayout>
    );
}

export default BillingDetails;
