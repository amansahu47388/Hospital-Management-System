import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { Pill } from "lucide-react";

export default function IPDMedication() {
  const medications = [
    {
      date: "01/07/2026 (Wednesday)",
      name: "BICASOL",
      doses: [
        {
          time: "09:00 AM",
          qty: "0.5 CT",
          by: "Super Admin (9001)",
        },
      ],
    },
    {
      date: "01/06/2026 (Tuesday)",
      name: "Alprovit",
      doses: [
        {
          time: "06:00 PM",
          qty: "1 CT",
          by: "Super Admin (9001)",
        },
        {
          time: "08:00 PM",
          qty: "1 Micrometer (oi)",
          by: "Super Admin (9001)",
          child: true,
          name: "WORMSTOP",
        },
      ],
    },
    {
      date: "12/12/2025 (Friday)",
      name: "Alprovit",
      doses: [
        {
          time: "04:35 PM",
          qty: "1 CT",
          by: "Super Admin (9001)",
        },
      ],
    },
  ];

  return (
    <PatientLayout>
      {/* Page Background */}
      <div className="min-h-screen">
        {/* IPD Top Navbar */}
        <IPDHeaderNavbar />

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-4">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">

            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Pill size={18} className="text-blue-600" />
              Medication
            </h2>

            {/* Table Wrapper */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm ">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className=" px-3 py-2 text-left">Date</th>
                    <th className=" px-3 py-2 text-left">
                      Medicine Name
                    </th>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <th
                        key={i}
                        className=" px-3 py-2 text-left"
                      >
                        Dose{i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {medications.map((m, index) => (
                    <tr key={index} className="align-top">
                      <td className=" px-3 py-2 whitespace-nowrap">
                        {m.date}
                      </td>

                      <td className=" px-3 py-2 font-medium">
                        {m.name}
                      </td>

                      {Array.from({ length: 8 }).map((_, dIndex) => {
                        const dose = m.doses[dIndex];
                        return (
                          <td
                            key={dIndex}
                            className=" px-3 py-2 text-gray-700"
                          >
                            {dose ? (
                              <div className="space-y-1">
                                {dose.child && (
                                  <div className="font-semibold">
                                    ↳ {dose.name}
                                  </div>
                                )}
                                <div>Time: {dose.time}</div>
                                <div>{dose.qty}</div>
                                <div className="text-xs text-gray-500">
                                  Created By: {dose.by}
                                </div>
                              </div>
                            ) : null}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
