import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDTabsNavbar";

export default function OperationsSinglePage() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState(null);

  const data = [
    {
      id: 1,
      ref: "OTREF512",
      date: "01/22/2026 04:59 PM",
      name: "Tooth extraction",
      category: "ENT and Oral Surgery",
      technician: "David"
    }
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">

        <IPDTabsNavbar />

        <div className="p-4 md:p-6">
          <div className="bg-white rounded shadow p-4">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Operations</h2>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-[#6046B5] text-white px-4 py-2 rounded"
              >
                + Add Operation
              </button>
            </div>

            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Reference No</th>
                  <th className="p-2">Operation Date</th>
                  <th className="p-2">Operation Name</th>
                  <th className="p-2">Category</th>
                  <th className="p-2">OT Technician</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map(r => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{r.ref}</td>
                    <td className="p-2">{r.date}</td>
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.category}</td>
                    <td className="p-2">{r.technician}</td>
                    <td className="p-2 text-center space-x-2">
                      <button
                        onClick={() => {
                          setSelected(r);
                          setShowView(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelected(r);
                          setShowEdit(true);
                        }}
                        className="text-green-600 hover:underline"
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

        {/* ADD / EDIT / VIEW MODALS – SAME STYLE */}
        {(showAdd || showEdit) && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="w-full max-w-2xl bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded">

              <div className="flex justify-between p-4 text-white">
                <h3>{showAdd ? "Add Operation" : "Edit Operation"}</h3>
                <button onClick={() => {
                  setShowAdd(false);
                  setShowEdit(false);
                }}>✕</button>
              </div>

              <div className="bg-white p-6 grid md:grid-cols-2 gap-4 text-sm">
                <input className="border p-2" placeholder="Operation Category *" defaultValue={selected?.category} />
                <input className="border p-2" placeholder="Operation Name *" defaultValue={selected?.name} />
                <input className="border p-2" placeholder="Operation Date *" defaultValue={selected?.date} />
                <input className="border p-2" placeholder="Consultant Doctor *" />
                <input className="border p-2" placeholder="OT Technician" defaultValue={selected?.technician} />
                <textarea className="border p-2 md:col-span-2" placeholder="Remark" />
                <div className="md:col-span-2 text-right">
                  <button className="bg-[#6046B5] text-white px-4 py-2 rounded">
                    Save
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {showView && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="w-full max-w-2xl bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded">
              <div className="flex justify-between p-4 text-white">
                <h3>Operation Details</h3>
                <button onClick={() => setShowView(false)}>✕</button>
              </div>
              <div className="bg-white p-6 text-sm space-y-2">
                <p><b>Reference:</b> {selected?.ref}</p>
                <p><b>Operation:</b> {selected?.name}</p>
                <p><b>Category:</b> {selected?.category}</p>
                <p><b>Date:</b> {selected?.date}</p>
                <p><b>OT Technician:</b> {selected?.technician}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
