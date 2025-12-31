import React, { useState } from "react";
import { Eye, Printer, Calendar } from "lucide-react";

import AppointmentDetailsModal from "./AppointmentDetailsModal";
import RescheduleModal from "./RescheduleModal";
import PrintAppointment from "./PrintAppointment";

export default function AppointmentTable({ data, onUpdate }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [printData, setPrintData] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No appointments found
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Patient Name",
                "Appointment No",
                "Created By",
                "Appointment Date & Time",
                "Phone",
                "Gender",
                "Doctor",
                "Source",
                "Priority",
                "Live Consultant",
                "Alternate Address",
                "Fees ($)",
                "Discount (%)",
                "Paid ($)",
                "Status",
              ].map((h) => (
                <th key={h} className="p-2 text-left border">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b hover:bg-gray-50"
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="p-2">{row.patient_name}</td>
                <td className="p-2">{row.appointment_no}</td>
                <td className="p-2">{row.created_by}</td>
                <td className="p-2">{row.appointment_date}</td>
                <td className="p-2">{row.phone}</td>
                <td className="p-2">{row.gender}</td>
                <td className="p-2">
                  {row.doctor_name ||
                    row.doctor_details?.full_name ||
                    "—"}
                </td>
                <td className="p-2">{row.source}</td>
                <td className="p-2">{row.priority}</td>
                <td className="p-2">{row.live_consultant}</td>
                <td className="p-2">{row.alternate_address}</td>
                <td className="p-2">${row.fees}</td>
                <td className="p-2">{row.discount}%</td>
                <td className="p-2">${row.paid}</td>

               {/* STATUS CELL */}
<td className="p-0 relative w-[120px] overflow-hidden">
  <div className="relative flex items-center justify-center h-8 w-full">
    
    {/* STATUS BADGE */}
    {hoveredRow !== index && (
      <span
        className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
          row.status === "approved"
            ? "bg-green-100 text-green-800"
            : row.status === "pending"
            ? "bg-yellow-100 text-yellow-800"
            : row.status === "scheduled"
            ? "bg-blue-100 text-blue-800"
            : row.status === "canceled"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {row.status}
      </span>
    )}

    {/* 🔥 ACTION BUTTONS (STRICTLY INSIDE STATUS CELL) */}
    {hoveredRow === index && (
      <div className=" flex items-center justify-center gap-0 bg-white">
        <button
          title="Details"
          onClick={() => {
            setSelectedAppointment(row);
            setShowDetails(true);
          }}
          className="text-blue-600 hover:text-blue-800"
        >
          <Eye size={14} />
        </button>

        <button
          title="Reschedule"
          onClick={() => {
            setSelectedAppointment(row);
            setShowReschedule(true);
          }}
          className="text-green-600 hover:text-green-800"
        >
          <Calendar size={14} />
        </button>

        <button
          title="Print"
          onClick={() => setPrintData(row)}
          className="text-gray-600 hover:text-gray-800"
        >
          <Printer size={14} />
        </button>
      </div>
    )}
  </div>
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODALS ================= */}

      {showDetails && (
        <AppointmentDetailsModal
          open={showDetails}
          data={selectedAppointment}
          onClose={() => setShowDetails(false)}
          onDeleteSuccess={onUpdate}
        />
      )}

      {showReschedule && (
        <RescheduleModal
          open={showReschedule}
          data={selectedAppointment}
          onClose={() => setShowReschedule(false)}
          onUpdate={onUpdate}
        />
      )}

      {printData && (
        <PrintAppointment
          data={printData}
          onClose={() => setPrintData(null)}
        />
      )}
    </>
  );
}
