import React, { useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

import AppointmentDetailsModal from "./AppointmentDetailsModal";
import EditAppointmentModal from "./EditAppointmentModal";
import RescheduleModal from "./RescheduleModal";
import PrintAppointment from "./PrintAppointment";
import { deleteAppointment } from "../../api/appointmentApi";
import { useNotify } from "../../context/NotificationContext";

export default function AppointmentTable({ data, onUpdate }) {
  const notify = useNotify();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [printData, setPrintData] = useState(null);

  const handleDelete = async (appointment) => {
    if (window.confirm(`Are you sure you want to delete appointment APP-${appointment.id}?`)) {
      try {
        await deleteAppointment(appointment.id);
        notify('success', 'Appointment deleted successfully');
        onUpdate();
      } catch (err) {
        console.error('Error deleting appointment:', err);
        notify('error', 'Failed to delete appointment');
      }
    }
  };

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
        <table className="min-w-full text-sm ">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Patient Name",
                "Appointment No",
                "Created By",
                "Date & Time",
                "Phone",
                "Gender",
                "Doctor",
                "Source",
                "Priority",
                "Shift",
                "Fees ($)",
                "Status",
                "Actions"
              ].map((h) => (
                <th key={h} className="p-2 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50"
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="p-2">{row.patient_name || row.patient_details?.full_name || "—"}</td>
                <td className="p-2">APP-{row.id}</td>
                <td className="p-2">{row.created_by_name || "—"}</td>
                <td className="p-2">{row.appointment_date || "—"}</td>
                <td className="p-2">{row.phone || "—"}</td>
                <td className="p-2">{row.gender || row.patient_details?.gender || "—"}</td>
                <td className="p-2">
                  {row.doctor_name || "—"}
                </td>
                <td className="p-2 capitalize">{row.source || "—"}</td>
                <td className="p-2">
                  {row.priority_details?.priority || "—"}
                </td>
                <td className="p-2">{row.shift_details?.shift || "—"}</td>
                <td className="p-2">${row.fees}</td>

                {/* STATUS CELL */}
                <td className="p-0 relative h-10 overflow-hidden">
                  <div className="relative flex items-center justify-center h-full w-full">

                    {/* STATUS BADGE */}
                    {/* {hoveredRow !== index && ( */}
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap capitalize ${row.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : row.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : row.status === "scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : row.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {row.status}
                    </span>
                    {/* )} */}</div></td>

                {/* ACTIONS CELL */}
                <td className="p-0 relative h-10 overflow-hidden">
                  <div className="relative flex items-center justify-center h-full w-full">
                    <div className=" flex items-center justify-center gap-2 bg-white">
                      <button
                        title="Details"
                        onClick={() => {
                          setSelectedAppointment(row);
                          setShowDetails(true);
                        }}
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        title="Edit"
                        onClick={() => {
                          setSelectedAppointment(row);
                          setShowEdit(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        title="Delete"
                        onClick={() => handleDelete(row)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
          onEdit={(appointment) => {
            setShowDetails(false);
            setSelectedAppointment(appointment);
            setShowEdit(true);
          }}
          onDeleteSuccess={onUpdate}
        />
      )}

      {showEdit && (
        <EditAppointmentModal
          open={showEdit}
          data={selectedAppointment}
          onClose={() => setShowEdit(false)}
          onSuccess={onUpdate}
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
