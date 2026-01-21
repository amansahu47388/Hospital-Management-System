import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import {
  FileText,
  Edit2,
  Download,
  Phone,
  Mail,
  MapPin,
  Heart,
  Activity,
  Droplet,
  TrendingUp,
  Calendar,
  Clock,
  User,
  DollarSign,
  Pill,
  Stethoscope,
  X,
  Save,
} from "lucide-react";
import IPDHeader from "../../components/ipd/IPDHeader";
import IPDProfileModal from "../../components/ipd/IPDProfileModal";
import OPDTabsNavbar from "../../components/OPDComponent/OPDTabsNavbar";

export default function OPDComprehensivePage() {
  // State for patient data (mock data - replace with API calls)
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock patient data
  const patientData = {
    id: 1166,
    name: "Jack Edwards",
    age: "17 Year, 0 Month, 21 Day",
    gender: "Male",
    phone: "08089795676",
    email: "jack900@gmail.com",
    address: "MR.Road CA",
    guardianName: "Wilson",
    maritalStatus: "Single",
    bloodGroup: "B+",
    photo: null,
    symptoms:
      "Cramps and injuries Muscle pain: Muscle spasms, cramps and injuries can all cause muscle pain. Some infections or tumors may also lead to muscle pain. Tendon and ligament pain: Ligaments and tendons are strong bands of tissue that connect your joints and bones. Sprains, strains and overuse injuries can lead to tendon or ligament pain.",
    knownAllergies: ["Dust"],
    tpa: "Health Life Insurance",
    tpaId: "889789",
    tpaValidity: "10/16/2028",
    remarks: "left hand mark",
    nationalIdNumber: "890089098080",

    vitals: {
      height: "180 Centimeters",
      weight: "85 Kilograms",
      bmi: "22.23",
      bloodPressure: "120/80",
      temperature: "98.6°F",
      heartRate: "72 bpm",
    },

    admission: {
      date: "01/12/2026 04:55 PM",
      ipdNumber: "IPDN115",
      caseId: "7635",
      consultant: "Sansa Gomez (9008)",
      bed: "TF - 106",
      bedGroup: "General Ward Male",
      floor: "3rd Floor",
    },

    medications: [
      {
        date: "01/16/2026",
        medicine: "Alprovit",
        dose: "1 (CT)",
        time: "05:45 PM",
        remark: "Daily",
      },
      {
        date: "01/15/2026",
        medicine: "Paracetamol",
        dose: "500mg",
        time: "09:00 AM",
        remark: "After meals",
      },
    ],

    prescriptions: [
      {
        prescriptionNo: "IPDP417",
        date: "01/05/2026",
        prescribedBy: "Sansa Gomez (9008)",
        generatedBy: "Super Admin (9001)",
      },
    ],

    labInvestigations: [
      {
        testName: "Abdomen X-rays (AX)",
        lab: "Pathology",
        sampleCollected: "Belina Turner (9005)",
        expectedDate: "01/19/2026",
        approvedBy: "Belina Turner (9005)",
        approvedDate: "01/21/2026",
      },
      {
        testName: "Magnetic resonance imaging (MR)",
        lab: "Radiology",
        sampleCollected: "John Hook (9006)",
        expectedDate: "01/18/2026",
        approvedBy: "John Hook (9006)",
        approvedDate: "01/19/2026",
      },
    ],

    operations: [
      {
        referenceNo: "OTHER512",
        operationDate: "01/22/2026 04:59 PM",
        operationName: "Tooth extraction",
        category: "ENT and Oral Surgery",
        technician: "David",
      },
    ],

    charges: [
      {
        date: "01/20/2026 04:59 PM",
        name: "ICU",
        chargeType: "IPD",
        chargeCategory: "Intensive Care Units",
        qty: "2 Per Day",
        amount: "$1,215.40",
      },
    ],

    payments: [
      {
        transactionId: "TRANID11752",
        date: "01/22/2026 04:59 PM",
        note: "Cash",
        paymentMode: "Cash",
        paidAmount: "$750.00",
      },
    ],

    billing: {
      ipdPayment: { percentage: 61.71, amount: "$750.00/$1215.40" },
      pharmacyPayment: { percentage: 100.0, amount: "$189/$189.00" },
      pathologyPayment: { percentage: 100.0, amount: "$184.08/$184.08" },
      radiologyPayment: { percentage: 100.0, amount: "$198.00/$198.00" },
      bloodBankPayment: { percentage: 100.0, amount: "$121.00/$121.00" },
      ambulancePayment: { percentage: 100.0, amount: "$172.50/$172.50" },
    },
  };

  return (
    <AdminLayout>
      <div className="min-h-screen pt-1 md:pt-6 pb-6">
        {/* Header Section */}
        <IPDHeader patient={patientData} onEditClick={() => setShowProfileModal(true)} />

        {/* Tabs Navbar */}
        <div className="mx-4 md:mx-6">
          <OPDTabsNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div className="bg-white mx-4 md:mx-6 rounded-b-lg shadow-lg p-4 md:p-6">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Patient Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-600 font-medium">Phone</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2 mt-1">
                      <Phone size={18} className="text-blue-600" />
                      {patientData.phone}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2 mt-1">
                      <Mail size={18} className="text-green-600" />
                      {patientData.email}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <p className="text-sm text-gray-600 font-medium">Address</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2 mt-1">
                      <MapPin size={18} className="text-purple-600" />
                      {patientData.address}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                    <p className="text-sm text-gray-600 font-medium">Blood Group</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2 mt-1">
                      <Droplet size={18} className="text-red-600" />
                      {patientData.bloodGroup}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm text-gray-600 font-medium">Guardian</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2 mt-1">
                      <User size={18} className="text-orange-600" />
                      {patientData.guardianName}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
                    <p className="text-sm text-gray-600 font-medium">TPA</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center gap-2 mt-1">
                      <DollarSign size={18} className="text-indigo-600" />
                      {patientData.tpa}
                    </p>
                  </div>
                </div>

                {/* Allergies and Symptoms Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Activity size={20} className="text-red-600" />
                      Known Allergies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {patientData.knownAllergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp size={20} className="text-yellow-600" />
                      Symptoms
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {patientData.symptoms.substring(0, 200)}...
                    </p>
                    <details className="mt-2">
                      <summary className="text-blue-600 cursor-pointer text-sm font-medium">
                        View Full Symptoms
                      </summary>
                      <p className="mt-2 text-gray-700 text-sm leading-relaxed">
                        {patientData.symptoms}
                      </p>
                    </details>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <IPDProfileModal
          patient={patientData}
          onClose={() => setShowProfileModal(false)}
          onSave={() => {
            setShowProfileModal(false);
            // Handle save logic here
          }}
        />
      )}
    </AdminLayout>
  );
}
