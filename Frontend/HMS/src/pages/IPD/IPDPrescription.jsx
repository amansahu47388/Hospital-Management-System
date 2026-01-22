import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import { Pencil,Trash2 } from "lucide-react";

export default function IPDPrescription() {
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);

  return (
    <AdminLayout>
      <div className="min-h-screen ">

        {/* IPD NAVBAR */}
        <IPDTabsNavbar />

        {/* LIST PAGE */}
        <div className="p-4 md:p-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Prescription</h2>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-[#6046B5] text-white px-4 py-2 rounded"
              >
                + Add Prescription
              </button>
            </div>

            <table className="w-full  text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Prescription No</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Finding</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="p-2">IPDP417</td>
                  <td className="p-2">01/05/2026</td>
                  <td className="p-2">Fever</td>
                  <td className="p-2 text-left flex gap-2">
                    <button
                      onClick={() => setShowView(true)}
                      className="text-blue-600 hover:underline"
                    >
                      <Pencil size={16}/>
                    </button>
                   <button
                   className="text-red-600 hover:underline"
                   >
                   <Trash2 size={16}/>
                   </button>
                  </td>
                </tr>
              </tbody>
            </table>

          </div>
        </div>

        {/* ADD PRESCRIPTION MODAL */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="w-full max-w-6xl bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded-lg overflow-y-auto max-h-[90vh]">

              <div className="flex justify-between items-center p-4 text-white">
                <h3 className="font-semibold">Add Prescription</h3>
                <button onClick={() => setShowAdd(false)}>✕</button>
              </div>

              <div className="bg-white p-6 space-y-6 text-sm">

                {/* HEADER NOTE */}
                <div>
                  <label className="font-semibold">Header Note</label>
                  <textarea className="border w-full p-2 rounded mt-1" rows="3" />
                </div>

                {/* RIGHT SIDE FIELDS */}
                <div className="grid md:grid-cols-2 gap-4">
                  <input className="border p-2 rounded" placeholder="Prescribe By *" />
                  <input className="border p-2 rounded" placeholder="Pathology" />
                  <input className="border p-2 rounded" placeholder="Radiology" />
                </div>

                {/* FINDINGS */}
                <div className="grid md:grid-cols-4 gap-4">
                  <input className="border p-2 rounded" placeholder="Finding Category" />
                  <input className="border p-2 rounded" placeholder="Findings" />
                  <textarea className="border p-2 rounded md:col-span-2" placeholder="Finding Description" />
                </div>

                {/* MEDICINE ROW */}
                <div className="overflow-x-auto">
                  <table className="w-full border text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2">Category</th>
                        <th className="p-2">Medicine</th>
                        <th className="p-2">Dose</th>
                        <th className="p-2">Interval</th>
                        <th className="p-2">Duration</th>
                        <th className="p-2">Instruction</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td><select className="border p-1 rounded w-full"><option>Select</option></select></td>
                        <td><select className="border p-1 rounded w-full"><option>Select</option></select></td>
                        <td><select className="border p-1 rounded w-full"><option>Select</option></select></td>
                        <td><select className="border p-1 rounded w-full"><option>Select</option></select></td>
                        <td><select className="border p-1 rounded w-full"><option>Select</option></select></td>
                        <td><input className="border p-1 rounded w-full" /></td>
                        <td className="text-center text-red-600 cursor-pointer">✕</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* NOTIFICATION */}
                <div>
                  <label className="font-semibold">Notification To</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {["Admin", "Accountant", "Doctor", "Pharmacist", "Pathologist", "Radiologist", "Super Admin", "Receptionist", "Nurse"]
                      .map(r => (
                        <label key={r} className="flex gap-2 items-center">
                          <input type="checkbox" /> {r}
                        </label>
                      ))}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="flex justify-end gap-3">
                  <button className="bg-gray-300 px-4 py-2 rounded">Save</button>
                  <button className="bg-[#6046B5] text-white px-4 py-2 rounded">
                    Save & Print
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* VIEW PRESCRIPTION MODAL */}
        {showView && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="w-full max-w-5xl bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded-lg">

              <div className="flex justify-between items-center p-4 text-white">
                <h3>Prescription</h3>
                <button onClick={() => setShowView(false)}>✕</button>
              </div>

              <div className="bg-white p-6 text-sm">

                <h2 className="text-center font-bold text-xl mb-4">
                  Smart Hospital & Research Center
                </h2>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <p><b>Patient:</b> Jack Edwards (1166)</p>
                  <p><b>Date:</b> 01/05/2026</p>
                  <p><b>Doctor:</b> Sansa Gomez</p>
                  <p><b>Blood Group:</b> B+</p>
                </div>

                <h4 className="font-semibold mb-2">Medicines</h4>
                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">Medicine</th>
                      <th className="p-2">Dose</th>
                      <th className="p-2">Interval</th>
                      <th className="p-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2">Alprovit</td>
                      <td className="p-2">1 CT</td>
                      <td className="p-2">Once a day</td>
                      <td className="p-2">1 Week</td>
                    </tr>
                  </tbody>
                </table>

              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
