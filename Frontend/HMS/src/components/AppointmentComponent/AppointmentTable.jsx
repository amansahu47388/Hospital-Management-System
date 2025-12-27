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
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Patient Name","Appointment No","Created By",
                "Appointment Date","Phone","Gender","Doctor",
                "Source","Priority","Live Consultant","Alternate Address",
                "Fees","Discount","Paid","Status",
              ].map(h => (
                <th key={h} className="p-2 text-left">{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{row.patient_name}</td>
                <td className="p-2">{row.appointment_no}</td>
                <td className="p-2">{row.created_by}</td>
                <td className="p-2">{row.appointment_date}</td>
                <td className="p-2">{row.phone}</td>
                <td className="p-2">{row.gender}</td>
                <td className="p-2">{row.doctor}</td>
                <td className="p-2">{row.source}</td>
                <td className="p-2">{row.priority}</td>
                <td className="p-2">{row.live_consultant}</td>
                <td className="p-2">{row.alternate_address}</td>
                <td className="p-2">${row.fees}</td>
                <td className="p-2">{row.discount}%</td>
                <td className="p-2">${row.paid}</td>

                {/* STATUS + ACTIONS */}
                <td
                  className="relative p-2"
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <span className="px-2 py-0.5 text-xs rounded bg-blue-100">
                    {row.status}
                  </span>

                  {hoveredRow === index && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex bg-white shadow rounded px-1">
                      <button
                        className="p-1"
                        onClick={() => {
                          setSelectedAppointment(row);
                          setShowDetails(true);
                        }}
                      >
                        <Eye size={14} />
                      </button>

                      <button
                        className="p-1"
                        onClick={() => setPrintData(row)}
                      >
                        <Printer size={14} />
                      </button>

                      <button
                        className="p-1"
                        onClick={() => {
                          setSelectedAppointment(row);
                          setShowReschedule(true);
                        }}
                      >
                        <Calendar size={14} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     <AppointmentDetailsModal
  open={showDetails}
  data={selectedAppointment}
  onClose={() => setShowDetails(false)}
  onEdit={(row) => {
    setShowDetails(false);
    setSelectedAppointment(row);
    setShowReschedule(true); // opens update popup
  }}
  onDeleteSuccess={() => {
    setShowDetails(false);
    onDelete && onDelete();
  }}
/>

      <RescheduleModal
        open={showReschedule}
        onClose={() => setShowReschedule(false)}
        data={selectedAppointment}
        onSuccess={() => {
          setShowReschedule(false);
          onUpdate && onUpdate();
        }}
      />

      <PrintAppointment
        data={printData}
        onDone={() => setPrintData(null)}
      />
    </>
  );
}
