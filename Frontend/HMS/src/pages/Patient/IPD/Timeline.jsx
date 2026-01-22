import React, { useState } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { Clock, Calendar, CheckCircle, FileText } from "lucide-react";

export default function Timeline() {
    const [timelineData] = useState([
        {
            id: 1,
            date: "01/06/2026",
            time: "05:58 PM",
            title: "Take medicine after meal everyday",
            description: "Take medicine after meal everyday",
            icon: FileText,
            color: "bg-blue-500",
        },
        {
            id: 2,
            date: "12/05/2025",
            time: "12:51 PM",
            title: "Take medicine after meal everyday.",
            description: "Take medicine after meal everyday.",
            icon: FileText,
            color: "bg-indigo-500",
        },
        {
            id: 3,
            date: "11/08/2025",
            time: "05:41 PM",
            title: "Follow Doctor Instruction",
            description: "Eat one egg daily at morning breakfast",
            icon: CheckCircle,
            color: "bg-green-500",
        },
        {
            id: 4,
            date: "10/06/2025",
            time: "05:20 PM",
            title: "Routine Checkup",
            description: "General body checkup and vitals monitoring",
            icon: ActivityIcon,
            color: "bg-purple-500",
        },
    ]);

    function ActivityIcon({ size, className }) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
        )
    }

    return (
        <PatientLayout>
            <IPDHeaderNavbar />
            <div className="min-h-screen p-4 md:p-6 transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
                    {/* Header */}
                    <div className="p-5 border-b flex items-center gap-2 bg-gray-50/50">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Clock className="text-indigo-600" />
                            Timeline
                        </h2>
                    </div>

                    <div className="p-10 md:p-10">
                        <div className="relative border-l-2 border-indigo-200 ml-3 md:ml-6 space-y-8 md:space-y-12">
                            {timelineData.map((item, index) => (
                                <div key={item.id} className="relative pl-10 md:pl-12 group">
                                    {/* Timeline Dot */}
                                    <div className={`absolute -left-[9px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-md ${item.color} group-hover:scale-125 transition-transform duration-300`}></div>

                                    {/* Date Label */}
                                   {/* Date Label */}
<div className="
  mb-2
  md:mb-0
  md:absolute
  md:left-0
  md:-translate-x-full
  md:pr-4
  md:max-w-[160px]
  md:text-right
">
  <span className="
    block
    px-2 py-1
    bg-indigo-50 text-indigo-700
    text-xs font-bold
    rounded
    shadow-sm
    border border-indigo-100
    whitespace-normal
    break-words
  ">
    <span className="block">{item.date}</span>
    <span className="block text-[10px] text-indigo-500">
      {item.time}
    </span>
  </span>
</div>


                                    {/* Content Card */}
                                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 group-hover:bg-white group-hover:border-indigo-100">
                                        <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
}
