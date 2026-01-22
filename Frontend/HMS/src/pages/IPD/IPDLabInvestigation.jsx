import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import { Eye } from "lucide-react";

export default function IPDLabInvestigation() {
  const [showView, setShowView] = useState(false);
  const [selected, setSelected] = useState(null);

  const rows = [
    {
      id: 1,
      test: "Abdomen X-rays (AX)",
      lab: "Pathology",
      collectedBy: "Belina Turner (9005)",
      center: "In-House Pathology Lab",
      expected: "01/19/2026",
      approvedBy: "Belina Turner (9005)",
      approveDate: "01/21/2026"
    },
    {
      id: 2,
      test: "Magnetic resonance imaging (MR)",
      lab: "Radiology",
      collectedBy: "John Hook (9006)",
      center: "In-House Radiology Lab",
      expected: "01/18/2026",
      approvedBy: "John Hook (9006)",
      approveDate: "01/19/2026"
    }
  ];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">

        <IPDTabsNavbar />

        <div className="p-4 md:p-6">
          <div className="bg-white rounded shadow p-4">

            <h2 className="text-lg font-semibold mb-4">Lab Investigation</h2>

            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">Test Name</th>
                  <th className="p-2">Lab</th>
                  <th className="p-2">Sample Collected</th>
                  <th className="p-2">Expected Date</th>
                  <th className="p-2">Approved By</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t border-gray-200  ">
                    <td className="p-2">{r.test}</td>
                    <td className="p-2">{r.lab}</td>
                    <td className="p-2">
                      {r.collectedBy}
                      <div className="text-xs text-gray-500">{r.center}</div>
                    </td>
                    <td className="p-2">{r.expected}</td>
                    <td className="p-2">
                      {r.approvedBy}
                      <div className="text-xs text-gray-500">{r.approveDate}</div>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => {
                          setSelected(r);
                          setShowView(true);
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>

        {/* VIEW REPORT */}
        {showView && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="w-full max-w-4xl bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded">

              <div className="flex justify-between items-center p-4 text-white">
                <h3>{selected?.test}</h3>
                <button onClick={() => setShowView(false)}>✕</button>
              </div>

              <div className="bg-white p-6 text-sm">

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <p><b>Patient:</b> Jack Edwards (1166)</p>
                  <p><b>Case ID:</b> 7635</p>
                  <p><b>Collected By:</b> {selected?.collectedBy}</p>
                  <p><b>Approved By:</b> {selected?.approvedBy}</p>
                  <p><b>Expected Date:</b> {selected?.expected}</p>
                  <p><b>Center:</b> {selected?.center}</p>
                </div>

                <h4 className="font-semibold mb-2">Test Parameters</h4>

                <table className="w-full border text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">Parameter</th>
                      <th className="p-2">Value</th>
                      <th className="p-2">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="p-2">Liver Function Test</td>
                      <td className="p-2">35 (U/L)</td>
                      <td className="p-2">7–55 U/L</td>
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
