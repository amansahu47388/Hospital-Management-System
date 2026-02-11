import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import OPDHeader from "../../../components/Patient_module/OPD/OPDHeader";
import { User as UserIcon, Activity, AlertCircle, FileText, Stethoscope, Clock, History, Microscope } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { getPatientDetail, getPatientVitals } from "../../../api/patientApi";
import { getOpdPatientList } from "../../../api/opdApi";
import { getPathologyBills } from "../../../api/pathologyApi";
import { getRadiologyBills } from "../../../api/radiologyApi";

export default function OPDOverview() {
    const { user } = useAuth();
    const [patientData, setPatientData] = useState(null);
    const [vitals, setVitals] = useState([]);
    const [visits, setVisits] = useState([]);
    const [labInvestigations, setLabInvestigations] = useState([]);
    const [loading, setLoading] = useState(true);

    const patientId = user?.patient_id || user?.id;

    useEffect(() => {
        if (patientId) {
            fetchAllData();
        }
    }, [patientId]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [patientRes, vitalsRes, visitsRes, pathRes, radRes] = await Promise.all([
                getPatientDetail(patientId),
                getPatientVitals(patientId),
                getOpdPatientList({ patient_id: patientId }),
                getPathologyBills("", patientId),
                getRadiologyBills("", patientId)
            ]);

            setPatientData(patientRes.data);
            setVitals(vitalsRes.data);
            setVisits(visitsRes.data);

            // Combine pathology and radiology bills for Lab Investigation
            const combinedLabs = [
                ...(pathRes.data || []).map(bill => ({
                    test: bill.items?.[0]?.test_name || "Pathology Test",
                    caseId: bill.case_id || "N/A",
                    lab: "Pathology",
                    collected: bill.created_by_name || "N/A",
                    expected: bill.items?.[0]?.report_date || "N/A",
                    approved: bill.doctor_name || "N/A",
                    date: bill.created_at
                })),
                ...(radRes.data || []).map(bill => ({
                    test: bill.items?.[0]?.test_name || "Radiology Test",
                    caseId: bill.case_id || "N/A",
                    lab: "Radiology",
                    collected: bill.created_by_name || "N/A",
                    expected: bill.items?.[0]?.report_date || "N/A",
                    approved: bill.doctor_name || "N/A",
                    date: bill.created_at
                }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date));

            setLabInvestigations(combinedLabs);
        } catch (error) {
            console.error("❌ Error fetching OPD overview data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Calculate BMI if height and weight are available
    const getLatestVital = (label) => {
        return vitals.find(v => v[label.toLowerCase()])?.[label.toLowerCase()];
    };

    const currentVitals = [
        { label: "Height", value: getLatestVital("Height") ? `${getLatestVital("Height")} Centimeters` : "N/A", status: "Normal", date: vitals[0]?.vital_date, color: "bg-[#72B01D]" },
        { label: "Weight", value: getLatestVital("Weight") ? `${getLatestVital("Weight")} Kilograms` : "N/A", status: "Normal", date: vitals[0]?.vital_date, color: "bg-[#72B01D]" },
        { label: "Pulse", value: getLatestVital("Pulse") ? `${getLatestVital("Pulse")} Beats per` : "N/A", status: "Normal", date: vitals[0]?.vital_date, color: "bg-[#72B01D]" },
        { label: "Temperature", value: getLatestVital("Temperature") ? `${getLatestVital("Temperature")} Fahrenheit` : "N/A", status: "Normal", date: vitals[0]?.vital_date, color: "bg-[#72B01D]" },
        { label: "BP", value: getLatestVital("BP") ? `${getLatestVital("BP")} mmHg` : "N/A", status: "Normal", date: vitals[0]?.vital_date, color: "bg-[#72B01D]" },
    ];

    if (loading) {
        return (
            <PatientLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6046B5]"></div>
                </div>
            </PatientLayout>
        );
    }

    return (
        <PatientLayout>
            <div className="max-w-[1600px] mx-auto px-1 py-2 font-sans">
                <OPDHeader />

                <div className="bg-white rounded-b-lg shadow-sm border-x border-b border-gray-200 p-6 min-h-[800px]">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* LEFT COLUMN: Patient Context */}
                        <div className="w-full lg:w-[40%] space-y-8 border-r border-gray-100 pr-0 lg:pr-8">

                            {/* Profile Section */}
                            <div>
                                <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 border-b border-gray-100 pb-2">
                                    {patientData?.full_name} ({patientData?.id})
                                </h2>
                                <div className="flex gap-6">
                                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 shrink-0 bg-gray-50 flex items-center justify-center">
                                        {patientData?.photo ? (
                                            <img src={patientData.photo} alt="Patient" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserIcon size={48} className="text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2 text-[13px]">
                                        <div className="grid grid-cols-2">
                                            <span className="text-gray-500 font-medium">Gender</span>
                                            <span className="text-gray-800 font-semibold">{patientData?.gender}</span>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <span className="text-gray-500 font-medium">Age</span>
                                            <span className="text-gray-800 font-semibold">{patientData?.age}</span>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <span className="text-gray-500 font-medium">Guardian Name</span>
                                            <span className="text-gray-800 font-semibold">{patientData?.emergency_contact_name || "N/A"}</span>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <span className="text-gray-500 font-medium">Phone</span>
                                            <span className="text-gray-800 font-semibold">{patientData?.phone}</span>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <span className="text-gray-500 font-medium">Blood Group</span>
                                            <span className="text-gray-800 font-semibold">{patientData?.blood_group}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Vitals Section */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
                                    <Activity size={16} className="text-gray-400" /> Current Vitals:
                                </h3>
                                <div className="space-y-3">
                                    {currentVitals.map((vital, idx) => (
                                        <div key={idx} className="flex items-start justify-between text-[12px] group">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-600 w-24">{vital.label}</span>
                                                {vital.date && <span className="text-[10px] text-gray-400 font-medium">{vital.date}</span>}
                                            </div>
                                            <div className="flex-1 flex justify-between items-center ml-4">
                                                <span className="text-gray-800 font-semibold">{vital.value}</span>
                                                {vital.value !== "N/A" && (
                                                    <span className={`${vital.color} text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase`}>
                                                        {vital.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Known Allergies */}
                            <div className="space-y-2">
                                <h3 className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
                                    <AlertCircle size={16} className="text-gray-400" /> Known Allergies:
                                </h3>
                                <p className="text-[13px] text-gray-600 pl-2">
                                    {patientData?.allergies || "No known allergies"}
                                </p>
                            </div>

                            {/* Symptoms */}
                            <div className="space-y-2 text-[13px]">
                                <h3 className="flex items-center gap-2 font-bold text-gray-700 uppercase">
                                    <Stethoscope size={16} className="text-gray-400" /> Latest Symptoms:
                                </h3>
                                <p className="text-gray-600 italic leading-relaxed pl-2">
                                    {visits[0]?.symptom_details?.symptom_title || "None recorded in recent visit"}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Overview Content */}
                        <div className="flex-1 space-y-10">

                            {/* Visit Details Section */}
                            <div id="visits-section" className="space-y-4">
                                <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-wide">Visit Details</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-[12px] border-collapse">
                                        <thead>
                                            <tr className="text-left bg-gray-50/50 text-gray-600 border-b font-bold">
                                                <th className="px-3 py-3">OPD No</th>
                                                <th className="px-3 py-3">Checkup ID</th>
                                                <th className="px-3 py-3">Appointment Date</th>
                                                <th className="px-3 py-3">Consultant</th>
                                                <th className="px-3 py-3">Reference Symptoms</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {visits.length > 0 ? visits.slice(0, 5).map((visit, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-3 py-4 text-[#6046B5] font-semibold">OPDN{visit.opd_id}</td>
                                                    <td className="px-3 py-4 text-gray-800">{visit.checkup_id}</td>
                                                    <td className="px-3 py-4 text-gray-600">{formatDate(visit.appointment_date)}</td>
                                                    <td className="px-3 py-4 text-gray-800 font-medium">{visit.doctor_name}</td>
                                                    <td className="px-3 py-4 text-gray-500 max-w-xs truncate">{visit.symptom_details?.symptom_title || "N/A"}</td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="5" className="px-3 py-4 text-center text-gray-500 italic">No visit records found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Lab Investigation Section */}
                            <div id="lab-section" className="space-y-4">
                                <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-wide">Lab Investigation</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-[12px] border-collapse">
                                        <thead>
                                            <tr className="text-left bg-gray-50/50 text-gray-600 border-b font-bold">
                                                <th className="px-3 py-3">Test Name</th>
                                                <th className="px-3 py-3 text-center">Case ID</th>
                                                <th className="px-3 py-3">Lab</th>
                                                <th className="px-3 py-3">Sample Collected</th>
                                                <th className="px-3 py-3">Expected Date</th>
                                                <th className="px-3 py-3">Approved By</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {labInvestigations.length > 0 ? labInvestigations.slice(0, 5).map((lab, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-3 py-4 text-[#6046B5] font-semibold">{lab.test}</td>
                                                    <td className="px-3 py-4 text-center text-gray-800">{lab.caseId}</td>
                                                    <td className="px-3 py-4 text-gray-600">{lab.lab}</td>
                                                    <td className="px-3 py-4 text-gray-500 max-w-xs leading-relaxed italic">{lab.collected}</td>
                                                    <td className="px-3 py-4 text-gray-600">{lab.expected}</td>
                                                    <td className="px-3 py-4 text-gray-500 max-w-xs leading-relaxed italic">{lab.approved}</td>
                                                </tr>
                                            )) : (
                                                <tr>
                                                    <td colSpan="6" className="px-3 py-4 text-center text-gray-500 italic">No lab records found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/*Treatment Side-by-Side */}
                            <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
                                {/* Treatment History */}
                                <div id="treatment-section" className="space-y-4">
                                    <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-wide">Treatment History</h2>
                                    <div className="overflow-x-auto border-l border-gray-100 pl-4">
                                        <table className="w-full text-[11px] border-collapse">
                                            <thead>
                                                <tr className="text-left bg-gray-50/50 text-gray-600 border-b font-bold uppercase">
                                                    <th className="px-2 py-2">OPD No</th>
                                                    <th className="px-2 py-2">Case ID</th>
                                                    <th className="px-2 py-2">Date</th>
                                                    <th className="px-2 py-2">Consultant</th>
                                                    <th className="px-2 py-3">Symptoms</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {visits.length > 0 ? visits.map((visit, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-2 py-3 text-[#6046B5] font-semibold">OPDN{visit.opd_id}</td>
                                                        <td className="px-2 py-3 text-gray-800">{visit.checkup_id}</td>
                                                        <td className="px-2 py-3 text-gray-600">{formatDate(visit.appointment_date).split(',')[0]}</td>
                                                        <td className="px-2 py-3 text-gray-800 font-medium whitespace-nowrap">{visit.doctor_name?.split(' ')[0]}</td>
                                                        <td className="px-2 py-3 text-gray-500 line-clamp-2 max-w-[120px]">{visit.symptom_details?.symptom_title || "N/A"}</td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="5" className="px-2 py-3 text-center text-gray-500 italic">No treatment history found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
}
