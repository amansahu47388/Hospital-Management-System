import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { Search } from "lucide-react";

export default function IPDConsultantRegister() {
  const consultants = [
    {
      applied: "04/08/2025 02:56 PM",
      doctor: "Sansa Gomez (9008)",
      instruction:
        "Take medicine after meal everyday also eat one egg daily at morning time.",
      date: "04/04/2025",
    },
    {
      applied: "05/12/2025 12:33 PM",
      doctor: "Amit Singh (9009)",
      instruction:
        "Take medicine after meal everyday also eat one egg daily at morning time.",
      date: "05/10/2025",
    },
    {
      applied: "06/08/2025 03:48 PM",
      doctor: "Amit Singh (9009)",
      instruction: "Follow diet as planned for you.",
      date: "06/10/2025",
    },
    {
      applied: "07/18/2025 02:51 PM",
      doctor: "Sansa Gomez (9008)",
      instruction:
        "Take medicine after meal everyday also eat one egg daily at morning time.",
      date: "07/16/2025",
    },
    {
      applied: "08/10/2025 04:48 PM",
      doctor: "Sansa Gomez (9008)",
      instruction: "Follow diet as planned for you.",
      date: "08/12/2025",
    },
    {
      applied: "09/06/2025 11:56 AM",
      doctor: "Sansa Gomez (9008)",
      instruction: "Take medicine after meal everyday.",
      date: "09/08/2025",
    },
    {
      applied: "10/04/2025 05:16 PM",
      doctor: "Amit Singh (9009)",
      instruction: "Take medicine after meal everyday.",
      date: "10/05/2025",
    },
    {
      applied: "11/06/2025 05:38 PM",
      doctor: "Amit Singh (9009)",
      instruction:
        "Take medicine after meal everyday also eat one egg daily at morning time.",
      date: "11/07/2025",
    },
    {
      applied: "12/06/2025 04:44 PM",
      doctor: "Reyan Jain (9011)",
      instruction: "Follow diet as planned for you.",
      date: "12/08/2025",
    },
    {
      applied: "01/08/2026 01:57 PM",
      doctor: "Amit Singh (9009)",
      instruction: "Follow diet as planned for you.",
      date: "01/06/2026",
    },
  ];

  return (
    <PatientLayout>
      <div className="min-h-screen ">
        {/* IPD HEADER */}
        <IPDHeaderNavbar />

        {/* CONTENT */}
        <div className="max-w-7xl mx-auto px-2 md:px-4 py-4">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">

            {/* Title */}
            <h2 className="text-lg font-semibold mb-4">
              Consultant Register
            </h2>

            {/* Search */}
            

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full  text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className=" px-3 py-2 text-left">
                      Applied Date
                    </th>
                    <th className=" px-3 py-2 text-left">
                      Consultant Doctor
                    </th>
                    <th className=" px-3 py-2 text-left">
                      Instruction
                    </th>
                    <th className=" px-3 py-2 text-left">
                      Instruction Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {consultants.map((c, i) => (
                    <tr key={i} className="align-top">
                      <td className=" px-3 py-2 whitespace-nowrap">
                        {c.applied}
                      </td>
                      <td className=" px-3 py-2">
                        {c.doctor}
                      </td>
                      <td className=" px-3 py-2">
                        {c.instruction}
                      </td>
                      <td className=" px-3 py-2 whitespace-nowrap">
                        {c.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
           

          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
