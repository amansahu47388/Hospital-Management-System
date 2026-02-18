import { useState, useEffect } from "react";
import { X, Printer } from "lucide-react";
import { getHeaders } from "../../api/setupApi";
import { printReport } from "../../utils/printUtils";

const BillSummary = ({ isOpen, onClose, charges, payments }) => {
    const [headerData, setHeaderData] = useState(null);

    useEffect(() => {
        const fetchHeaders = async () => {
            try {
                const res = await getHeaders();
                if (res.data && res.data.length > 0) {
                    setHeaderData(res.data[0]);
                }
            } catch (err) {
                console.error("Error fetching summary headers:", err);
            }
        };
        if (isOpen) fetchHeaders();
    }, [isOpen]);

    if (!isOpen) return null;

    const totalCharges = charges.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
    const totalPayments = payments.reduce((sum, p) => sum + parseFloat(p.paid_amount || 0), 0);
    const balanceAmount = totalCharges - totalPayments;

    const handlePrint = () => {
        const content = `
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #6046B5; padding-bottom: 5px; margin-bottom: 20px;">
                <h2 style="margin:0; color:#6046B5; font-size:20px;">BILL SUMMARY REPORT</h2>
                <div style="text-align:right; font-size:12px; font-weight:bold;">
                    <div>Date: ${new Date().toLocaleDateString()}</div>
                </div>
            </div>

            <div class="report-section-title">Case Charges Breakdown</div>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Charge</th>
                        <th>Category</th>
                        <th style="text-align:right">Subtotal ($)</th>
                        <th style="text-align:right">Total ($)</th>
                    </tr>
                </thead>
                <tbody>
                    ${charges.map(c => `
                        <tr>
                            <td>${c.charge_date || new Date(c.created_at).toLocaleDateString()}</td>
                            <td>${c.charge_name}</td>
                            <td>${c.charge_category}</td>
                            <td style="text-align:right">${Number(c.standard_charge || 0).toFixed(2)}</td>
                            <td style="text-align:right; font-weight:600">${Number(c.amount || 0).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    ${charges.length === 0 ? '<tr><td colspan="5" style="text-align:center">No charges found</td></tr>' : ''}
                </tbody>
            </table>

            <div class="report-section-title">Transactions / Payments</div>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Service</th>
                        <th>Mode</th>
                        <th style="text-align:right">Paid Amount ($)</th>
                    </tr>
                </thead>
                <tbody>
                    ${payments.map(p => `
                        <tr>
                            <td>${p.payment_date}</td>
                            <td>${p.service_type || "General"}</td>
                            <td>${p.payment_mode}</td>
                            <td style="text-align:right; font-weight:600">${Number(p.paid_amount || 0).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    ${payments.length === 0 ? '<tr><td colspan="4" style="text-align:center">No payments found</td></tr>' : ''}
                </tbody>
            </table>

            <div style="display:flex; justify-content:flex-end; margin-top:30px;">
                <div style="width:280px; font-size:14px; line-height:2;">
                    <div style="display:flex; justify-content:space-between;"><span>Gross Total</span><span>$${totalCharges.toFixed(2)}</span></div>
                    <div style="display:flex; justify-content:space-between; color:green;"><span>Total Collected</span><span>$${totalPayments.toFixed(2)}</span></div>
                    <div style="display:flex; justify-content:space-between; font-weight:bold; border-top:2px solid #6046B5; margin-top:5px; padding-top:5px;">
                        <span>Final Balance</span><span>$${balanceAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div class="signature-section" style="margin-top:60px;">
                <div class="sig-box">
                    <div class="sig-line"></div>
                    <div class="sig-label">Accountant Signature</div>
                </div>
                <div class="sig-box">
                    <div class="sig-line"></div>
                    <div class="sig-label">Authorised Officer</div>
                </div>
            </div>
        `;

        printReport({
            title: "Patient Bill Summary",
            headerImg: headerData?.bill_summary_header,
            footerText: headerData?.bill_summary_footer,
            content: content
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-full max-h-full overflow-y-auto animate-zoom-in">
                <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded-t-lg">
                    <h3 className="text-lg font-semibold">Bill Summary</h3>
                    <div className="flex items-center gap-3">
                        <Printer size={20} className="cursor-pointer hover:opacity-80" onClick={handlePrint} />
                        <X size={20} className="cursor-pointer hover:opacity-80 text-xl" onClick={onClose} />
                    </div>
                </div>

                <div className="p-6 text-sm text-gray-700">
                    {/* OPD Charges Section */}
                    <h4 className="text-[#6046B5] font-bold mb-2">OPD Charges</h4>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left mb-2">
                            <thead className="border-b border-gray-200 bg-gray-100">
                                <tr>
                                    <th className="py-2">Date</th>
                                    <th className="py-2">charge Name</th>
                                    <th className="py-2">charge Type</th>
                                    <th className="py-2 text-right">Charge Category</th>
                                    <th className="py-2 text-right">Standard Charge</th>
                                    <th className="py-2 text-right">Discount</th>
                                    <th className="py-2 text-right">Tax</th>
                                    <th className="py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {charges.length > 0 ? (
                                    charges.map((c) => (
                                        <tr key={c.id}>
                                            <td className="py-2">{c.charge_date || new Date(c.created_at).toLocaleDateString()}</td>
                                            <td className="py-2">{c.charge_name}</td>
                                            <td className="py-2">{c.charge_type}</td>
                                            <td className="py-2 text-right">${parseFloat(c.standard_charge || 0).toFixed(2)}</td>
                                            <td className="py-2 text-right">${parseFloat(c.discount || 0).toFixed(2)}</td>
                                            <td className="py-2 text-right">${parseFloat(c.tax || 0).toFixed(2)}</td>
                                            <td className="py-2 text-right">${parseFloat(c.amount || 0).toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center text-gray-400">No charges found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* IPD Charges Section */}
                    <h4 className="text-[#6046B5] font-bold mb-2">IPD Charges</h4>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left mb-2">
                            <thead className="border-b border-gray-200 bg-gray-100">
                                <tr>
                                    <th className="py-2 text-left">Date</th>
                                    <th className="py-2 text-left">charge Name</th>
                                    <th className="py-2 text-left">charge Type</th>
                                    <th className="py-2 text-left">Charge Category</th>
                                    <th className="py-2 text-left">Standard Charge</th>
                                    <th className="py-2 text-left">Discount</th>
                                    <th className="py-2 text-left">Tax</th>
                                    <th className="py-2 text-left">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {charges.length > 0 ? (
                                    charges.map((c) => (
                                        <tr key={c.id}>
                                            <td className="py-2">{c.charge_date || new Date(c.created_at).toLocaleDateString()}</td>
                                            <td className="py-2">{c.charge_name}</td>
                                            <td className="py-2">{c.charge_type}</td>
                                            <td className="py-2 ">${parseFloat(c.standard_charge || 0).toFixed(2)}</td>
                                            <td className="py-2 ">${parseFloat(c.discount || 0).toFixed(2)}</td>
                                            <td className="py-2">${parseFloat(c.tax || 0).toFixed(2)}</td>
                                            <td className="py-2">${parseFloat(c.amount || 0).toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center text-gray-400">No charges found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAthology Charges Section */}
                    <h4 className="text-[#6046B5] font-bold mb-2">Pathology Charges</h4>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left mb-2">
                            <thead className="border-b border-gray-200 bg-gray-100">
                                <tr>
                                    <th className="py-2 text-left">Bill No</th>
                                    <th className="py-2 text-left">Doctor</th>
                                    <th className="py-2 text-left">Amount</th>
                                    <th className="py-2 text-left">Discount</th>
                                    <th className="py-2 text-left">Tax</th>
                                    <th className="py-2 text-left">Net Amount</th>
                                    <th className="py-2 text-left">Paid Amount</th>
                                    <th className="py-2 text-left">Balance Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {charges.length > 0 ? (
                                    charges.map((c) => (
                                        <tr key={c.id}>
                                            <td className="py-2">{c.bill_no}</td>
                                            <td className="py-2">{c.doctor}</td>
                                            <td className="py-2">{c.amount}</td>
                                            <td className="py-2">{c.discount}</td>
                                            <td className="py-2">{c.tax}</td>
                                            <td className="py-2">{c.net_amount}</td>
                                            <td className="py-2">{c.paid_amount}</td>
                                            <td className="py-2">{c.balance_amount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center text-gray-400">No charges found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Radiology Charges Section */}
                    <h4 className="text-[#6046B5] font-bold mb-2">Radiology Charges</h4>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left mb-2">
                            <thead className="border-b border-gray-200 bg-gray-100">
                                <tr>
                                    <th className="py-2 text-left">Bill No</th>
                                    <th className="py-2 text-left">Doctor</th>
                                    <th className="py-2 text-left">Amount</th>
                                    <th className="py-2 text-left">Discount</th>
                                    <th className="py-2 text-left">Tax</th>
                                    <th className="py-2 text-left">Net Amount</th>
                                    <th className="py-2 text-left">Paid Amount</th>
                                    <th className="py-2 text-left">Balance Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {charges.length > 0 ? (
                                    charges.map((c) => (
                                        <tr key={c.id}>
                                            <td className="py-2">{c.bill_no}</td>
                                            <td className="py-2">{c.doctor}</td>
                                            <td className="py-2">{c.amount}</td>
                                            <td className="py-2">{c.discount}</td>
                                            <td className="py-2">{c.tax}</td>
                                            <td className="py-2">{c.net_amount}</td>
                                            <td className="py-2">{c.paid_amount}</td>
                                            <td className="py-2">{c.balance_amount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center text-gray-400">No charges found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                    {/* Pharmacy Charges Section */}
                    <h4 className="text-[#6046B5] font-bold mb-2">Pharmacy Charges</h4>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left mb-2">
                            <thead className="border-b border-gray-200 bg-gray-100">
                                <tr>
                                    <th className="py-2">Date</th>
                                    <th className="py-2">Service</th>
                                    <th className="py-2">Type</th>
                                    <th className="py-2 text-right">Discount</th>
                                    <th className="py-2 text-right">Tax</th>
                                    <th className="py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {charges.length > 0 ? (
                                    charges.map((c) => (
                                        <tr key={c.id}>
                                            <td className="py-2">{c.charge_date || new Date(c.created_at).toLocaleDateString()}</td>
                                            <td className="py-2">{c.charge_name}</td>
                                            <td className="py-2">{c.charge_type}</td>
                                            <td className="py-2 text-right">${parseFloat(c.discount || 0).toFixed(2)}</td>
                                            <td className="py-2 text-right">${parseFloat(c.tax || 0).toFixed(2)}</td>
                                            <td className="py-2 text-right">${parseFloat(c.amount || 0).toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center text-gray-400">No charges found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                    {/* Ambulance Charges Section */}
                    <h4 className="text-[#6046B5] font-bold mb-2">Ambulance Charges</h4>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left mb-2">
                            <thead className="border-b border-gray-200 bg-gray-100">
                                <tr>
                                    <th className="py-2">Ambulance No</th>
                                    <th className="py-2">Vehicle No</th>
                                    <th className="py-2">Driver Name</th>
                                    <th className="py-2 text-right">Discount</th>
                                    <th className="py-2 text-right">Tax</th>
                                    <th className="py-2 text-right">Amount</th>
                                    <th className="py-2 text-right">Paid Amount</th>
                                    <th className="py-2 text-right">Balance Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {charges.length > 0 ? (
                                    charges.map((c) => (
                                        <tr key={c.id}>
                                            <td className="py-2">{c.bill_no}</td>
                                            <td className="py-2">{c.doctor}</td>
                                            <td className="py-2">{c.amount}</td>
                                            <td className="py-2">{c.discount}</td>
                                            <td className="py-2">{c.tax}</td>
                                            <td className="py-2">{c.net_amount}</td>
                                            <td className="py-2">{c.paid_amount}</td>
                                            <td className="py-2">{c.balance_amount}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-4 text-center text-gray-400">No charges found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Transactions Section */}
                    <h4 className="text-[#6046B5] font-bold mb-2">Transactions</h4>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left mb-2">
                            <thead className="border-b border-gray-200 bg-gray-100">
                                <tr>
                                    <th className="py-2">Payment Date</th>
                                    <th className="py-2">Service Type</th>
                                    <th className="py-2">Payment Mode</th>
                                    <th className="py-2">Note</th>
                                    <th className="py-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length > 0 ? (
                                    payments.map((p) => (
                                        <tr key={p.id}>
                                            <td className="py-2">{p.payment_date}</td>
                                            <td className="py-2">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {p.service_type || 'General'}
                                                </span>
                                            </td>
                                            <td className="py-2">{p.payment_mode}</td>
                                            <td className="py-2 text-xs truncate max-w-[200px]">{p.note}</td>
                                            <td className="py-2 text-right">${parseFloat(p.paid_amount || 0).toFixed(2)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-4 text-center text-gray-400">No transactions found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Amount Summary Section */}
                    <div className="flex justify-end mt-4">
                        <div className="w-full sm:w-1/2 md:w-1/3">
                            <h4 className="text-gray-800 font-semibold mb-3 text-lg border-b border-gray-200 bg-gray-100 pb-1">Amount Summary</h4>
                            <div className="flex justify-between py-1">
                                <span>Grand Total:</span>
                                <span className="font-medium">${totalCharges.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>Amount Paid:</span>
                                <span className="font-medium">${totalPayments.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1">
                                <span>Balance Amount:</span>
                                <span className={`font-medium ${balanceAmount > 0 ? "text-red-600" : "text-green-600"}`}>
                                    ${balanceAmount.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillSummary;
