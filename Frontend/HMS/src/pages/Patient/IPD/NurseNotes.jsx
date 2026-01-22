import PatientLayout from "../../../layout/PatientLayout";

import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { FileText } from "lucide-react";

export default function NurseNotes() {
  const notes = [
    {
      date: "08/05/2025 04:45 PM",
      doctor: "April ( 9020 )",
      note: "Take medicine after meal everyday also eat one egg daily at morning time.",
      comment: "Take medicine after meal everyday also eat one egg daily at morning time."
    },
    {
      date: "09/05/2025 11:54 AM",
      doctor: "April ( 9020 )",
      note: "Take medicine after meal everyday.",
      comment: "Take medicine after meal everyday."
    },
    {
      date: "10/05/2025 05:14 PM",
      doctor: "April ( 9020 )",
      note: "Take medicine after meal everyday.",
      comment: "Follow diet as planned for you."
    },
    {
      date: "11/05/2025 05:33 PM",
      doctor: "April ( 9020 )",
      note: "Take medicine after meal everyday.",
      comment: "Follow Doctor instruction, eat one egg daily at morning time."
    },
    {
      date: "12/08/2025 04:34 PM",
      doctor: "April ( 9020 )",
      note: "Take medicine after meal everyday.",
      comment: "-"
    }
  ];

  return (
    <PatientLayout>
        <IPDHeaderNavbar />
      <div className="min-h-screen  p-1 md:p-6">
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-6">

          {/* Header */}
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Nurse Notes
          </h2>

          {/* Timeline */}
          <div className="relative pl-8">
            <div className="absolute left-3 top-0 bottom-0 w-[2px] bg-gray-300"></div>

            {notes.map((item, index) => (
              <div key={index} className="mb-8 relative">

                {/* Date Badge */}
                <div className="absolute -left-2 top-0">
                  <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white text-xs px-3 py-1 rounded-md shadow">
                    {item.date}
                  </div>
                </div>

                {/* Icon */}
                <div className="absolute left-[-10px] top-10 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded-full p-2 shadow">
                  <FileText size={14} />
                </div>

                {/* Card */}
                <div className="ml-8 bg-gray-50 border rounded-lg p-6 shadow-sm">
                  <h4 className=" font-medium mb-3">
                    {item.doctor}
                  </h4>

                  <div className="mb-3">
                    <p className="text-sm font-semibold text-gray-700">
                      Note
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.note}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      Comment
                    </p>
                    <p className="text-sm text-gray-600">
                      {item.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </PatientLayout>
  );
}

