import { X, Pencil, Trash2, Printer } from "lucide-react";
import { deleteAppointment } from "../../api/appointmentApi";
import { getHeaders } from "../../api/setupApi";
import { useNotify } from "../../context/NotificationContext";
import { useState, useEffect } from "react";

export default function AppointmentDetailsModal({
  open,
  onClose,
  data,
  onEdit,
  onDeleteSuccess,
}) {
  const notify = useNotify();
  const [headerData, setHeaderData] = useState(null);

  useEffect(() => {
    if (open) {
      const fetchHeader = async () => {
        try {
          const response = await getHeaders();
          if (response.data && response.data.length > 0) {
            setHeaderData(response.data[0]);
          }
        } catch (error) {
          console.error("Error fetching print headers:", error);
        }
      };
      fetchHeader();
    }
  }, [open]);

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

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const headerImage = headerData?.appointment_header || "";
    const footerText = headerData?.appointment_footer || "";

    printWindow.document.write(`
      <html>
        <head>
          <title>Appointment Print - APP-${data.id}</title>
          <style>
            @page { size: auto;  margin: 0mm; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; color: #333; }
            .header-container { width: 100%; text-align: center; }
            .header-img { width: 100%; max-height: 150px; object-fit: contain; }
            .content { padding: 40px; }
            .print-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6046B5; padding-bottom: 10px; margin-bottom: 30px; }
            .print-header h1 { margin: 0; color: #6046B5; font-size: 24px; }
            .receipt-no { font-size: 14px; font-weight: bold; color: #666; }
            
            .details-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .detail-group { margin-bottom: 15px; border-bottom: 1px border #f0f0f0; padding-bottom: 5px; }
            .label { font-size: 11px; text-transform: uppercase; color: #888; font-weight: 600; display: block; margin-bottom: 2px; }
            .value { font-size: 14px; color: #111; font-weight: 500; }
            
            .reason-box { margin-top: 30px; padding: 15px; background: #f9f9f9; border-radius: 5px; border: 1px solid #eee; }
            .reason-box .label { border-bottom: 1px solid #ddd; margin-bottom: 10px; padding-bottom: 5px; }
            
            .footer { position: fixed; bottom: 0; left: 0; right: 0; padding: 20px 40px; text-align: center; font-size: 12px; border-top: 1px solid #eee; color: #666; background: white; }
            .footer-content { line-height: 1.6; }

            @media print {
              .no-print { display: none; }
              body { padding-bottom: 100px; }
              .footer { position: fixed; bottom: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header-container">
            ${headerImage ? `<img src="${headerImage}" class="header-img" />` : `<div style="padding: 20px; background: #6046B5; color: white;"><h1>HOSPITAL APPOINTMENT</h1></div>`}
          </div>

          <div class="content">
            <div class="print-header">
              <h1>Appointment Slip</h1>
              <div class="receipt-no">No: APP-${data.id}</div>
            </div>

            <div class="details-grid">
              <div class="detail-group">
                <span class="label">Patient Name</span>
                <span class="value">${data.patient_details?.full_name || "—"}</span>
              </div>
              <div class="detail-group">
                <span class="label">Appointment Date</span>
                <span class="value">${new Date(data.appointment_date).toLocaleString()}</span>
              </div>
              <div class="detail-group">
                <span class="label">Gender</span>
                <span class="value" style="text-transform: capitalize;">${data.patient_details?.gender || "—"}</span>
              </div>
              <div class="detail-group">
                <span class="label">Phone Number</span>
                <span class="value">${data.phone || "—"}</span>
              </div>
              <div class="detail-group">
                <span class="label">Doctor Assigned</span>
                <span class="value">${data.doctor_name || "—"}</span>
              </div>
              <div class="detail-group">
                <span class="label">Department</span>
                <span class="value">${data.department || "—"}</span>
              </div>
              <div class="detail-group">
                <span class="label">Consultation Shift</span>
                <span class="value">${data.shift_details?.shift || "—"}</span>
              </div>
              <div class="detail-group">
                <span class="label">Priority Level</span>
                <span class="value">${data.priority_details?.priority || "—"}</span>
              </div>
              <div class="detail-group">
                <span class="label">Consultation Fees</span>
                <span class="value">$${data.fees}</span>
              </div>
              <div class="detail-group">
                <span class="label">Payment Mode</span>
                <span class="value" style="text-transform: capitalize;">${data.payment_mode || "—"}</span>
              </div>
            </div>

            ${data.reason ? `
              <div class="reason-box">
                <span class="label">Reason / Clinical Note</span>
                <div class="value">${data.reason}</div>
              </div>
            ` : ""}

            <div style="margin-top: 50px; display: flex; justify-content: space-between;">
              <div style="text-align: center;">
                <div style="height: 60px;"></div>
                <div style="border-top: 1px solid #777; width: 150px; font-size: 12px; padding-top: 5px;">Patient Signature</div>
              </div>
              <div style="text-align: center;">
                <div style="height: 60px;"></div>
                <div style="border-top: 1px solid #777; width: 150px; font-size: 12px; padding-top: 5px;">Authorised Signatory</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <div class="footer-content">
              ${footerText || "City Hospital - Digital Health Management System"}
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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

            {/* PRINT */}
            <button
              title="Print"
              onClick={handlePrint}
              className="hover:text-gray-200"
            >
              <Printer size={18} />
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
