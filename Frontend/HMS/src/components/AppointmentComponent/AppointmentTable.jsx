import React, { useState } from "react";
import { Eye, Printer, Calendar } from "lucide-react";
import AppointmentDetailsModal from "./AppointmentDetailsModal";
import RescheduleModal from "./RescheduleModal";
import PrintAppointment from "./PrintAppointment";

export default function AppointmentTable({ data, onUpdate, onDelete }) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [printData, setPrintData] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        No data available
      </div>
    );
  }

  return (
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
              <th key={h} className="p-2 text-left border-gray-100">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody> 
          {data.length === 0 ? (
            <tr>
              <td colSpan="15" className="p-4 text-center text-gray-500">
                No appointments found
              </td>
            </tr>
          ) : (
             data.map((row, index) => (
            <tr key={index} className="border-b">
              <td className="p-2">{row.patient_name}</td>
              <td className="p-2">{row.appointment_no}</td>
              <td className="p-2">{row.created_by}</td>
              <td className="p-2">{row.appointment_date}</td>
              <td className="p-2">{row.phone}</td>
              <td className="p-2">{row.gender}</td>
              <td className="p-2">{row.doctor_name || row.doctor_details?.full_name || "—"}</td>
              <td className="p-2">{row.source}</td>
              <td className="p-2">{row.priority}</td>
              <td className="p-2">{row.live_consultant}</td>
              <td className="p-2">{row.alternate_address}</td>
              <td className="p-2">${row.fees}</td>
              <td className="p-2">{row.discount}%</td>
              <td className="p-2">${row.paid}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    row.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : row.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : row.status === "scheduled"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))
          )}
        </tbody>
      </table>
    </div>
  );
}
