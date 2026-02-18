import React, { useState, useEffect } from "react";
import { X, Printer } from "lucide-react";
import { getAmbulanceBillDetail } from "../../api/ambulanceApi";
import { getHeaders } from "../../api/setupApi";
import { printReport } from "../../utils/printUtils";
import { useNotify } from "../../context/NotificationContext";

const Detail = ({ label, value, bold = false, className = "" }) => (
  <div className={`${className}`}>
    <div className="text-gray-600 text-xs mb-1">{label}</div>
    <div className={`${bold ? "font-bold" : ""} text-gray-800`}>{value || "-"}</div>
  </div>
);

export default function AmbulanceBillDetail({ open, billId, onClose }) {
  const notify = useNotify();
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [headerData, setHeaderData] = useState(null);

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const res = await getHeaders();
        if (res.data && res.data.length > 0) {
          setHeaderData(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching ambulance headers:", err);
      }
    };
    fetchHeaders();
  }, []);

  useEffect(() => {
    if (!open || !billId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getAmbulanceBillDetail(billId);
        setBill(res.data);
      } catch (err) {
        const errorMsg = err?.response?.data?.error || err?.message || "Failed to load bill details";
        notify("error", errorMsg);
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [open, billId, notify, onClose]);

  const handlePrint = () => {
    if (!bill) return;

    const content = `
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #6046B5; padding-bottom: 5px; margin-bottom: 20px;">
          <h2 style="margin:0; color:#6046B5; font-size:20px;">AMBULANCE BILL</h2>
          <div style="text-align:right; font-size:12px; font-weight:bold;">
            <div>No: AMBB${bill.id}</div>
            <div>Date: ${new Date(bill.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <div class="data-grid" style="background:#f9f9f9; padding:15px; border-radius:8px; border:1px solid #eee;">
          <div class="data-item"><span class="data-label">Patient Name</span><span class="data-value">: ${bill.patient_name || "—"}</span></div>
          <div class="data-item"><span class="data-label">Patient ID</span><span class="data-value">: PID${bill.patient || "—"}</span></div>
          <div class="data-item"><span class="data-label">Vehicle Info</span><span class="data-value">: ${bill.ambulance_details?.vehicle_number || "—"} (${bill.ambulance_details?.vehicle_model || ""})</span></div>
          <div class="data-item"><span class="data-label">Driver Info</span><span class="data-value">: ${bill.ambulance_details?.driver_name || "—"} (${bill.ambulance_details?.driver_contact || ""})</span></div>
          <div class="data-item"><span class="data-label">Charge Name</span><span class="data-value">: ${bill.charge_details?.charge_name || "—"}</span></div>
          <div class="data-item"><span class="data-label">Case ID</span><span class="data-value">: ${bill.case_id || "—"}</span></div>
        </div>

        <div class="report-section-title">Transport Fee Details</div>
        <table class="report-table">
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align:right">Price ($)</th>
              <th style="text-align:right">Tax ($)</th>
              <th style="text-align:right">Total ($)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ambulance Charge: ${bill.charge_details?.charge_name || "Support"}</td>
              <td style="text-align:right">${Number(bill.total_amount || 0).toFixed(2)}</td>
              <td style="text-align:right">${Number(bill.tax || 0).toFixed(2)}</td>
              <td style="text-align:right; font-weight:600">${Number(bill.net_amount || 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div style="display:flex; justify-content:flex-end; margin-top:30px;">
          <div style="width:250px; font-size:13px; line-height:1.8;">
            <div style="display:flex; justify-content:space-between;"><span>Total Amount</span><span>$${Number(bill.total_amount || 0).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Total Tax</span><span>$${Number(bill.tax || 0).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Discount</span><span>$${Number(bill.discount || 0).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; border-top:1px solid #eee; margin-top:5px; padding-top:5px;"><span>Net Amount</span><span>$${Number(bill.net_amount || 0).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between; color:green;"><span>Paid Amount</span><span>$${Number(bill.paid_amount || 0).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; color:red; border-top:1px dashed #ccc; margin-top:5px; padding-top:5px;"><span>Balance Due</span><span>$${Number(bill.balance || 0).toFixed(2)}</span></div>
          </div>
        </div>

        <div class="signature-section">
          <div class="sig-box">
             <div style="font-size:11px; color:#888;">Generated By: ${bill.created_by_name || "—"}</div>
            <div class="sig-line"></div>
            <div class="sig-label">Authorised Person</div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Patient/Guardian</div>
          </div>
        </div>
    `;

    printReport({
      title: `Ambulance Bill - AMBB${bill.id}`,
      headerImg: headerData?.ambulance_bill_header,
      footerText: headerData?.ambulance_bill_footer,
      content: content
    });
  };

  if (!open) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          Loading bill details...
        </div>
      </div>
    );
  }

  if (!bill) return null;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-6 py-4 flex justify-between items-center rounded-t-lg no-print">
          <h2 className="font-semibold text-xl">Ambulance Bill Details</h2>
          <div className="flex gap-4">
            <button
              onClick={handlePrint}
              className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"
              title="Print Bill"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={onClose}
              className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* BILL INFO */}
            <div className="grid md:grid-cols-3 gap-4">
              <Detail label="Bill No" value={bill.id} />
              <Detail label="Patient Name" value={bill.patient_name || "-"} />
              <Detail label="Patient Phone" value={bill.patient_phone || "-"} />
              <Detail label="Case ID" value={bill.case_id || "-"} />
              <Detail label="Date" value={formatDate(bill.date)} />
              <Detail label="Generated By" value={bill.created_by_name || "-"} />
              <Detail label="Payment Mode" value={bill.payment_mode ? bill.payment_mode.charAt(0).toUpperCase() + bill.payment_mode.slice(1) : "-"} />
            </div>

            {/* AMBULANCE DETAILS */}
            {bill.ambulance_details && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Ambulance Details</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Detail label="Vehicle Number" value={bill.ambulance_details.vehicle_number} />
                  <Detail label="Vehicle Model" value={bill.ambulance_details.vehicle_model} />
                  <Detail label="Driver Name" value={bill.ambulance_details.driver_name} />
                  <Detail label="Driver Contact" value={bill.ambulance_details.driver_contact} />
                </div>
              </div>
            )}

            {/* CHARGE DETAILS */}
            {bill.charge_details && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-800 mb-3">Charge Details</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Detail label="Category" value={bill.charge_details.category} />
                  <Detail label="Charge Name" value={bill.charge_details.charge_name} />
                  <Detail label="Standard Charge ($)" value={bill.charge_details.standard_charge ? `$${Number(bill.charge_details.standard_charge).toFixed(2)}` : "-"} />
                  {bill.charge_details.tax !== undefined && (
                    <Detail label="Tax ($)" value={bill.charge_details.tax ? `$${Number(bill.charge_details.tax).toFixed(2)}` : "-"} />
                  )}
                </div>
              </div>
            )}

            {/* NOTE */}
            {bill.note && (
              <div className="border-t border-gray-200 pt-4">
                <Detail label="Note" value={bill.note} />
              </div>
            )}

            {/* FINANCIAL SUMMARY */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Financial Summary</h3>
              <div className="grid md:grid-cols-2 gap-4 max-w-md">
                <Detail label="Total Amount ($)" value={bill.total_amount ? `$${Number(bill.total_amount).toFixed(2)}` : "-"} />
                <Detail label="Discount ($)" value={bill.discount ? `$${Number(bill.discount).toFixed(2)}` : "-"} />
                <Detail label="Tax ($)" value={bill.tax ? `$${Number(bill.tax).toFixed(2)}` : "-"} />
                <Detail label="Net Amount ($)" value={bill.net_amount ? `$${Number(bill.net_amount).toFixed(2)}` : "-"} bold />
                <Detail label="Paid Amount ($)" value={bill.paid_amount ? `$${Number(bill.paid_amount).toFixed(2)}` : "-"} />
                <Detail
                  label="Balance ($)"
                  value={bill.balance !== null && bill.balance !== undefined ? `$${Number(bill.balance).toFixed(2)}` : "-"}
                  className={bill.balance > 0 ? "text-red-600 font-semibold" : bill.balance === 0 ? "text-green-600 font-semibold" : ""}
                />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
