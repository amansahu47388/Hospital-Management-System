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
      {/* PAGE BACKGROUND THEME (no gradients on text itself) */}
      <div className="min-h-screen  py-4 md:py-6">
        <IPDHeaderNavbar />
        <div className="max-w-7xl mx-auto px-2 md:px-4 space-y-4 md:space-y-6">
          {/* TOP HEADER + SUMMARY CARD */}
          <section className="bg-white rounded-lg shadow-md p-4 md:p-6">
            {/* Top nav-like row (Overview etc.) */}
            <div className="flex flex-wrap items-center gap-4 border-b pb-3 mb-4">
              <span className="flex items-center gap-2 text-blue-600 font-semibold text-sm md:text-base border-b-2 border-blue-500 pb-1">
                <Eye size={16} /> Overview
              </span>
              <span className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                <Activity size={16} /> Nurse Notes
              </span>
              <span className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                <Pill size={16} /> Medication
              </span>
              <span className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                <FileText size={16} /> Prescription
              </span>
              <span className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                <Users size={16} /> Consultant Register
              </span>
              <span className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                <Beaker size={16} /> Lab Investigation
              </span>
              <span className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                <Scissors size={16} /> Operations
              </span>
              <span className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                <Receipt size={16} /> Charges
              </span>
              <span className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                <CreditCard size={16} /> Payment
              </span>
              <span className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                <Home size={16} /> Bed History
              </span>
              <span className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                <Clock size={16} /> Timeline
              </span>
              <span className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                <History size={16} /> Treatment History
              </span>
              <span className="flex items-center gap-2 text-gray-600 text-sm md:text-base">
                <Heart size={16} /> Vitals
              </span>
            </div>

            {/* Patient top area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LEFT: basic patient details */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                    {/* avatar placeholder */}
                    <User size={48} className="text-gray-500" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">
                      {patient.name}
                    </h2>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Gender:</span>{" "}
                      {patient.gender}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Age:</span> {patient.age}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Guardian Name:</span>{" "}
                      {patient.guardianName}
                    </p>
                    <p className="text-sm text-gray-700 flex items-center gap-1">
                      <Phone size={14} /> {patient.phone}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mt-4">
                  <div>
                    <p className="font-semibold text-gray-700">Case ID</p>
                    <p className="text-gray-800">{patient.caseId}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">IPD No</p>
                    <p className="text-gray-800">{patient.ipdNo}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-700">
                      Admission Date
                    </p>
                    <p className="text-gray-800">{patient.admissionDate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold text-gray-700">Bed</p>
                    <p className="text-gray-800">{patient.bed}</p>
                  </div>
                </div>
              </div>

              {/* RIGHT: payment / billing summary + simple medication list */}
              <div className="space-y-4">
                {/* Top payment bars */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                  {[
                    ["IPD PAYMENT/BILLING", paymentSummary.ipd],
                    ["PHARMACY PAYMENT/BILLING", paymentSummary.pharmacy],
                    ["PATHOLOGY PAYMENT/BILLING", paymentSummary.pathology],
                    ["RADIOLOGY PAYMENT/BILLING", paymentSummary.radiology],
                    ["BLOOD BANK PAYMENT/BILLING", paymentSummary.bloodBank],
                    ["AMBULANCE PAYMENT/BILLING", paymentSummary.ambulance],
                  ].map(([label, item]) => (
                    <div key={label}>
                      <p className="font-semibold text-gray-700">{label}</p>
                      <div className="flex justify-between text-gray-600 mt-1">
                        <span>{item.percent}</span>
                        <span>{item.amount}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-sky-500"
                          style={{ width: item.percent }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Medication table (right side bottom) */}
                <div id="medication" className="mt-4">
                  <h3 className="text-sm md:text-base font-bold text-gray-900 mb-2">
                    MEDICATION
                  </h3>
                  <div className="overflow-x-auto border rounded-md">
                    <table className="min-w-full text-xs md:text-sm">
                      <thead className="bg-gray-100 text-gray-700 text-left">
                        <tr>
                          <th className="px-3 py-2">Date</th>
                          <th className="px-3 py-2">Medicine Name</th>
                          <th className="px-3 py-2">Dose</th>
                          <th className="px-3 py-2">Time</th>
                          <th className="px-3 py-2">Remark</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medications.map((m, idx) => (
                          <tr
                            key={idx}
                            className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="px-3 py-2">{m.date}</td>
                            <td className="px-3 py-2">{m.name}</td>
                            <td className="px-3 py-2">{m.dose}</td>
                            <td className="px-3 py-2">{m.time}</td>
                            <td className="px-3 py-2">{m.remark}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CURRENT VITALS + PRESCRIPTION / FINDING */}
          <section className="bg-white rounded-lg shadow-md p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* VITALS LEFT */}
            <div id="vitals">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Heart size={18} className="text-rose-500" />
                Current Vitals
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Height</span>
                  <span>{patient.vitals.height}</span>
                </div>
                <div className="flex justify-between">
                  <span>Weight</span>
                  <span>{patient.vitals.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pulse</span>
                  <span>{patient.vitals.pulse}</span>
                </div>
                <div className="flex justify-between">
                  <span>Temperature</span>
                  <span>{patient.vitals.temperature}</span>
                </div>
                <div className="flex justify-between">
                  <span>BP</span>
                  <span>{patient.vitals.bp}</span>
                </div>
                <div className="flex justify-between">
                  <span>BMI</span>
                  <span>{patient.vitals.bmi}</span>
                </div>
              </div>

              <div className="mt-4" id="allergies">
                <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                  <Activity size={16} /> Known Allergies:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700">
                  {patient.allergies.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4" id="finding">
                <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                  <FileText size={16} /> Finding:
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {patient.finding}
                </p>
              </div>

              <div className="mt-4" id="symptoms">
                <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                  <Activity size={16} /> Symptoms:
                </h4>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {patient.symptoms.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* PRESCRIPTION RIGHT */}
            <div id="prescription">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                Prescription
              </h3>
              <div className="overflow-x-auto border rounded-md text-sm">
                <table className="min-w-full">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="px-3 py-2">Prescription No</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Finding</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptions.map((p, idx) => (
                      <tr
                        key={p.no}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-3 py-2">{p.no}</td>
                        <td className="px-3 py-2">{p.date}</td>
                        <td className="px-3 py-2">{p.finding}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* NURSE NOTES + LAB INVESTIGATIONS */}
          <section className="bg-white rounded-lg shadow-md p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nurse Notes */}
            <div id="nurse-notes">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Activity size={18} className="text-indigo-500" />
                Nurse Notes
              </h3>
              <div className="space-y-3">
                {nurseNotes.map((n, i) => (
                  <div
                    key={i}
                    className="border rounded-md p-3 bg-gray-50 text-sm"
                  >
                    <div className="flex justify-between text-gray-600 mb-1">
                      <span>{n.by}</span>
                      <span>{n.time}</span>
                    </div>
                    <p className="text-gray-800">
                      <span className="font-semibold">Note: </span>
                      {n.note}
                    </p>
                    <p className="text-gray-800 mt-1">
                      <span className="font-semibold">Comment: </span>
                      {n.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lab Investigations */}
            <div id="lab">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Beaker size={18} className="text-green-600" />
                Lab Investigations
              </h3>
              <div className="overflow-x-auto border rounded-md text-sm">
                <table className="min-w-full">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="px-3 py-2">Test Name</th>
                      <th className="px-3 py-2">Lab</th>
                      <th className="px-3 py-2">Sample Collected</th>
                      <th className="px-3 py-2">Expected Date</th>
                      <th className="px-3 py-2">Approved By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labInvestigations.map((l, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-3 py-2">{l.testName}</td>
                        <td className="px-3 py-2">{l.lab}</td>
                        <td className="px-3 py-2">{l.sample}</td>
                        <td className="px-3 py-2">{l.expectedDate}</td>
                        <td className="px-3 py-2">{l.approvedBy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* OPERATIONS (and you can add Charges / Payments / Timeline / etc. similarly) */}
          <section className="bg-white rounded-lg shadow-md p-4 md:p-6" id="operations">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Scissors size={18} className="text-rose-600" />
              Operation
            </h3>
            <div className="overflow-x-auto border rounded-md text-sm">
              <table className="min-w-full">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-3 py-2">Reference No</th>
                    <th className="px-3 py-2">Operation Date</th>
                    <th className="px-3 py-2">Operation Name</th>
                    <th className="px-3 py-2">Operation Category</th>
                    <th className="px-3 py-2">OT Technician</th>
                  </tr>
                </thead>
                <tbody>
                  {operations.map((o, idx) => (
                    <tr
                      key={o.ref}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-3 py-2">{o.ref}</td>
                      <td className="px-3 py-2">{o.date}</td>
                      <td className="px-3 py-2">{o.name}</td>
                      <td className="px-3 py-2">{o.category}</td>
                      <td className="px-3 py-2">{o.technician}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* You can add similar sections for Charges, Payment, Bed History, Timeline, Treatment History, etc. */}
        </div>
      </div>
    </PatientLayout>
  );
}