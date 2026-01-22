import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { Eye, Printer, X } from "lucide-react";

export default function IPDPrescription() {
  // ---------------- MOCK DATA ----------------
  const prescriptions = [
    {
      no: "IPDP358",
      date: "01/01/2025",
      finding:
        "Elevated temperature (above 100.4°). The medical community generally defines a fever as a body temperature above 100.4 degrees Fahrenheit.",
    },
    {
      no: "IPDP362",
      date: "02/05/2025",
      finding:
        "Damaged hair develops cracks in the outside layer (cuticle), leading to breakage.",
    },
    {
      no: "IPDP367",
      date: "03/04/2025",
      finding:
        "Rosacea causes facial redness, visible blood vessels, and pus-filled bumps.",
    },
  ];

  // ❌ no hooks → using DOM control
  const openModal = () => {
    document.getElementById("prescriptionModal").classList.remove("hidden");
  };

  const closeModal = () => {
    document.getElementById("prescriptionModal").classList.add("hidden");
  };

  // --------------------------------------------------
  return (
    <PatientLayout>
      <div className="min-h-screen">
        {/* IPD HEADER */}
        <IPDHeaderNavbar />

        {/* PAGE CONTENT */}
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-4">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">

            {/* Title */}
            <h2 className="text-lg font-semibold mb-4">Prescription</h2>

            {/* Search */}
           
            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm ">
                <thead className="bg-gray-100">
                  <tr>
                    <th className=" px-3 py-2 text-left">
                      Prescription No
                    </th>
                    <th className=" px-3 py-2 text-left">Date</th>
                    <th className=" px-3 py-2 text-left">Finding</th>
                    <th className=" px-3 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((p, i) => (
                    <tr key={i} className="align-top">
                      <td className=" px-3 py-2">{p.no}</td>
                      <td className=" px-3 py-2">{p.date}</td>
                      <td className=" px-3 py-2">{p.finding}</td>
                      <td className=" px-3 py-2 text-center">
                        <button
                          onClick={openModal}
                          className="text-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:text-blue-800"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* ===================== PRESCRIPTION MODAL (DETAIL VIEW) ===================== */}
        <div
          id="prescriptionModal"
          className="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2"
        >
          <div className="bg-white w-full max-w-5xl rounded-lg shadow-lg overflow-y-auto max-h-[95vh]">

            {/* Modal Header */}
            <div className="flex justify-between items-center bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-3">
              <h3 className="font-semibold">Prescription</h3>
              <div className="flex gap-3">
                <button>
                  <Printer size={18} />
                </button>
                <button onClick={closeModal}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 text-sm space-y-4">

              {/* Hospital Header */}
              <div className="border-b pb-2">
                <h2 className="text-xl font-bold">
                  Smart Hospital & Research Center
                </h2>
                <p className="text-xs text-gray-600">
                  Address: 25 Kings Street, CA | Phone: 89562423934
                </p>
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Patient Name:</strong> Olivier Thomas (1)</p>
                  <p><strong>Blood Group:</strong> B+</p>
                  <p><strong>Phone:</strong> 7896541230</p>
                </div>
                <div>
                  <p><strong>Age:</strong> 41 Year 4 Month 30 Days</p>
                  <p><strong>Gender:</strong> Male</p>
                  <p><strong>Email:</strong> olivier@gmail.com</p>
                </div>
              </div>

              {/* Finding */}
              <div>
                <h4 className="font-semibold mb-1">Finding:</h4>
                <p>
                  Elevated temperature (above 100.4°). Body temperature above
                  100.4°F is considered fever.
                </p>
              </div>

              {/* Medicines */}
              <div>
                <h4 className="font-semibold mb-2">Medicines</h4>
                <table className="min-w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-2 py-1">#</th>
                      <th className="border px-2 py-1">Category</th>
                      <th className="border px-2 py-1">Medicine</th>
                      <th className="border px-2 py-1">Dosage</th>
                      <th className="border px-2 py-1">Interval</th>
                      <th className="border px-2 py-1">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1">1</td>
                      <td className="border px-2 py-1">Syrup</td>
                      <td className="border px-2 py-1">Alprovit</td>
                      <td className="border px-2 py-1">1 CT</td>
                      <td className="border px-2 py-1">Once a day</td>
                      <td className="border px-2 py-1">1 Week</td>
                    </tr>
                    <tr>
                      <td className="border px-2 py-1">2</td>
                      <td className="border px-2 py-1">Capsule</td>
                      <td className="border px-2 py-1">WORMSTOP</td>
                      <td className="border px-2 py-1">
                        1 Micrometer (oi)
                      </td>
                      <td className="border px-2 py-1">Once a day</td>
                      <td className="border px-2 py-1">2 Week</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-gray-500">
                This invoice is printed electronically, no signature required.
              </p>

            </div>
          </div>
        </div>
        {/* ===================== END MODAL ===================== */}
      </div>
    </PatientLayout>
  );
}
