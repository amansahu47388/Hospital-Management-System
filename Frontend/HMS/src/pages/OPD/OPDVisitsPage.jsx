import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import OPDTabsNavbar from "../../components/OPDComponent/OPDNavbar";
//import IPDHeader from "../../components/ipd/IPDHeader";
import {
    FileText,
    Edit2,
    Trash2,
    Plus,
    Search,
    Download,
    Copy,
    FileSpreadsheet,
    FileIcon as FilePdf,
    X,
    User,
    Save,
    ChevronDown,
    CheckCircle,
} from "lucide-react";

export default function OPDVisitsPage() {
    const [activeTab, setActiveTab] = useState("visits");
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Mock patient data
    const patientData = {
        id: 1166,
        name: "Olivier Thomas (1)",
        age: "41 Year 4 Month 30 Days",
        gender: "Male",
        phone: "7896541230",
        email: "olivier@gmail.com",
        address: "482 Kingsway, Brooklyn West, CA",
        guardianName: "Edward Thomas",
        maritalStatus: "Married",
        bloodGroup: "B+",
        photo: "https://via.placeholder.com/150",
        symptoms: "Injury Treatment",
        knownAllergies: "No",
        tpa: "Health Life Insurance",
        tpaId: "7745855",
        tpaValidity: "11/19/2026",
        remarks: "Injury Treatment",
        nationalIdNumber: "77458596",
        admission: {
            date: "01/19/2026 06:24 PM",
            ipdNumber: "OPDN7608",
            caseId: "7611",
            consultant: "Sonia Bush (9002)",
            bed: "TF - 106",
            bedGroup: "General Ward Male",
        },
        vitals: {
            height: "180 Centimeters",
            weight: "85 Kilograms",
            bmi: "22.23",
            bloodPressure: "120/80",
            temperature: "98.6°F",
            heartRate: "72 bpm",
        },
    };

    const visitsData = [
        {
            id: "CHKID7611",
            date: "01/19/2026 06:24 PM",
            consultant: "Sonia Bush (9002)",
            reference: "",
            symptoms: "",
        },
    ];

    return (
        <AdminLayout>
            <div className="min-h-screen bg-gray-50 pb-10">
                {/* <IPDHeader patient={patientData} onEditClick={() => { }} /> */}

                <OPDTabsNavbar />

                {/* <div className="mx-4 md:mx-6 bg-white rounded-b-lg shadow-xl overflow-hidden min-h-[500px]"> */}
                {/* Page Header */}

                <div className="p-4 md:p-6 ">
                    <div className="bg-white rounded shadow p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="">
                            <h2 className="text-xl font-bold text-gray-800">Checkups</h2>
                            <p className="text-xs text-gray-500 font-medium">{patientData.admission.ipdNumber}</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className=" bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-semibold"
                        >
                            <Plus size={18} />
                            New Checkup
                        </button>
                    </div>


                    {/* Table Actions */}


                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 text-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">OPD Checkup ID</th>
                                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Appointment Date</th>
                                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Consultant</th>
                                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Reference</th>
                                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Symptoms</th>
                                    <th className="px-6 py-4 text-sm font-bold uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white border-b border-gray-200 divide-y divide-gray-100">
                                {visitsData.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors text-gray-600">
                                        <td className="px-6 py-4 text-sm font-medium text-purple-600">{row.id}</td>
                                        <td className="px-6 py-4 text-sm ">{row.date}</td>
                                        <td className="px-6 py-4 text-sm ">{row.consultant}</td>
                                        <td className="px-6 py-4 text-sm ">{row.reference}</td>
                                        <td className="px-6 py-4 text-sm ">{row.symptoms}</td>
                                        <td className="px-6 py-4 text-sm ">
                                            <div className="flex gap-2">
                                                <button className="hover:bg-blue-100 text-blue-500 px-2 py-1 rounded text-xs">
                                                    <FileText size={16} />
                                                </button>
                                                <button className="hover:bg-purple-100 text-purple-500 px-2 py-1 rounded text-xs">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="hover:bg-red-100 text-red-500 px-2 py-1 rounded text-xs">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t border-gray-100 text-xs text-gray-500 flex justify-between items-center">
                        <span>Records: 1 to 1 of 1</span>
                        <div className="flex gap-2">
                            <button className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>&lt;</button>
                            <button className="px-3 py-1 bg-purple-50 text-[#6046B5] border border-purple-100 rounded font-bold shadow-sm">1</button>
                            <button className="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>&gt;</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Checkup Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl my-8 overflow-hidden transform transition-all scale-100">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center">
                            <h3 className="text-white text-xl font-bold flex items-center gap-2">
                                <Plus size={24} />
                                Patient Details
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-white/80 hover:text-white transition-colors p-1"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex flex-col lg:flex-row max-h-[80vh] overflow-y-auto">
                            {/* Left Side: Patient Summary */}
                            <div className="lg:w-1/3 bg-gray-50 p-6 border-r border-gray-200">
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-32 h-32 bg-white rounded-2xl border-4 border-white shadow-xl mb-4 overflow-hidden group">
                                        <img
                                            src={patientData.photo}
                                            alt="patient"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                    <h4 className="text-2xl font-extrabold text-[#6046B5] mb-1">{patientData.name}</h4>
                                    <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-100">
                                        ID: {patientData.id}
                                    </span>
                                </div>

                                <div className="mt-8 space-y-4">
                                    {[
                                        { label: "Guardian Name", value: patientData.guardianName },
                                        { label: "Gender", value: patientData.gender },
                                        { label: "Age", value: patientData.age },
                                        { label: "Phone", value: patientData.phone },
                                        { label: "Email", value: patientData.email },
                                        { label: "Address", value: patientData.address },
                                        { label: "Blood Group", value: patientData.bloodGroup },
                                        { label: "Any Known Allergies", value: patientData.knownAllergies },
                                        { label: "TPA", value: patientData.tpa },
                                        { label: "National ID Number", value: patientData.nationalIdNumber },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex flex-col border-b border-gray-100 pb-2">
                                            <span className="text-[10px] sm:text-xs uppercase font-bold text-gray-400 tracking-wider">
                                                {item.label}
                                            </span>
                                            <span className="text-sm font-semibold text-gray-700">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right Side: Form */}
                            <div className="lg:w-2/3 p-6 sm:p-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Appointment Date */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-700">
                                            Appointment Date <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm"
                                            defaultValue="2026-01-19T18:24"
                                        />
                                    </div>

                                    {/* Case */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-700">Case</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm"
                                        />
                                    </div>

                                    {/* Casualty */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-700">Casualty</label>
                                        <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm">
                                            <option>No</option>
                                            <option>Yes</option>
                                        </select>
                                    </div>

                                    {/* Old Patient */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-700">Old Patient</label>
                                        <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm">
                                            <option>No</option>
                                            <option>Yes</option>
                                        </select>
                                    </div>

                                    {/* Reference */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-700">Reference</label>
                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm"
                                        />
                                    </div>

                                    {/* Consultant Doctor */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-700">
                                            Consultant Doctor <span className="text-red-500">*</span>
                                        </label>
                                        <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm">
                                            <option>Sonia Bush (9002)</option>
                                        </select>
                                    </div>

                                    {/* Charge Category, Charge, etc. */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-700">Charge Category</label>
                                        <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm">
                                            <option>Select</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-700">
                                            Charge <span className="text-red-500">*</span>
                                        </label>
                                        <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm">
                                            <option>Select</option>
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-700">Standard Charge ($)</label>
                                        <input
                                            type="text"
                                            disabled
                                            className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">

                                        <input
                                            type="text"
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm"
                                        />
                                    </div>

                                    {/* Payment Mode */}
                                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                                        <label className="text-sm font-bold text-gray-700">Payment Mode</label>
                                        <select className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm">
                                            <option>Cash</option>
                                            <option>Cheque</option>
                                            <option>Online</option>
                                        </select>
                                    </div>

                                    {/* Symptoms */}
                                    <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-4 mt-2">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs uppercase font-bold text-gray-400">Symptoms Type</label>
                                            <select className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                                                <option>Select</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs uppercase font-bold text-gray-400">Symptoms Title</label>
                                            <input type="text" className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs uppercase font-bold text-gray-400">Symptoms</label>
                                            <textarea className="w-full p-2 border border-gray-300 rounded-lg text-sm" rows="1"></textarea>
                                        </div>
                                    </div>

                                    {/* Note */}
                                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                                        <label className="text-sm font-bold text-gray-700">Note</label>
                                        <textarea
                                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all text-sm"
                                            rows="2"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="tpa" className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                                <label htmlFor="tpa" className="text-sm font-semibold text-gray-700">Apply TPA</label>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2]  text-white px-8 py-2 rounded flex items-center gap-2 transition-all shadow-md font-bold text-xs"
                            >
                                <CheckCircle size={16} />
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
