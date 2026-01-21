import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDTabsNavbar";

export default function MedicationSinglePage() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [activeRow, setActiveRow] = useState(null);

  const medications = [
    {
      id: 1,
      date: "01/16/2026",
      medicine: "Alprovit",
      time: "05:45 PM",
      dose: "1 CT",
      createdBy: "Super Admin (9001)"
    }
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen ">

        <IPDTabsNavbar />

        <div className="p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Medication</h2>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-[#6046B5] text-white px-4 py-2 rounded"
              >
                + Add Medication Dose
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Medicine</th>
                    <th className="p-2 text-left">Dose</th>
                    <th className="p-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((m) => (
                    <tr key={m.id} className="border-t hover:bg-gray-50">
                      <td className="p-2">{m.date}</td>
                      <td className="p-2">{m.medicine}</td>
                      <td className="p-2">
                        {m.time}<br />
                        {m.dose}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          onClick={() => {
                            setActiveRow(m);
                            setShowEdit(true);
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>

        {/* ADD MODAL */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded-lg">
              <div className="flex justify-between text-white p-4">
                <h3>Add Medication Dose</h3>
                <button onClick={() => setShowAdd(false)}>✕</button>
              </div>

              <div className="bg-white p-6 grid md:grid-cols-2 gap-4">
                <input className="border p-2 rounded" placeholder="Date *" />
                <input className="border p-2 rounded" placeholder="Time" />
                <select className="border p-2 rounded">
                  <option>Medicine Category *</option>
                </select>
                <select className="border p-2 rounded">
                  <option>Medicine Name *</option>
                </select>
                <select className="border p-2 rounded">
                  <option>Dosage *</option>
                </select>
                <textarea className="border p-2 rounded md:col-span-2" placeholder="Remarks"></textarea>
                <div className="md:col-span-2 text-right">
                  <button className="bg-[#6046B5] text-white px-6 py-2 rounded">
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEdit && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded-lg">
              <div className="flex justify-between text-white p-4">
                <h3>Edit Medication Dose</h3>
                <button onClick={() => setShowEdit(false)}>✕</button>
              </div>

              <div className="bg-white p-6 grid md:grid-cols-2 gap-4">
                <input className="border p-2 rounded" defaultValue={activeRow?.date} />
                <input className="border p-2 rounded" defaultValue={activeRow?.time} />
                <input className="border p-2 rounded" defaultValue={activeRow?.medicine} />
                <input className="border p-2 rounded" defaultValue={activeRow?.dose} />
                <div className="md:col-span-2 text-right">
                  <button className="bg-[#6046B5] text-white px-6 py-2 rounded">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
