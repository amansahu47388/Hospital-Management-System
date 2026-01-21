import React from "react";
import { useParams } from "react-router-dom";
import PatientLayout from "../../../layout/PatientLayout";
import OPDHeader from "../../../components/Patient_module/OPD/OPDHeader";
import { User, Activity, AlertCircle, FileText, Stethoscope, Clock, History, Microscope } from "lucide-react";

export default function PatientOPDHistoryPage() {
    const { section = 'overview' } = useParams();

    // Mock Data based on screenshots
    const patientInfo = {
        name: "OLIVIER THOMAS (1)",
        photo: "C:\\Users\\sahus\\Downloads\\1731677989789.jpeg",
        gender: "Male",
        age: "41 Year, 8 Month, 16 Day",
        guardian: "Edward Thomas",
        phone: "7896541230",
        barcode: "1",
    };

    const vitals = [
        { label: "Height", value: "150 Centimeters", status: "Normal", date: "12/03/2025 12:52 PM", color: "bg-[#72B01D]" },
        { label: "Weight", value: "80 Kilograms", status: "Normal", date: "12/12/2025 08:00 PM", color: "bg-[#72B01D]" },
        { label: "Pulse", value: "75 Beats per", status: "Normal", date: "09/08/2025 09:00 PM", color: "bg-[#72B01D]" },
        { label: "Temperature", value: "94 Fahrenheit", status: "Low", date: "11/08/2025 05:42 PM", color: "bg-[#F29C11]" },
        { label: "BP", value: "96 mmHg", status: "High", date: "11/10/2025 03:30 PM", color: "bg-[#E74C3C]" },
        { label: "BMI", value: "35.56", color: "bg-[#72B01D]" },
    ];

    const visits = [
        { opdNo: "OPDN7549", caseId: "7577", date: "01/01/2026 03:46 PM", consultant: "Amit Singh (9009)", symptoms: "Thirst. Thirst is the feeling of needing to drink something..." },
        { opdNo: "OPDN7491", caseId: "7519", date: "12/01/2025 03:10 PM", consultant: "Amit Singh (9009)", symptoms: "Atopic dermatitis (Eczema)..." },
        { opdNo: "OPDN7432", caseId: "7460", date: "11/10/2025 05:46 PM", consultant: "Sonia Bush (9002)", symptoms: "Cramps and injuries..." },
    ];

    const labInvestigations = [
        { test: "Chest X-rays (C)", caseId: "115", lab: "Pathology", collected: "Belina Turner (9005) In-House Pathology Lab 06/25/2025", expected: "06/26/2025", approved: "Belina Turner (9005) 06/26/2025" },
        { test: "Abdomen X-rays (AX)", caseId: "115", lab: "Pathology", collected: "", expected: "06/26/2025", approved: "" },
    ];

    const timeline = [
        { date: "01/06/2026 05:58 PM", title: "Take medicine after meal everyday", description: "Take medicine after meal everyday" },
        { date: "12/05/2025 12:51 PM", title: "Take medicine after meal everyday.", description: "Take medicine after meal everyday." },
    ];

    return (
        <PatientLayout>
            <div className="max-w-[1600px] mx-auto px-1 py-2 font-sans">
                {/* NAVIGATION HEADER */}
                <OPDHeader />

                <div className="bg-white rounded-b-lg shadow-sm border-x border-b border-gray-200 p-6 min-h-[800px]">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* LEFT COLUMN: Patient Context */}
                        <div className="w-full lg:w-[40%] space-y-8 border-r border-gray-100 pr-0 lg:pr-8">

                            {/* Profile Section */}
                            <div>
                                <h2 className="text-sm font-bold text-gray-800 uppercase mb-4 border-b border-gray-100 pb-2">
                                    {patientInfo.name}
                                </h2>
                                <div className="flex gap-6">
                                    <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                        <img src={patientInfo.photo} alt="Patient" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 space-y-2 text-[13px]">
                                        <div className="grid grid-cols-2">
                                            <span className="text-gray-500 font-medium">Gender</span>
                                            <span className="text-gray-800 font-semibold">{patientInfo.gender}</span>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <span className="text-gray-500 font-medium">Age</span>
                                            <span className="text-gray-800 font-semibold">{patientInfo.age}</span>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <span className="text-gray-500 font-medium">Guardian Name</span>
                                            <span className="text-gray-800 font-semibold">{patientInfo.guardian}</span>
                                        </div>
                                        <div className="grid grid-cols-2">
                                            <span className="text-gray-500 font-medium">Phone</span>
                                            <span className="text-gray-800 font-semibold">{patientInfo.phone}</span>
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <span className="text-gray-500 font-medium text-[11px]">Barcode</span>
                                            <div className="flex flex-col items-center">
                                                <div className="h-8 w-24 bg-white border p-1 flex items-center justify-center grayscale opacity-70">
                                                    <div className="flex gap-px h-full items-end">
                                                        {[...Array(15)].map((_, i) => (
                                                            <div key={i} className="bg-black" style={{ width: (i % 3 + 1) + 'px', height: (10 + Math.random() * 20) + 'px' }}></div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-bold">{patientInfo.barcode}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500 font-medium text-[11px]">QR Code</span>
                                            <div className="p-1 border bg-white">
                                                <div className="w-10 h-10 grid grid-cols-5 gap-0.5 opacity-60">
                                                    {[...Array(25)].map((_, i) => (
                                                        <div key={i} className={Math.random() > 0.5 ? 'bg-black' : 'bg-white'}></div>
                                                    ))}
                                                </div>
                                            </div>
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
                                    {vitals.map((vital, idx) => (
                                        <div key={idx} className="flex items-start justify-between text-[12px] group">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-600 w-24">{vital.label}</span>
                                                {vital.date && <span className="text-[10px] text-gray-400 font-medium">{vital.date}</span>}
                                            </div>
                                            <div className="flex-1 flex justify-between items-center ml-4">
                                                <span className="text-gray-800 font-semibold">{vital.value}</span>
                                                {vital.status && (
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
                                <ul className="list-disc list-inside text-[13px] text-gray-600 pl-2">
                                    <li>Dust</li>
                                </ul>
                            </div>

                            {/* Findings */}
                            <div className="space-y-2">
                                <h3 className="flex items-center gap-2 text-[13px] font-bold text-gray-700">
                                    <FileText size={16} className="text-gray-400" /> Findings:
                                </h3>
                                <div className="space-y-3 pl-2">
                                    <p className="text-[12px] text-gray-600 leading-relaxed italic">
                                        • Stomach pain Typhoid fever and paratyphoid fever have similar symptoms. People usually have a sustained fever...
                                    </p>
                                    <p className="text-[12px] text-gray-600 leading-relaxed italic">
                                        • Rosacea Rosacea (roe-ZAY-she-uh) is a common skin condition that causes blushing...
                                    </p>
                                </div>
                            </div>

                            {/* Symptoms */}
                            <div className="space-y-2 text-[13px]">
                                <h3 className="flex items-center gap-2 font-bold text-gray-700 uppercase">
                                    <Stethoscope size={16} className="text-gray-400" /> Symptoms:
                                </h3>
                                <p className="text-gray-600 italic leading-relaxed pl-2">• Cramps and injuries Muscle pain: Muscle spasms...</p>
                            </div>

                            {/* Consultant Doctor */}
                            <div className="space-y-4">
                                <h3 className="text-[13px] font-bold text-gray-700 uppercase border-b border-gray-100 pb-2">Consultant Doctor</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border">
                                            <img src="https://via.placeholder.com/100" alt="Doctor" />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-700">Amit Singh (9009)</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border">
                                            <img src="https://via.placeholder.com/100" alt="Doctor" />
                                        </div>
                                        <span className="text-[13px] font-bold text-gray-700">Sonia Bush (9002)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Section Content */}
                        <div className="flex-1 space-y-10">

                            Visit Details Section
                            {(section === 'overview' || section === 'visits') && (
                                <div id="visits-section" className="space-y-4">
                                    <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-wide">Visit Details</h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-[12px] border-collapse">
                                            <thead>
                                                <tr className="text-left bg-gray-50/50 text-gray-600 border-b font-bold">
                                                    <th className="px-3 py-3">OPD No</th>
                                                    <th className="px-3 py-3">Case ID</th>
                                                    <th className="px-3 py-3">Appointment Date</th>
                                                    <th className="px-3 py-3">Consultant</th>
                                                    <th className="px-3 py-3">Reference Symptoms</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {visits.map((visit, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-3 py-4 text-[#6046B5] font-semibold">{visit.opdNo}</td>
                                                        <td className="px-3 py-4 text-gray-800">{visit.caseId}</td>
                                                        <td className="px-3 py-4 text-gray-600">{visit.date}</td>
                                                        <td className="px-3 py-4 text-gray-800 font-medium">{visit.consultant}</td>
                                                        <td className="px-3 py-4 text-gray-500 max-w-xs">{visit.symptoms}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Lab Investigation Section */}
                            {(section === 'overview' || section === 'lab') && (
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
                                                {labInvestigations.map((lab, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-3 py-4 text-[#6046B5] font-semibold">{lab.test}</td>
                                                        <td className="px-3 py-4 text-center text-gray-800">{lab.caseId}</td>
                                                        <td className="px-3 py-4 text-gray-600">{lab.lab}</td>
                                                        <td className="px-3 py-4 text-gray-500 max-w-xs leading-relaxed italic">{lab.collected}</td>
                                                        <td className="px-3 py-4 text-gray-600">{lab.expected}</td>
                                                        <td className="px-3 py-4 text-gray-500 max-w-xs leading-relaxed italic">{lab.approved}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {/* Timeline & Treatment Side-by-Side */}
                            {(section === 'overview' || section === 'timeline' || section === 'treatment') && (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    {/* Timeline */}
                                    {(section === 'overview' || section === 'timeline') && (
                                        <div id="timeline-section" className="space-y-4">
                                            <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-wide">Timeline</h2>
                                            <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                                                {timeline.map((item, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <div className="absolute -left-[22px] top-0 p-1 bg-white rounded-full border-2 border-[#6046B5] z-10">
                                                            <div className="w-2 h-2 bg-[#6046B5] rounded-full"></div>
                                                        </div>
                                                        <span className="inline-block bg-[#00AEEF] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm mb-2 uppercase">
                                                            {item.date}
                                                        </span>
                                                        <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow">
                                                            <h4 className="text-[13px] font-bold text-[#00AEEF] mb-1">{item.title}</h4>
                                                            <p className="text-[11px] text-gray-500 italic">{item.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Treatment History */}
                                    {(section === 'overview' || section === 'treatment') && (
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
                                                        {visits.map((visit, idx) => (
                                                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                                                <td className="px-2 py-3 text-[#6046B5] font-semibold">{visit.opdNo}</td>
                                                                <td className="px-2 py-3 text-gray-800">{visit.caseId}</td>
                                                                <td className="px-2 py-3 text-gray-600">{visit.date.split(' ')[0]}</td>
                                                                <td className="px-2 py-3 text-gray-800 font-medium whitespace-nowrap">{visit.consultant.split(' ')[0]}</td>
                                                                <td className="px-2 py-3 text-gray-500 line-clamp-2 max-w-[120px]">{visit.symptoms}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Vitals Section (Right Side if explicitly selected) */}
                            {section === 'vitals' && (
                                <div className="space-y-6">
                                    <h2 className="text-[14px] font-bold text-gray-800 uppercase tracking-wide">Vitals Overview</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {vitals.map((vital, idx) => (
                                            <div key={idx} className="bg-gray-50/50 border border-gray-100 rounded-lg p-4 flex flex-col justify-between">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="text-[13px] font-bold text-gray-600">{vital.label}</span>
                                                    {vital.status && (
                                                        <span className={`${vital.color} text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase`}>
                                                            {vital.status}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xl font-bold text-gray-800 mb-1">{vital.value}</div>
                                                <div className="text-[10px] text-gray-400 font-medium">{vital.date || 'Last updated N/A'}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
}
