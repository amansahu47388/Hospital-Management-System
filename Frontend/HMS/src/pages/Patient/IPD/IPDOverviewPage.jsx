// IPDCombinedPage.jsx
import React from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import {
  Phone,
  Mail,
  MapPin,
  Droplet,
  User,
  DollarSign,
  Activity,
  TrendingUp,
  Heart,
  Calendar,
  Clock,
  FileText,
  Pill,
  Users,
  Beaker,
  Scissors,
  Receipt,
  CreditCard,
  Home,
  Eye,
  History,
} from "lucide-react";

export default function IPDCombinedPage() {
  // --------- STATIC MOCK DATA (replace with your API data if needed) ----------
  const patient = {
    name: "OLIVIER THOMAS (1)",
    gender: "Male",
    age: "41 Year 4 Month 30 Days",
    guardianName: "Edward Thomas",
    phone: "7896541230",
    barcode: "IPDN14-115",
    qrCodeText: "IPDN14-QR",
    caseId: "115",
    ipdNo: "IPDN14",
    admissionDate: "12/02/2021 10:00 AM",
    bed: "GF - 101 - VIP Ward - Ground Floor",
    creditLimit: "$20000",
    usedCredit: "$2871.94",
    balanceCredit: "$17128.06",
    vitals: {
      height: "150 Centimeters",
      weight: "80 Kilograms",
      pulse: "75 Beats per min",
      temperature: "94 Fahrenheit",
      bp: "96 mmHg",
      bmi: "35.56",
    },
    allergies: ["No"],
    finding:
      "Elevated temperature (above 100.4°). The medical community generally defines a fever as a body temperature above 100.4 degrees Fahrenheit. A body temp between 100.4 and 102.2 degree is usually considered a low‑grade fever.",
    symptoms: [
      "Feeling sad or down",
      "Personality change in a way that seems different for that person.",
    ],
  };

  const paymentSummary = {
    ipd: { percent: "83.09%", amount: "$5557.00/$6687.61" },
    pharmacy: { percent: "80.91%", amount: "$2923.5/$3613.30" },
    pathology: { percent: "67.25%", amount: "$912.72/$1357.15" },
    radiology: { percent: "76.77%", amount: "$966.39/$1258.79" },
    bloodBank: { percent: "83.98%", amount: "$1650.13/$1964.83" },
    ambulance: { percent: "100.00%", amount: "$1518.00/$1518.00" },
  };

  const medications = [
    {
      date: "07/16/2025",
      name: "Alprovit",
      dose: "1 (CT)",
      time: "02:49 PM",
      remark: "",
    },
    {
      date: "07/18/2025",
      name: "WORMSTOP",
      dose: "1 (Micrometer (oi))",
      time: "04:30 PM",
      remark: "",
    },
  ];

  const prescriptions = [
    {
      no: "IPDP358",
      date: "01/01/2025",
      finding:
        "Elevated temperature (above 100.4°) ... may be considered a low‑grade fever.",
    },
    {
      no: "IPDP362",
      date: "02/05/2025",
      finding:
        "Damaged hair, more than just split ends. Extremely damaged hair develops cracks in the outside layer.",
    },
  ];

  const nurseNotes = [
    {
      time: "08/05/2025 04:45 PM",
      by: "April Clinton (9020)",
      note: "Take medicine after meal everyday also eat one egg daily at morning time.",
      comment: "Same as note.",
    },
    {
      time: "09/05/2025 11:54 AM",
      by: "April Clinton (9020)",
      note: "Take medicine after meal everyday.",
      comment: "Take medicine after meal everyday.",
    },
  ];

  const labInvestigations = [
    {
      testName: "Chest X‑rays (C)",
      lab: "Pathology",
      sample: "Belina Turner (9005)",
      expectedDate: "06/26/2025",
      approvedBy: "Belina Turner (9005)",
    },
    {
      testName: "Abdomen X‑rays (AX)",
      lab: "Pathology",
      sample: "Belina Turner (9005)",
      expectedDate: "08/06/2025",
      approvedBy: "Belina Turner (9005)",
    },
  ];

  const operations = [
    {
      ref: "OTREF275",
      date: "03/08/2025 01:30 PM",
      name: "Dilation and curettage",
      category: "Gynaecology",
      technician: "Faran",
    },
  ];

  // ---------------------------------------------------------------------------
  return (
    <PatientLayout>
      {/* PAGE BACKGROUND THEME */}
      <div className="min-h-screen ">
        <IPDHeaderNavbar />

        <div className="max-w-7xl mx-auto px-2 md:px-0 py-6 space-y-6">

          {/* CURRENT VITALS + PRESCRIPTION */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* VITALS LEFT */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg border-b pb-2">
                <Heart size={20} className="text-rose-500" />
                Current Vitals
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Height</span>
                  <span className="font-semibold">{patient.vitals.height}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-lg border border-gray-100">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-semibold">{patient.vitals.weight}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Pulse</span>
                  <span className="font-semibold">{patient.vitals.pulse}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-lg border border-gray-100">
                  <span className="text-gray-600">Temperature</span>
                  <span className="font-semibold">{patient.vitals.temperature}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">BP</span>
                  <span className="font-semibold">{patient.vitals.bp}</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-lg border border-gray-100">
                  <span className="text-gray-600">BMI</span>
                  <span className="font-semibold">{patient.vitals.bmi}</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                  Known Allergies
                </h4>
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-100 text-sm">
                  {patient.allergies.join(", ")}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                  Finding
                </h4>
                <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-lg border border-blue-100 text-sm leading-relaxed">
                  {patient.finding}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                  Symptoms
                </h4>
                <ul className="space-y-2">
                  {patient.symptoms.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* PRESCRIPTION RIGHT */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg border-b pb-2">
                <FileText size={20} className="text-blue-600" />
                Prescription
              </h3>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 font-medium">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Prescription No</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 rounded-r-lg">Finding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {prescriptions.map((p, idx) => (
                      <tr
                        key={p.no}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-indigo-600">{p.no}</td>
                        <td className="px-4 py-3">{p.date}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={p.finding}>{p.finding}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* NURSE NOTES + LAB INVESTIGATIONS */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nurse Notes */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg border-b pb-2">
                <Activity size={20} className="text-indigo-500" />
                Nurse Notes
              </h3>
              <div className="space-y-4">
                {nurseNotes.map((n, i) => (
                  <div
                    key={i}
                    className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{n.by}</span>
                      <span>{n.time}</span>
                    </div>
                    <p className="text-gray-800 text-sm mb-2">
                      <span className="font-semibold text-gray-900">Note: </span>
                      {n.note}
                    </p>
                    <p className="text-gray-600 text-sm italic border-t pt-2 mt-2">
                      <span className="font-medium not-italic">Comment: </span>
                      {n.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Investigations */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg border-b pb-2">
                <Beaker size={20} className="text-green-600" />
                Lab Investigations
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 font-medium">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Test Name</th>
                      <th className="px-4 py-3">Lab</th>
                      <th className="px-4 py-3">Sample</th>
                      <th className="px-4 py-3 rounded-r-lg">Expected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {labInvestigations.map((l, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">{l.testName}</td>
                        <td className="px-4 py-3 text-gray-600">{l.lab}</td>
                        <td className="px-4 py-3 text-gray-600">{l.sample}</td>
                        <td className="px-4 py-3 text-gray-600">{l.expectedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* OPERATIONS */}
          <section className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg border-b pb-2">
              <Scissors size={20} className="text-rose-600" />
              Operation
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 font-medium">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Reference No</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3 rounded-r-lg">Technician</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {operations.map((o, idx) => (
                    <tr
                      key={o.ref}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-indigo-600">{o.ref}</td>
                      <td className="px-4 py-3 text-gray-600">{o.date}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{o.name}</td>
                      <td className="px-4 py-3 text-gray-600">{o.category}</td>
                      <td className="px-4 py-3 text-gray-600">{o.technician}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </PatientLayout>
  );
}