import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientDetail } from "../../api/patientApi";
import { getOpdPatientList } from "../../api/opdApi";
import { getIpdPatientList } from "../../api/ipdApi";
import { getPathologyBills } from "../../api/pathologyApi";
import { getRadiologyBills } from "../../api/radiologyApi";
import { getPharmacyBills } from "../../api/pharmacyApi";
import { getAmbulanceBills } from "../../api/ambulanceApi";

import {
  User,
  Phone,
  Mail,
  MapPin,
  Droplet,
  Calendar,
  SquareX,
  Edit,
} from "lucide-react";


function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Visit data states
  const [opdVisits, setOpdVisits] = useState([]);
  const [ipdVisits, setIpdVisits] = useState([]);
  const [pathologyBills, setPathologyBills] = useState([]);
  const [radiologyBills, setRadiologyBills] = useState([]);
  const [pharmacyBills, setPharmacyBills] = useState([]);
  const [ambulanceBills, setAmbulanceBills] = useState([]);

  // Loading states for each section
  const [loadingVisits, setLoadingVisits] = useState(false);


  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    setLoading(true);
    try {
      console.log("Fetching patient with ID:", id);
      const response = await getPatientDetail(id);
      console.log("Patient data loaded:", response.data);
      setPatient(response.data);
      // Fetch visit data after patient is loaded
      fetchAllVisitData(id);
    } catch (err) {
      console.error("Error fetching patient:", err);
      navigate("/admin/patients");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllVisitData = async (patientId) => {
    setLoadingVisits(true);
    try {
      // Fetch all visit data in parallel
      const [opdRes, ipdRes, pathologyRes, radiologyRes, pharmacyRes, ambulanceRes] = await Promise.all([
        getOpdPatientList({ patient_id: patientId }).catch(() => ({ data: [] })),
        getIpdPatientList({ patient_id: patientId }).catch(() => ({ data: [] })),
        getPathologyBills("", patientId).catch(() => ({ data: [] })),
        getRadiologyBills("", patientId).catch(() => ({ data: [] })),
        getPharmacyBills({ patient_id: patientId }).catch(() => ({ data: [] })),
        getAmbulanceBills("", patientId).catch(() => ({ data: [] })),
      ]);

      setOpdVisits(opdRes.data || []);
      setIpdVisits(ipdRes.data || []);
      setPathologyBills(pathologyRes.data || []);
      setRadiologyBills(radiologyRes.data || []);
      setPharmacyBills(pharmacyRes.data || []);
      setAmbulanceBills(ambulanceRes.data || []);

      console.log("Visit data loaded:", {
        opd: opdRes.data,
        ipd: ipdRes.data,
        pathology: pathologyRes.data,
        radiology: radiologyRes.data,
        pharmacy: pharmacyRes.data,
        ambulance: ambulanceRes.data,
      });
    } catch (err) {
      console.error("Error fetching visit data:", err);
    } finally {
      setLoadingVisits(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-4">
            <h2 className="text-2xl font-semibold">Patient Details</h2>
          </div>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading patient details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Error state - patient not found
  if (!patient) {
    return (
      <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-4">
            <h2 className="text-2xl font-semibold">Patient Details</h2>
          </div>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">Patient not found</p>
              <button
                onClick={() => navigate("/admin/patients")}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                ← Back to Patients
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* PAGE HEADER */}
        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-2xl font-semibold">Patient Details</h2>

          <div className="flex gap-4 items-center">

            <button
              onClick={() => navigate("/admin/patients")}
              className="hover:opacity-80 transition p-2 rounded hover:bg-white/20"
              title="Close"
            >
              <SquareX size={20} />
            </button>
          </div>
        </div>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* PATIENT INFORMATION CARD */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* LEFT SIDE DETAILS */}
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold">
                  {patient?.full_name} (ID: {patient?.id})
                </h2>

                <p className="flex items-center gap-2 text-gray-700">
                  <User size={18} />
                  <strong>Guardian Name:</strong> {patient?.emergency_contact_name || "N/A"}
                </p>

                <p className="flex items-center gap-4 text-gray-700">
                  <Droplet size={18} />
                  <strong>Blood Group:</strong> {patient?.blood_group || "N/A"}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Calendar size={18} />
                  <strong>Date of Birth:</strong> {patient?.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : "N/A"}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Phone size={18} />
                  <strong>Patient Phone:</strong> {patient?.phone || "N/A"}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Phone size={18} />
                  <strong>Guardian Phone:</strong> {patient?.emergency_contact_phone || "N/A"}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Mail size={18} />
                  <strong>Email:</strong> {patient?.email || "N/A"}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <MapPin size={18} />
                  <strong>Address:</strong> {patient?.address || "N/A"}
                </p>
              </div>

              {/* MIDDLE COLUMN DETAILS */}
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Age (Years):</strong> {patient?.age || "N/A"}
                </p>

                <p>
                  <strong>Gender:</strong> {getGenderDisplay(patient?.gender) || "N/A"}
                </p>

                <p>
                  <strong>City:</strong> {patient?.city || "N/A"}
                </p>

                <p>
                  <strong>State:</strong> {patient?.state || "N/A"}
                </p>

                <p>
                  <strong>Pin Code:</strong> {patient?.zip_code || "N/A"}
                </p>

                <p>
                  <strong>Known Allergies:</strong> {patient?.allergies || "None recorded"}
                </p>

                <p>
                  <strong>Medical History:</strong> {patient?.medical_history || "None recorded"}
                </p>
              </div>

              {/* RIGHT SIDE - PHOTO */}
              <div className="flex justify-center items-center">
                {patient?.photo ? (
                  <div className="text-center">
                    <img
                      src={getImageUrl(patient.photo)}
                      alt="Patient"
                      className="w-32 h-32 object-cover rounded shadow-md"
                      onError={(e) => {
                        console.error("Image failed to load from:", e.target.src);
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ccircle cx="50" cy="35" r="15" fill="%23999"/%3E%3Cpath d="M 20 80 Q 50 60 80 80" fill="%23999"/%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full shadow-md border-4 border-purple-200 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-4xl">👤</span>
                      <p className="text-gray-500 text-xs mt-1">No Photo</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PATIENT VISIT REPORT TITLE */}
          <h2 className="text-center text-xl font-semibold mb-4">
            Patient Visit Report
          </h2>

          {/* OPD DETAILS TABLE */}
          <div className="bg-white p-5 rounded-lg shadow overflow-x-auto mb-5">
            <h3 className="text-lg font-semibold mb-3">OPD Details</h3>

            {loadingVisits ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Loading OPD visits...</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">OPD No</th>
                    <th className="p-2 text-left">Case ID</th>
                    <th className="p-2 text-left">Appointment Date</th>
                    <th className="p-2 text-left">Doctor Name</th>
                    <th className="p-2 text-left">Symptoms</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Paid</th>
                  </tr>
                </thead>

                <tbody>
                  {opdVisits.length > 0 ? (
                    opdVisits.map((visit) => (
                      <tr key={visit.opd_id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-2">{`OPD-${visit.opd_id}`}</td>
                        <td className="p-2">{visit.case_id || "N/A"}</td>
                        <td className="p-2">
                          {visit.appointment_date ? new Date(visit.appointment_date).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-2">
                          {visit.doctor_detail?.full_name || "N/A"}
                        </td>
                        <td className="p-2">{visit.symptom?.name || "N/A"}</td>
                        <td className="p-2">₹{parseFloat(visit.total_amount || 0).toFixed(2)}</td>
                        <td className="p-2">₹{parseFloat(visit.paid_amount || 0).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-4 text-center text-gray-500">No OPD visits found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>



          {/* IPD DETAILS TABLE */}
          <div className="bg-white p-5 rounded-lg shadow overflow-x-auto mb-5">
            <h3 className="text-lg font-semibold mb-3">IPD Details</h3>

            {loadingVisits ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Loading IPD visits...</p>
              </div>
            ) : (
              <table className="w-full text-sm bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">IPD No</th>
                    <th className="p-2 text-left">Case ID</th>
                    <th className="p-2 text-left">Admission Date</th>
                    <th className="p-2 text-left">Doctor Name</th>
                    <th className="p-2 text-left">Symptoms</th>
                    <th className="p-2 text-left">Bed</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {ipdVisits.length > 0 ? (
                    ipdVisits.map((visit) => (
                      <tr key={visit.ipd_id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-2">{visit.checkup_id || `IPD-${visit.ipd_id}`}</td>
                        <td className="p-2">{visit.case_id || "N/A"}</td>
                        <td className="p-2">
                          {visit.admission_date ? new Date(visit.admission_date).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-2">
                          {visit.doctor_detail?.full_name || "N/A"}
                        </td>
                        <td className="p-2">{visit.symptom?.name || "N/A"}</td>
                        <td className="p-2">{visit.bed?.bed_number || "N/A"}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${visit.is_discharged ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {visit.is_discharged ? 'Discharged' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-4 text-center text-gray-500">No IPD visits found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>



          {/* PATHOLOGY DETAILS TABLE */}
          <div className="bg-white p-5 rounded-lg shadow overflow-x-auto mb-5">
            <h3 className="text-lg font-semibold mb-3">Pathology Details</h3>

            {loadingVisits ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Loading pathology bills...</p>
              </div>
            ) : (
              <table className="w-full text-sm bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Bill No</th>
                    <th className="p-2 text-left">Case ID</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Discount %</th>
                    <th className="p-2 text-left">Discount Amount</th>
                    <th className="p-2 text-left">Tax %</th>
                    <th className="p-2 text-left">Tax Amount</th>
                    <th className="p-2 text-left">Paid Amount</th>
                    <th className="p-2 text-left">Balance Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {pathologyBills.length > 0 ? (
                    pathologyBills.map((bill) => (
                      <tr key={bill.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-2">{bill.bill_number || bill.id}</td>
                        <td className="p-2">{bill.case_id || "N/A"}</td>
                        <td className="p-2">
                          {bill.created_at ? new Date(bill.created_at).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-2">₹{parseFloat(bill.total_amount || 0).toFixed(2)}</td>
                        <td className="p-2">{parseFloat(bill.discount_percentage || 0).toFixed(2)}%</td>
                        <td className="p-2">₹{parseFloat(bill.discount_amount || 0).toFixed(2)}</td>
                        <td className="p-2">{parseFloat(bill.tax_percentage || 0).toFixed(2)}%</td>
                        <td className="p-2">₹{parseFloat(bill.tax_amount || 0).toFixed(2)}</td>
                        <td className="p-2">₹{parseFloat(bill.paid_amount || 0).toFixed(2)}</td>
                        <td className="p-2">₹{parseFloat(bill.balance || 0).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="p-4 text-center text-gray-500">No pathology bills found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* RADIOLOGY DETAILS TABLE */}
          <div className="bg-white p-5 rounded-lg shadow overflow-x-auto mb-5">
            <h3 className="text-lg font-semibold mb-3">Radiology Details</h3>

            {loadingVisits ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Loading radiology bills...</p>
              </div>
            ) : (
              <table className="w-full text-sm bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Bill No</th>
                    <th className="p-2 text-left">Case ID</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Discount %</th>
                    <th className="p-2 text-left">Discount Amount</th>
                    <th className="p-2 text-left">Tax %</th>
                    <th className="p-2 text-left">Tax Amount</th>
                    <th className="p-2 text-left">Paid Amount</th>
                    <th className="p-2 text-left">Balance Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {radiologyBills.length > 0 ? (
                    radiologyBills.map((bill) => (
                      <tr key={bill.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-2">{bill.bill_number || bill.id}</td>
                        <td className="p-2">{bill.case_id || "N/A"}</td>
                        <td className="p-2">
                          {bill.created_at ? new Date(bill.created_at).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-2">₹{parseFloat(bill.total_amount || 0).toFixed(2)}</td>
                        <td className="p-2">{parseFloat(bill.discount_percentage || 0).toFixed(2)}%</td>
                        <td className="p-2">₹{parseFloat(bill.discount_amount || 0).toFixed(2)}</td>
                        <td className="p-2">{parseFloat(bill.tax_percentage || 0).toFixed(2)}%</td>
                        <td className="p-2">₹{parseFloat(bill.tax_amount || 0).toFixed(2)}</td>
                        <td className="p-2">₹{parseFloat(bill.paid_amount || 0).toFixed(2)}</td>
                        <td className="p-2">₹{parseFloat(bill.balance || 0).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="p-4 text-center text-gray-500">No radiology bills found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>


          {/* PHARMACY DETAILS TABLE */}
          <div className="bg-white p-5 rounded-lg shadow overflow-x-auto mb-5">
            <h3 className="text-lg font-semibold mb-3">Pharmacy Details</h3>

            {loadingVisits ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Loading pharmacy bills...</p>
              </div>
            ) : (
              <table className="w-full text-sm bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Bill No</th>
                    <th className="p-2 text-left">Case ID</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Discount %</th>
                    <th className="p-2 text-left">Discount Amount</th>
                    <th className="p-2 text-left">Tax %</th>
                    <th className="p-2 text-left">Tax Amount</th>
                    <th className="p-2 text-left">Paid Amount</th>
                    <th className="p-2 text-left">Balance Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {pharmacyBills.length > 0 ? (
                    pharmacyBills.map((bill) => (
                      <tr key={bill.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-2">{bill.bill_number || bill.id}</td>
                        <td className="p-2">{bill.case_id || "N/A"}</td>
                        <td className="p-2">
                          {bill.bill_date ? new Date(bill.bill_date).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-2">₹{parseFloat(bill.total_amount || 0).toFixed(2)}</td>
                        <td className="p-2">{parseFloat(bill.discount_percentage || 0).toFixed(2)}%</td>
                        <td className="p-2">₹{parseFloat(bill.discount_amount || 0).toFixed(2)}</td>
                        <td className="p-2">{parseFloat(bill.tax_percentage || 0).toFixed(2)}%</td>
                        <td className="p-2">₹{parseFloat(bill.tax_amount || 0).toFixed(2)}</td>
                        <td className="p-2">₹{parseFloat(bill.paid_amount || 0).toFixed(2)}</td>
                        <td className="p-2">₹{parseFloat(bill.balance_amount || 0).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="p-4 text-center text-gray-500">No pharmacy bills found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>


          {/* AMBULANCE DETAILS TABLE */}
          <div className="bg-white p-5 rounded-lg shadow overflow-x-auto mb-5">
            <h3 className="text-lg font-semibold mb-3">Ambulance Details</h3>

            {loadingVisits ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-2"></div>
                <p className="text-gray-500 text-sm">Loading ambulance bills...</p>
              </div>
            ) : (
              <table className="w-full text-sm bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Bill No</th>
                    <th className="p-2 text-left">Case ID</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Vehicle No</th>
                    <th className="p-2 text-left">Driver Name</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Discount %</th>
                    <th className="p-2 text-left">Discount Amount</th>
                    <th className="p-2 text-left">Tax %</th>
                    <th className="p-2 text-left">Tax Amount</th>
                    <th className="p-2 text-left">Paid Amount</th>
                    <th className="p-2 text-left">Balance Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {ambulanceBills.length > 0 ? (
                    ambulanceBills.map((bill) => (
                      <tr key={bill.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-2">{bill.bill_number || bill.id}</td>
                        <td className="p-2">{bill.case_id || "N/A"}</td>
                        <td className="p-2">
                          {bill.created_at ? new Date(bill.created_at).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="p-2">{bill.ambulance_number || "N/A"}</td>
                        <td className="p-2">{bill.driver_name || "N/A"}</td>
                        <td className="p-2">₹{parseFloat(bill.total_amount || 0).toFixed(2)}</td>
                        <td className="p-2">{parseFloat(bill.discount_percentage || 0).toFixed(2)}%</td>
                        <td className="p-2">₹{parseFloat(bill.discount_amount || 0).toFixed(2)}</td>
                        <td className="p-2">{parseFloat(bill.tax_percentage || 0).toFixed(2)}%</td>
                        <td className="p-2">₹{parseFloat(bill.tax_amount || 0).toFixed(2)}</td>
                        <td className="p-2">₹{parseFloat(bill.paid_amount || 0).toFixed(2)}</td>
                        <td className="p-2">₹{parseFloat(bill.balance || 0).toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="p-4 text-center text-gray-500">No ambulance bills found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}

// Helper function to get gender display
function getGenderDisplay(genderCode) {
  const genderMap = {
    'M': 'Male',
    'F': 'Female',
    'O': 'Other',
  };
  return genderMap[genderCode] || genderCode;
}

// Add this helper function at the bottom before export
function getImageUrl(photoPath) {
  if (!photoPath) return null;

  // If it's already a full URL
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = apiUrl.replace('/api', '');

  // Ensure path starts with /
  const path = photoPath.startsWith('/') ? photoPath : '/' + photoPath;

  const fullUrl = `${baseUrl}${path}`;
  console.log('Generated image URL:', fullUrl);
  return fullUrl;
}

export default PatientDetails;