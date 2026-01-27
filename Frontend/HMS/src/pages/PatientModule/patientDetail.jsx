import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPatientDetail } from "../../api/patientApi";


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
    } catch (err) {
      console.error("Error fetching patient:", err);
      navigate("/admin/patients");
    } finally {
      setLoading(false);
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
          <div className="bg-white p-5 rounded-lg shadow overflow-x-auto">
            <h3 className="text-lg font-semibold mb-3">OPD Details</h3>

            <table className="w-full border text-sm bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">OPD No</th>
                  <th className="p-2 border">Case ID</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">OPD Checkup ID</th>
                  <th className="p-2 border">Doctor Name</th>
                  <th className="p-2 border">Symptoms</th>
                  <th className="p-2 border">Findings</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="p-2 border">OPDN7491</td>
                  <td className="p-2 border">7519</td>
                  <td className="p-2 border">12/01/2025</td>
                  <td className="p-2 border">CHKID7494</td>
                  <td className="p-2 border">Amit Singh (9009)</td>
                  <td className="p-2 border">
                    Atopic dermatitis (eczema)… develops in early childhood.
                  </td>
                  <td className="p-2 border">
                    Rosacea — flushing & visible blood vessels.
                  </td>
                </tr>
              </tbody>
            </table>
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