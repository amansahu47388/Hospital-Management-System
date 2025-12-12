import React from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Droplet,
  Calendar,
  Heart,
  Barcode,
  QrCode,
  Edit,
  Printer,
} from "lucide-react";

export default function PatientDetail() {
  const { id } = useParams();

  // Temporary Sample Data — Replace with API Data
  const patient = {
    id: id,
    name: "Olivier Thomas",
    guardian: "Edward Thomas",
    gender: "Male",
    bloodGroup: "B+",
    maritalStatus: "Married",
    age: "41 Year, 7 Month, 8 Day",
    phone: "7896541230",
    email: "olivier@gmail.com",
    address: "482 Kingsway, Brooklyn West, CA",
    allergies: "No",
    remarks: "Injury Treatment",
    tpa: "Health Life Insurance",
    tpaId: "7745855",
    tpaValidity: "11/19/2026",
    nin: "77458596",
    altNumber: "",
    photo:
      "https://img.freepik.com/free-photo/portrait-handsome-confident-young-man_23-2149022628.jpg",
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
     

      <div className="flex flex-col flex-1 overflow-hidden">
       

        {/* PAGE HEADER */}
        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-semibold">Patient Details</h1>

          <div className="flex gap-4">
            <Edit size={20} className="cursor-pointer" />
            <Printer size={20} className="cursor-pointer" />
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
                  {patient.name} ({patient.id})
                </h2>

                <p className="flex items-center gap-2 text-gray-700">
                  <User size={18} /> {patient.guardian}
                </p>

                <p className="flex items-center gap-4 text-gray-700">
                  
                  <Droplet size={18} /> {patient.bloodGroup}
                  <Heart size={18} /> {patient.maritalStatus}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Calendar size={18} /> {patient.age}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Phone size={18} /> {patient.phone}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <Mail size={18} /> {patient.email}
                </p>

                <p className="flex items-center gap-2 text-gray-700">
                  <MapPin size={18} /> {patient.address}
                </p>

                <Barcode className="w-32 h-10 mt-2" />
                <QrCode className="w-24 h-24" />
              </div>

              {/* MIDDLE COLUMN DETAILS */}
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Any Known Allergies:</strong> {patient.allergies}
                </p>
                <p>
                  <strong>Remarks:</strong> {patient.remarks}
                </p>
                <p>
                  <strong>TPA:</strong> {patient.tpa}
                </p>
                <p>
                  <strong>TPA ID:</strong> {patient.tpaId}
                </p>
                <p>
                  <strong>TPA Validity:</strong> {patient.tpaValidity}
                </p>
                <p>
                  <strong>National Identification Number:</strong> {patient.nin}
                </p>
                <p>
                  <strong>Alternate Number:</strong> {patient.altNumber || "N/A"}
                </p>
              </div>

              {/* RIGHT SIDE PATIENT PHOTO */}
              <div className="flex justify-center lg:justify-end">
                <img
                  src={patient.photo}
                  alt="Patient"
                  className="w-32 h-32 object-cover rounded shadow-md"
                />
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
