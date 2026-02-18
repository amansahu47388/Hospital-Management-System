import React, { useState, useEffect } from "react";
import { X, Printer } from "lucide-react";
import { getRadiologyBillDetail } from "../../api/radiologyApi";
import { getHeaders } from "../../api/setupApi";
import { printReport } from "../../utils/printUtils";
import { useNotify } from "../../context/NotificationContext";

export default function RadiologyBillDetails({ open, billId, onClose }) {
  const notify = useNotify();

  // ✅ default structure to avoid crashes
  const [bill, setBill] = useState({
    items: [],
  });
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
        console.error("Error fetching radiology headers:", err);
      }
    };
    fetchHeaders();
  }, []);

  useEffect(() => {
    if (!open || !billId) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getRadiologyBillDetail(billId);
        const data = res?.data || res;

        // ✅ normalize items array (backend returns 'items' not 'tests')
        setBill({
          ...data,
          items: data?.items || [],
        });
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
          <h2 style="margin:0; color:#6046B5; font-size:20px;">RADIOLOGY BILL</h2>
          <div style="text-align:right; font-size:12px; font-weight:bold;">
            <div>No: RBILL${bill.id}</div>
            <div>Date: ${new Date(bill.created_at).toLocaleDateString()}</div>
          </div>
        </div>

        <div class="data-grid" style="background:#f9f9f9; padding:15px; border-radius:8px; border:1px solid #eee;">
          <div class="data-item"><span class="data-label">Patient Name</span><span class="data-value">: ${bill.patient_name || "—"}</span></div>
          <div class="data-item"><span class="data-label">Patient ID</span><span class="data-value">: PID${bill.patient || "—"}</span></div>
          <div class="data-item"><span class="data-label">Gender / Age</span><span class="data-value">: ${bill.patient_gender || "—"} / ${bill.patient_age ? bill.patient_age + 'Y' : "—"}</span></div>
          <div class="data-item"><span class="data-label">Consultant Doctor</span><span class="data-value">: ${bill.doctor_name || "—"}</span></div>
          <div class="data-item"><span class="data-label">Blood Group</span><span class="data-value">: ${bill.patient_blood_group || "—"}</span></div>
          <div class="data-item"><span class="data-label">Case ID</span><span class="data-value">: ${bill.case_id || "—"}</span></div>
        </div>

        <div class="report-section-title">Imaging Test Details</div>
        <table class="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Test Name</th>
              <th>Report Date</th>
              <th style="text-align:right">Price ($)</th>
              <th style="text-align:right">Tax ($)</th>
              <th style="text-align:right">Total ($)</th>
            </tr>
          </thead>
          <tbody>
            ${bill.items?.map((item, idx) => `
              <tr>
                <td>${idx + 1}</td>
                <td style="font-weight:600">${item.test_name}</td>
                <td>${item.report_date ? new Date(item.report_date).toLocaleDateString() : "—"}</td>
                <td style="text-align:right">${Number(item.price || 0).toFixed(2)}</td>
                <td style="text-align:right">${Number(item.tax || 0).toFixed(2)}</td>
                <td style="text-align:right; font-weight:600">${(Number(item.price || 0) + Number(item.tax || 0)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display:flex; justify-content:flex-end; margin-top:30px;">
          <div style="width:250px; font-size:13px; line-height:1.8;">
            <div style="display:flex; justify-content:space-between;"><span>Subtotal</span><span>$${Number(bill.subtotal || 0).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Total Tax</span><span>$${Number(bill.tax || 0).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Discount</span><span>$${Number(bill.discount || 0).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; border-top:1px solid #eee; margin-top:5px; padding-top:5px;"><span>Net Amount</span><span>$${Number(bill.total_amount || 0).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between; color:green;"><span>Paid Amount</span><span>$${Number(bill.paid_amount || 0).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; color:red; border-top:1px dashed #ccc; margin-top:5px; padding-top:5px;"><span>Balance Due</span><span>$${Number(bill.balance || 0).toFixed(2)}</span></div>
          </div>
        </div>

        <div class="signature-section">
          <div class="sig-box">
             <div style="font-size:11px; color:#888;">Generated By: ${bill.created_by_name || "—"}</div>
            <div class="sig-line"></div>
            <div class="sig-label">Radiologist Signature</div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Authorised Signatory</div>
          </div>
        </div>
    `;

    printReport({
      title: `Radiology Bill - RBILL${bill.id}`,
      headerImg: headerData?.radiology_bill_header,
      footerText: headerData?.radiology_bill_footer,
      content: content
    });
  };

  if (!open) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        Loading bill details...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* ================= HEADER ================= */}
      <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 flex justify-between items-center no-print">
        <h2 className="font-semibold text-xl">Bill Details</h2>
        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"
            title="Print Bill"
          >
            <Printer size={20} />
          </button>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-1.5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="p-4 text-sm space-y-6 overflow-y-auto">

        {/* DETAILS GRID */}
        <div className="grid md:grid-cols-3 gap-6">
          <Detail label="Bill No" value={bill.id || `#${bill.id}`} />
          <Detail label="Case ID" value={bill.case_id || "-"} />
          <Detail label="Patient Name" value={bill.patient_name || "-"} />

          <Detail label="Prescription ID" value={bill.prescription_id ? `#${bill.prescription_id}` : "-"} />
          <Detail label="Age" value={bill.patient_age !== null && bill.patient_age !== undefined ? `${bill.patient_age} years` : "-"} />
          <Detail label="Gender" value={bill.patient_gender || "-"} />

          <Detail label="Doctor Name" value={bill.doctor_name || "-"} />
          <Detail label="Mobile No" value={bill.patient_phone || "-"} />
          <Detail label="Email" value={bill.patient_email || "-"} />

          <Detail label="Blood Group" value={bill.patient_blood_group || "-"} />
          <Detail label="Address" value={bill.patient_address || "-"} />
          <Detail label="Generated By" value={bill.created_by_name || "-"} />

        </div>

        {/* FINANCIAL SUMMARY */}
        <div className="grid md:grid-cols-3 gap-6 border-t border-gray-300 pt-4">
          <div />
          <div />
          <div>
            <Detail label="Subtotal ($)" value={bill.subtotal ? `$${Number(bill.subtotal).toFixed(2)}` : "-"} />
            <Detail label="Discount ($)" value={bill.discount ? `$${Number(bill.discount).toFixed(2)}` : "-"} />
            <Detail label="Tax ($)" value={bill.tax ? `$${Number(bill.tax).toFixed(2)}` : "-"} />
            <Detail label="Net Amount ($)" value={bill.total_amount ? `$${Number(bill.total_amount).toFixed(2)}` : "-"} bold />
            <Detail label="Paid Amount ($)" value={bill.paid_amount ? `$${Number(bill.paid_amount).toFixed(2)}` : "-"} />
            <Detail
              label="Balance ($)"
              value={bill.balance !== null && bill.balance !== undefined ? `$${Number(bill.balance).toFixed(2)}` : "-"}
              className={bill.balance > 0 ? "text-red-600 font-semibold" : bill.balance === 0 ? "text-green-600 font-semibold" : ""}
            />
            <Detail label="Payment Mode" value={bill.payment_mode ? bill.payment_mode.charAt(0).toUpperCase() + bill.payment_mode.slice(1) : "-"} />
          </div>
        </div>

        {/* TEST TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full  text-sm">
            <thead className="bg-gray-100">
              <tr>
                <Th>S.No</Th>
                <Th>Test Name</Th>
                <Th>Report Days</Th>
                <Th>Report Date</Th>
                <Th>Price ($)</Th>
                <Th>Tax ($)</Th>
                <Th>Total ($)</Th>
              </tr>
            </thead>
            <tbody>
              {bill.items && bill.items.length > 0 ? (
                bill.items.map((item, i) => {
                  const total = Number(item.price || 0) + Number(item.tax || 0);
                  return (
                    <tr key={item.id || i} className="hover:bg-gray-50">
                      <Td>{i + 1}</Td>
                      <Td className="font-medium">
                        {item.test_name || "-"}
                      </Td>
                      <Td>{item.report_days ? `${item.report_days} days` : "-"}</Td>
                      <Td>
                        {item.report_date
                          ? new Date(item.report_date).toLocaleDateString()
                          : "-"}
                      </Td>
                      <Td>${Number(item.price || 0).toFixed(2)}</Td>
                      <Td>${Number(item.tax || 0).toFixed(2)}</Td>
                      <Td className="font-semibold">${total.toFixed(2)}</Td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-4 text-gray-500"
                  >
                    No tests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Detail = ({ label, value, bold, className = "" }) => (
  <div className="grid grid-cols-2 gap-2 py-1">
    <span className="text-gray-600 font-bold">{label}:</span>
    <span className={`${bold ? "font-bold" : ""} ${className}`}>
      {value ?? "-"}
    </span>
  </div>
);

const Th = ({ children }) => (
  <th className="  px-2 py-1 text-left font-semibold">
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`border px-2 py-2 align-top ${className}`}>
    {children}
  </td>
);
