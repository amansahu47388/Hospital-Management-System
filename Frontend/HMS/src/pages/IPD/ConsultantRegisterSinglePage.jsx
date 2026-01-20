import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDTabsNavbar";

export default function ConsultantRegisterSinglePage() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState(null);

  const data = [
    {
      id: 1,
      appliedDate: "01/14/2026 04:58 PM",
      consultant: "Reyan Jain (9011)",
      instruction: "Daily Routine Check up",
      consultantDate: "01/16/2026"
    }
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">

        {/* IPD NAVBAR */}
        <IPDTabsNavbar />

        {/* LIST */}
        <div className="p-4 md:p-6">
          <div className="bg-white rounded shadow p-4">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Consultant Register</h2>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-[#6046B5] text-white px-4 py-2 rounded"
              >
                + Consultant Register
              </button>
            </div>

            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Applied Date</th>
                  <th className="p-2">Consultant Doctor</th>
                  <th className="p-2">Instruction</th>
                  <th className="p-2">Consultant Date</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-t">
                    <td className="p-2">{row.appliedDate}</td>
                    <td className="p-2">{row.consultant}</td>
                    <td className="p-2">{row.instruction}</td>
                    <td className="p-2">{row.consultantDate}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => {
                          setSelected(row);
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

        {/* ADD MODAL */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="w-full max-w-xl rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">

              <div className="flex justify-between p-4 text-white">
                <h3>Add Consultant Register</h3>
                <button onClick={() => setShowAdd(false)}>✕</button>
              </div>

              <div className="bg-white p-6 space-y-4">
                <input className="border p-2 w-full" placeholder="Applied Date *" />
                <input className="border p-2 w-full" placeholder="Consultant Date *" />
                <select className="border p-2 w-full">
                  <option>Select Consultant *</option>
                </select>
                <textarea className="border p-2 w-full" placeholder="Instruction *" />
                <div className="text-right">
                  <button className="bg-[#6046B5] text-white px-4 py-2 rounded">
                    Save
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEdit && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="w-full max-w-xl rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">

              <div className="flex justify-between p-4 text-white">
                <h3>Edit Consultant Register</h3>
                <button onClick={() => setShowEdit(false)}>✕</button>
              </div>

              <div className="bg-white p-6 space-y-4">
                <input className="border p-2 w-full" defaultValue={selected?.appliedDate} />
                <input className="border p-2 w-full" defaultValue={selected?.consultantDate} />
                <input className="border p-2 w-full" defaultValue={selected?.consultant} />
                <textarea className="border p-2 w-full" defaultValue={selected?.instruction} />
                <div className="text-right">
                  <button className="bg-[#6046B5] text-white px-4 py-2 rounded">
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
