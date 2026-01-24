import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import {
  Phone,
  Mail,
  MapPin,
  Activity,
  Droplet,
  TrendingUp,
  User,
  DollarSign,
  Loader2
} from "lucide-react";
import IPDHeader from "../../components/ipd/IPDHeader";
import IPDProfileModal from "../../components/ipd/IPDProfile";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import { getIpdPatientDetail, updateIpdPatient } from "../../api/ipdApi";
import { getPatientVitals, updatePatient } from "../../api/patientApi";
import { useNotify } from "../../context/NotificationContext";

export default function IPDComprehensive() {
  const { ipdId } = useParams();
  const notify = useNotify();
  const [loading, setLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const ipdRes = await getIpdPatientDetail(ipdId);
      const ipdDetail = ipdRes.data;

      let vitals = [];
      try {
        const vitalsRes = await getPatientVitals(ipdDetail.patient);
        vitals = vitalsRes.data;
      } catch (e) {
        console.error("Vitals fetch error:", e);
      }

      // Map backend data to frontend structure
      const mapped = mapData(ipdDetail, vitals);
      setPatientData(mapped);
    } catch (error) {
      console.error("Fetch error:", error);
      notify("error", "Failed to fetch patient data");
    } finally {
      setLoading(false);
    }
  };

  const mapData = (ipd, vitals = []) => {
    const p = ipd.patient_detail || {};
    const d = ipd.doctor_detail || {};
    const b = ipd.bed || {};
    const latestVital = vitals[0] || {};

    const normalizedGender = p.gender === "M" ? "Male" : p.gender === "F" ? "Female" : p.gender === "O" ? "Other" : p.gender;

    return {
      id: p.id,
      ipdId: ipd.ipd_id,
      name: p.full_name || `${p.first_name} ${p.last_name}`,
      firstName: p.first_name,
      lastName: p.last_name,
      age: p.age || "N/A",
      gender: normalizedGender || "N/A",
      phone: p.phone || "N/A",
      email: p.email || "N/A",
      address: p.address || "N/A",
      guardianName: p.emergency_contact_name || "N/A",
      maritalStatus: "Single",
      bloodGroup: p.blood_group || "N/A",
      photo: p.photo,
      symptoms: ipd.symptom_name || "No symptoms recorded",
      knownAllergies: [
        ...(p.allergies ? p.allergies.split(",") : []),
        ...(ipd.allergies ? ipd.allergies.split(",") : [])
      ].map(a => a.trim()).filter((v, i, a) => v && a.indexOf(v) === i),
      tpa: "N/A",
      tpaId: "N/A",
      tpaValidity: "N/A",
      remarks: ipd.previous_medical_issue || "No remarks",
      nationalIdNumber: "N/A",

      vitals: {
        height: latestVital.height ? `${latestVital.height} cm` : "N/A",
        weight: latestVital.weight ? `${latestVital.weight} kg` : "N/A",
        bmi: latestVital.height && latestVital.weight ? (latestVital.weight / ((latestVital.height / 100) ** 2)).toFixed(2) : "N/A",
        bloodPressure: latestVital.bp || "N/A",
        temperature: latestVital.temperature ? `${latestVital.temperature} °F` : "N/A",
        heartRate: latestVital.pulse ? `${latestVital.pulse} bpm` : "N/A",
      },

      admission: {
        date: ipd.created_at ? new Date(ipd.created_at).toLocaleString() : "N/A",
        ipdNumber: ipd.ipd_id ? `IPDN${ipd.ipd_id}` : "N/A",
        caseId: ipd.case_id || "N/A",
        consultant: d.full_name ? `${d.full_name} (${d.id})` : "N/A",
        bed: b.name || "N/A",
        bedGroup: b.bed_group_name || "N/A",
        floor: "N/A",
      },
      status: ipd.is_discharged ? "Discharged" : "Active",
    };
  };

  useEffect(() => {
    if (ipdId) fetchAllData();
  }, [ipdId]);

  const handleProfileSave = async (updatedFormData) => {
    try {
      setLoading(true); // Show loader during updates

      // 1. Prepare Patient Personal Info
      const patientFields = {
        first_name: updatedFormData.firstName,
        last_name: updatedFormData.lastName,
        gender: updatedFormData.gender,
        phone: updatedFormData.phone,
        email: updatedFormData.email,
        address: updatedFormData.address,
        blood_group: updatedFormData.bloodGroup,
        allergies: updatedFormData.knownAllergies, // This updates global patient allergies
        emergency_contact_name: updatedFormData.guardianName,
      };

      // 2. Prepare IPD Specific Info
      // Note: We don't send 'symptom' here because it's a string from the form 
      // but the backend expects a ForeignKey ID. We update 'previous_medical_issue' instead.
      const ipdFields = {
        previous_medical_issue: updatedFormData.remarks,
        allergies: updatedFormData.knownAllergies, // Also update IPD-specific allergies field
      };

      // 3. Run updates in parallel
      await Promise.all([
        updatePatient(patientData.id, patientFields),
        updateIpdPatient(ipdId, ipdFields)
      ]);

      notify("success", "Profile updated successfully");
      fetchAllData();
      setShowProfileModal(false);
    } catch (error) {
      console.error("Update error:", error);
      const errorMsg = error.response?.data
        ? Object.values(error.response.data).flat().join(", ")
        : "Failed to update profile";
      notify("error", errorMsg);
      throw error; // Re-throw to keep modal's saving state accurate if needed
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <Loader2 className="animate-spin text-purple-600" size={48} />
        </div>
      </AdminLayout>
    );
  }

  if (!patientData) {
    return (
      <AdminLayout>
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-500">Patient not found.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen pt-1 md:pt-6 pb-6 bg-gray-50/30">
        {/* Header Section */}
        <IPDHeader patient={patientData} onEditClick={() => setShowProfileModal(true)} />

        {/* Tabs Navbar */}
        <div className="mx-4 md:mx-6">
          <IPDTabsNavbar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        <div className="bg-white mx-4 md:mx-6 rounded-b-lg shadow-lg p-4 md:p-6 min-h-[400px]">
          {/* OVERVIEW TAB (Conditional rendering can be added for other tabs if they share this page) */}
          <div className="space-y-6 animate-in fade-in duration-500">
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
            </div>

            {/* Allergies and Symptoms Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Activity size={20} className="text-red-600" />
                  Known Allergies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {patientData.knownAllergies.length > 0 ? (
                    patientData.knownAllergies.map((allergy, idx) => (
                      <span
                        key={idx}
                        className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic text-sm">No known allergies</span>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp size={20} className="text-yellow-600" />
                  Symptoms
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {patientData.symptoms.length > 200
                    ? `${patientData.symptoms.substring(0, 200)}...`
                    : patientData.symptoms}
                </p>
                {patientData.symptoms.length > 200 && (
                  <details className="mt-2">
                    <summary className="text-blue-600 cursor-pointer text-sm font-medium">
                      View Full Symptoms
                    </summary>
                    <p className="mt-2 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                      {patientData.symptoms}
                    </p>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <IPDProfileModal
          patient={patientData}
          onClose={() => setShowProfileModal(false)}
          onSave={handleProfileSave}
        />
      )}
    </AdminLayout>
  );
}
