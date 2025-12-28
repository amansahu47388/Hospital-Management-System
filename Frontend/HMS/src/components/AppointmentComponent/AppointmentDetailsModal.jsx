import { X, Pencil, Trash2 } from "lucide-react";
import { deleteAppointment } from "../../api/appointmentApi";

export default function AppointmentDetailsModal({
  open,
  onClose,
  data,
  onEdit,
  onDeleteSuccess,
}) {
  if (!open || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[900px] rounded shadow-lg">

        {/* ===== HEADER ===== */}
        <div className="flex justify-between items-center bg-purple-600 text-white px-4 py-3 rounded-t">
          <h2 className="font-semibold text-sm">Appointment Details</h2>

          <div className="flex gap-3">
            {/* EDIT */}
            <button
              title="Edit"
              onClick={() => onEdit(data)}
              className="hover:text-gray-200"
            >
              <Pencil size={16} />
            </button>

            {/* DELETE */}
            <button
              title="Delete"
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete this appointment?")) {
                  try {
                    await deleteAppointment(data.id);
                    onDeleteSuccess && onDeleteSuccess();
                    onClose();
                  } catch (error) {
                    console.error("Error deleting appointment:", error);
                    alert("Failed to delete appointment");
                  }
                }
              }}
              className="hover:text-gray-200"
            >
              <Trash2 size={16} />
            </button>

            {/* CLOSE */}
            <button
              title="Close"
              onClick={onClose}
              className="hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="p-6 text-sm">
          <div className="grid grid-cols-2 gap-y-3 gap-x-12">

            {/* LEFT COLUMN */}
            <p><b>Patient Name</b><br />{data.patient_name}</p>
            <p><b>Appointment No</b><br />{data.appointment_no}</p>

            <p><b>Age</b><br />{data.age || "-"}</p>
            <p><b>Appointment S.No.</b><br />{data.serial_no || "-"}</p>

            <p><b>Email</b><br />{data.email || "-"}</p>
            <p><b>Appointment Date</b><br />{data.appointment_date}</p>

            <p><b>Phone</b><br />{data.phone}</p>
            <p><b>Appointment Priority</b><br />{data.priority}</p>

            <p><b>Gender</b><br />{data.gender}</p>
            <p><b>Shift</b><br />{data.shift || "-"}</p>

            <p><b>Doctor</b><br />{data.doctor}</p>
            <p><b>Slot</b><br />{data.slot || "-"}</p>

            <p><b>Department</b><br />{data.department || "-"}</p>
            <p><b>Amount</b><br />${data.fees}</p>

            <p><b>Live Consultation</b><br />{data.live_consultant}</p>
            <p><b>Status</b><br />{data.status}</p>

            <p><b>Payment Note</b><br />{data.payment_note || "-"}</p>
            <p><b>Payment Mode</b><br />{data.payment_mode || "-"}</p>

            <p><b>Message</b><br />{data.message || "-"}</p>
            <p><b>Transaction ID</b><br />{data.transaction_id || "-"}</p>

            <p><b>Source</b><br />{data.source}</p>
            <p><b>Collected By</b><br />{data.collected_by || "-"}</p>

          </div>
        </div>
      </div>
    </div>
  );
}
