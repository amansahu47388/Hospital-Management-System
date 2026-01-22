import { useState } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { Eye } from "lucide-react";

export default function LabInvestigation() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const data = [
    {
      name: "Chest X-rays (C)",
      lab: "Pathology",
      doctor: "Belina Turner (9005)",
      collected: "06/25/2025",
      approved: "06/26/2025",
      status: "Approved",
      test: "RBC",
      range: "4.1 – 5.1 million/mm3",
      value: "4 million/mm3",
    },
  ];

  return (
    <PatientLayout>
      <IPDHeaderNavbar />

      {/* PAGE */}
      <div className="min-h-screen p-4 md:p-6 ">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* HEADER */}
          <div className="px-5 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Lab Investigation
            </h2>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
              Total: {data.length}
            </span>
          </div>

          {/* TABLE – DESKTOP */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-4 text-left">Test</th>
                  <th>Lab</th>
                  <th>Collected</th>
                  <th>Approved By</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {data.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-indigo-50/40 transition group"
                  >
                    <td className="p-4 font-medium text-gray-800">
                      {row.name}
                    </td>
                    <td>{row.lab}</td>
                    <td>{row.collected}</td>
                    <td>{row.doctor}</td>
                    <td>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 animate-pulse">
                        {row.status}
                      </span>
                    </td>
                    <td className="text-center">
                      <button
                        onClick={() => {
                          setSelected(row);
                          setOpen(true);
                        }}
                        title="View Report"
                        className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center
                                   hover:bg-indigo-700 hover:scale-110 transition"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARD – MOBILE */}
          <div className="md:hidden p-4 space-y-4">
            {data.map((row, i) => (
              <div
                key={i}
                className="border-l-4 border-indigo-600 rounded-xl p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-sm text-gray-800">
                    {row.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    {row.status}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Lab: {row.lab}
                </p>
                <p className="text-xs text-gray-500">
                  Collected: {row.collected}
                </p>

                <button
                  onClick={() => {
                    setSelected(row);
                    setOpen(true);
                  }}
                  className="mt-3 w-full flex items-center justify-center gap-2
                             bg-indigo-600 text-white py-2 rounded-lg text-xs
                             hover:bg-indigo-700 transition"
                >
                  <Eye size={16} /> View Report
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {open && selected && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl mx-4 rounded-2xl p-5 text-white
                       bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                       shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">
                {selected.name} – Report
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center
                           rounded-full bg-white/20 hover:bg-white/30"
              >
                ✕
              </button>
            </div>

            {/* REPORT */}
            <div className="bg-white rounded-xl p-4 text-black grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <b>Test</b>
                <p>{selected.test}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <b>Status</b>
                <p>{selected.status}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <b>Reference Range</b>
                <p>{selected.range}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <b>Result</b>
                <p className="font-semibold">{selected.value}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <b>Collected On</b>
                <p>{selected.collected}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <b>Approved By</b>
                <p>{selected.doctor}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </PatientLayout>
  );
}
