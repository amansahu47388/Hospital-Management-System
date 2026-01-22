import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import { Pencil, Trash2 } from "lucide-react";

export default function ConsultantRegister() {
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

            <table className="w-full  text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Applied Date</th>
                  <th className="p-2 text-left">Consultant Doctor</th>
                  <th className="p-2 text-left">Instruction</th>
                  <th className="p-2 text-left">Consultant Date</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-t border-gray-200">
                    <td className="p-2 text-left">{row.appliedDate}</td>
                    <td className="p-2 text-left">{row.consultant}</td>
                    <td className="p-2 text-left">{row.instruction}</td>
                    <td className="p-2 text-left">{row.consultantDate}</td>
                    <td className="p-2 text-left flex gap-2">
                      <button
                        onClick={() => {
                          setSelected(row);
                          setShowEdit(true);
                        }}
                        className="text-purple-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button className="text-red-600">
                        <Trash2 size={16} />
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
                <label>Applied Date</label>
                <input className="border p-2 w-full" placeholder="Applied Date *" />
                <label>Consultant Date</label>
                <input className="border p-2 w-full" placeholder="Consultant Date *" />
                <label>Select Consultant</label>
                <select className="border p-2 w-full">
                  <option>Select Consultant *</option>
                </select>
                <label>Instruction</label>
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
                <label>Applied Date</label>
                <input className="border p-2 w-full" defaultValue={selected?.appliedDate} />
                <label>Consultant Date</label>
                <input className="border p-2 w-full" defaultValue={selected?.consultantDate} />
                <label>Select Consultant</label>
                <input className="border p-2 w-full" defaultValue={selected?.consultant} />
                <label>Instruction</label>
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
