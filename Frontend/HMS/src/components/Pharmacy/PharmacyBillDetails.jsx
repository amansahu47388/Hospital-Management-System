import { X, Printer } from "lucide-react";
import { useState, useEffect } from "react";
import { getHeaders } from "../../api/setupApi";
import { printReport } from "../../utils/printUtils";

export default function PharmacyBillDetail({ bill, onClose }) {
  const [headerData, setHeaderData] = useState(null);

  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const res = await getHeaders();
        if (res.data && res.data.length > 0) {
          setHeaderData(res.data[0]);
        }
      } catch (error) {
        console.error("Error fetching bill headers:", error);
      }
    };
    fetchHeaders();
  }, []);

  const printBill = () => {
    if (!bill) return;

    const content = `
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #6046B5; padding-bottom: 5px; margin-bottom: 20px;">
          <h2 style="margin:0; color:#6046B5; font-size:20px;">PHARMACY BILL</h2>
          <div style="text-align:right; font-size:12px; font-weight:bold;">
            <div>Bill No: ${bill.id}</div>
            <div>Date: ${new Date(bill.bill_date || bill.created_at || Date.now()).toLocaleString()}</div>
          </div>
        </div>

        <div class="data-grid" style="background:#f9f9f9; padding:15px; border-radius:8px; border:1px solid #eee;">
          <div class="data-item"><span class="data-label">Patient Name</span><span class="data-value">: ${bill.patient_name}</span></div>
          <div class="data-item"><span class="data-label">Phone</span><span class="data-value">: ${bill.patient_phone || "—"}</span></div>
          <div class="data-item"><span class="data-label">Consultant Doctor</span><span class="data-value">: ${bill.doctor_name || "—"}</span></div>
          <div class="data-item"><span class="data-label">Case ID</span><span class="data-value">: ${bill.case_id || "—"}</span></div>
        </div>

        <div class="report-section-title">Medicine Details</div>
        <table class="report-table">
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Batch No</th>
              <th>Expiry</th>
              <th style="text-align:center">Qty</th>
              <th style="text-align:center">Tax (%)</th>
              <th style="text-align:center">Disc (%)</th>
              <th style="text-align:right">Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            ${bill.items?.map(i => `
              <tr>
                <td>${i.medicine_name}</td>
                <td>${i.batch_no}</td>
                <td>${i.expiry_date || "—"}</td>
                <td style="text-align:center">${i.quantity}</td>
                <td style="text-align:center">${i.tax_percentage}%</td>
                <td style="text-align:center">${i.discount_percentage}%</td>
                <td style="text-align:right">${Number(i.amount).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display:flex; justify-content:flex-end; margin-top:30px;">
          <div style="width:250px; font-size:13px; line-height:1.8;">
            <div style="display:flex; justify-content:space-between;"><span>Total Amount</span><span>$${Number(bill.total_amount).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Total Tax</span><span>$${Number(bill.tax_amount).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Discount</span><span>$${Number(bill.discount_amount).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; border-top:1px solid #eee; margin-top:5px; padding-top:5px;"><span>Net Amount</span><span>$${Number(bill.net_amount).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between; color:green;"><span>Paid Amount</span><span>$${Number(bill.paid_amount).toFixed(2)}</span></div>
            <div style="display:flex; justify-content:space-between; font-weight:bold; color:red; border-top:1px dashed #ccc; margin-top:5px; padding-top:5px;"><span>Balance Due</span><span>$${Number(bill.balance_amount).toFixed(2)}</span></div>
          </div>
        </div>

        <div class="signature-section">
          <div class="sig-box">
            <div style="font-size:11px; color:#888;">Collected By: ${bill.created_by_name}</div>
            <div class="sig-line"></div>
            <div class="sig-label">Cashier Signature</div>
          </div>
          <div class="sig-box">
            <div class="sig-line"></div>
            <div class="sig-label">Authorised Signatory</div>
          </div>
        </div>
    `;

    printReport({
      title: `Pharmacy Bill - ${bill.id}`,
      headerImg: headerData?.pharmacy_bill_header,
      footerText: headerData?.pharmacy_bill_footer,
      content: content
    });
  };
  return (

    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-[95%] max-w-5xl rounded shadow-lg overflow-hidden">

        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center px-4 py-2 text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
          <h2 className="font-semibold text-lg">Pharmacy Bill</h2>
          <div className="flex gap-3">
            <Printer size={20} className="cursor-pointer" onClick={printBill} />
            <X size={20} onClick={onClose} className="cursor-pointer" />
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-4 text-sm print:p-0">

          {/* BILL INFO */}
          <div className="flex justify-between border-b border-gray-300 pb-2 mb-3">
            <div>
              <div><b>Bill No:</b> {bill.id}</div>
            </div>
            <div>
              <b>Date:</b> {new Date(bill.bill_date || bill.created_at || Date.now()).toLocaleString()}
            </div>
          </div>

          {/* PATIENT / DOCTOR INFO */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-300 pb-3 mb-4">
            <div className="space-y-1">
              <div><b>Name:</b> {bill.patient_name}</div>
              <div><b>Doctor:</b> {bill.doctor_name}</div>
              <div><b>Prescription:</b> {bill.case_id || "-"}</div>
            </div>
            <div className="space-y-1 text-right">
              <div><b>Phone:</b> {bill.patient_phone || "-"}</div>
              <div><b>Case ID:</b> {bill.case_id || "-"}</div>
            </div>
          </div>

          {/* ================= MEDICINE TABLE ================= */}
          <table className="w-full text-sm ">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-1">Medicine Name</th>
                <th className="text-left py-1">Batch No</th>
                <th className="text-left py-1">Expiry Date</th>
                <th className="text-center py-1">Quantity</th>
                <th className="text-center py-1">Tax</th>
                <th className="text-center py-1">Discount</th>
                <th className="text-right py-1">Amount ($)</th>
              </tr>
            </thead>
            <tbody>
              {bill.items?.map((i, idx) => (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="py-1">{i.medicine_name}</td>
                  <td>{i.batch_no}</td>
                  <td>{i.expiry_date || "-"}</td>
                  <td className="text-center">{i.quantity}</td>
                  <td className="text-center">{i.tax_percentage}%</td>
                  <td className="text-center">{i.discount_percentage}%</td>
                  <td className="text-right">{Number(i.amount).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ================= FOOTER ================= */}
          <div className="flex justify-between mt-4 pt-3">

            <div>
              <div><b>Collected By:</b> {bill.created_by_name}</div>
            </div>

            <div className="w-72 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Total ($)</span>
                <span>{Number(bill.total_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Discount ($)</span>
                <span>{Number(bill.discount_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Tax ($)</span>
                <span>{Number(bill.tax_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Net Amount ($)</span>
                <span>{Number(bill.net_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Paid ($)</span>
                <span>{Number(bill.paid_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Due ($)</span>
                <span>{Number(bill.balance_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}