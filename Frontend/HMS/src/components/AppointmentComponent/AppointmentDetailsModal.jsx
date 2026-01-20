import { X, Pencil, Trash2 } from "lucide-react";
import { deleteAppointment } from "../../api/appointmentApi";
import { useNotify } from "../../context/NotificationContext";

export default function AppointmentDetailsModal({
  open,
  onClose,
  data,
  onEdit,
  onDeleteSuccess,
}) {
  const notify = useNotify();

  if (!open || !data) return null;

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete appointment APP-${data.id}?`)) {
      try {
        await deleteAppointment(data.id);
        notify('success', 'Appointment deleted successfully');
        onDeleteSuccess && onDeleteSuccess();
        onClose();
      } catch (error) {
        console.error("Error deleting appointment:", error);
        notify('error', 'Failed to delete appointment');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-lg shadow-lg">

        {/* ===== HEADER ===== */}
        <div className="flex justify-between items-center bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-6 py-4 rounded-t-lg">
          <h2 className="font-semibold text-lg">Appointment Details</h2>

          <div className="flex gap-3">
            {/* EDIT */}
            <button
              title="Edit"
              onClick={() => onEdit && onEdit(data)}
              className="hover:text-gray-200"
            >
              <Pencil size={18} />
            </button>

            {/* DELETE */}
            <button
              title="Delete"
              onClick={handleDelete}
              className="hover:text-gray-200"
            >
              <Trash2 size={18} />
            </button>

            {/* CLOSE */}
            <button
              title="Close"
              onClick={onClose}
              className="hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-6">

            {/* Patient Info */}
            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Patient Name</p>
              <p className="font-medium">{data.patient_details?.full_name || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Appointment No</p>
              <p className="font-medium">APP-{data.id}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Gender</p>
              <p className="font-medium capitalize">{data.patient_details?.gender || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Appointment Date</p>
              <p className="font-medium">{new Date(data.appointment_date).toLocaleString()}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Phone</p>
              <p className="font-medium">{data.phone || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Priority</p>
              <p className="font-medium">{data.priority_details?.priority || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Shift</p>
              <p className="font-medium">{data.shift_details?.shift || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Doctor</p>
              <p className="font-medium">{data.doctor_name || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Department</p>
              <p className="font-medium">{data.department || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Fees</p>
              <p className="font-medium">${data.fees}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
              <p className={`font-medium capitalize px-2 py-1 rounded text-xs inline-block ${data.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : data.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : data.status === "scheduled"
                      ? "bg-blue-100 text-blue-800"
                      : data.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}>
                {data.status}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Payment Mode</p>
              <p className="font-medium capitalize">{data.payment_mode || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Source</p>
              <p className="font-medium capitalize">{data.source}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 uppercase mb-1">Created By</p>
              <p className="font-medium">{data.created_by_name || "—"}</p>
            </div>

            <div className="col-span-3">
              <p className="text-xs text-gray-500 uppercase mb-1">Reason</p>
              <p className="font-medium">{data.reason || "—"}</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
