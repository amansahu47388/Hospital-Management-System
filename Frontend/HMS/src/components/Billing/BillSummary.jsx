import { useState, useEffect } from "react";
import { X, Printer } from "lucide-react";
import { getHeaders } from "../../api/setupApi";
import { printReport } from "../../utils/printUtils";

const BillSummary = ({ 
    isOpen, 
    onClose, 
    charges = [], 
    payments = [],
    pathologyBills = [],
    radiologyBills = [],
    pharmacyBills = [],
    ambulanceBills = [],
    opdRows = [],
    ipdRows = []
}) => {
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

    const opdCharges = charges.filter(c => c.charge_type === "OPD" || !c.charge_type);
    const ipdCharges = charges.filter(c => c.charge_type === "IPD");

    const totalModuleBills = [
        ...pathologyBills,
        ...radiologyBills,
        ...pharmacyBills.map(b => ({ ...b, amount: b.net_amount })),
        ...ambulanceBills.map(b => ({ ...b, amount: b.net_amount }))
    ].reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);

    const totalServiceFees = [
        ...opdRows,
        ...ipdRows
    ].reduce((sum, r) => sum + parseFloat(r.net_amount || r.total_amount || 0), 0);

    const totalGeneralCharges = charges.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
    
    // Total charges in this context is the sum of all net amounts across all modules
    const grandTotalCharges = totalModuleBills + totalServiceFees + totalGeneralCharges;
    const grandTotalPayments = payments.reduce((sum, p) => sum + parseFloat(p.paid_amount || 0), 0);
    const grandBalance = grandTotalCharges - grandTotalPayments;

    const handlePrint = () => {
        const content = `
            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #6046B5; padding-bottom: 5px; margin-bottom: 20px;">
                <h2 style="margin:0; color:#6046B5; font-size:20px;">BILL SUMMARY REPORT</h2>
                <div style="text-align:right; font-size:12px; font-weight:bold;">
                    <div>Date: ${new Date().toLocaleDateString()}</div>
                </div>
            </div>

            <div class="report-section-title">Consolidated Billing Summary</div>
            <table class="report-table">
                <thead>
                    <tr>
                        <th>Module</th>
                        <th>Bill Count</th>
                        <th style="text-align:right">Total Amount ($)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td>Pathology</td><td>${pathologyBills.length}</td><td style="text-align:right">${pathologyBills.reduce((s, b) => s + parseFloat(b.amount || 0), 0).toFixed(2)}</td></tr>
                    <tr><td>Radiology</td><td>${radiologyBills.length}</td><td style="text-align:right">${radiologyBills.reduce((s, b) => s + parseFloat(b.amount || 0), 0).toFixed(2)}</td></tr>
                    <tr><td>Pharmacy</td><td>${pharmacyBills.length}</td><td style="text-align:right">${pharmacyBills.reduce((s, b) => s + parseFloat(b.net_amount || 0), 0).toFixed(2)}</td></tr>
                    <tr><td>Ambulance</td><td>${ambulanceBills.length}</td><td style="text-align:right">${ambulanceBills.reduce((s, b) => s + parseFloat(b.net_amount || 0), 0).toFixed(2)}</td></tr>
                    <tr><td>OPD/IPD Fees</td><td>${opdRows.length + ipdRows.length}</td><td style="text-align:right">${totalServiceFees.toFixed(2)}</td></tr>
                    <tr><td>General Charges</td><td>${charges.length}</td><td style="text-align:right">${totalGeneralCharges.toFixed(2)}</td></tr>
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
                    <div style="display:flex; justify-content:space-between;"><span>Grand Total Charges</span><span>$${grandTotalCharges.toFixed(2)}</span></div>
                    <div style="display:flex; justify-content:space-between; color:green;"><span>Total Collected</span><span>$${grandTotalPayments.toFixed(2)}</span></div>
                    <div style="display:flex; justify-content:space-between; font-weight:bold; border-top:2px solid #6046B5; margin-top:5px; padding-top:5px;">
                        <span>Outstanding Balance</span><span>$${grandBalance.toFixed(2)}</span>
                    </div>
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
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto animate-zoom-in">
                <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white sticky top-0 z-10">
                    <h3 className="text-lg font-semibold">Consolidated Bill Summary</h3>
                    <div className="flex items-center gap-3">
                        <Printer size={20} className="cursor-pointer hover:opacity-80" onClick={handlePrint} />
                        <X size={20} className="cursor-pointer hover:opacity-80 text-xl" onClick={onClose} />
                    </div>
                </div>

                <div className="p-6 text-sm text-gray-700">
                    {/* General Charges Section */}
                    {charges.length > 0 && (
                        <>
                            <h4 className="text-[#6046B5] font-bold mb-2 uppercase text-xs border-b pb-1">General Charges</h4>
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-left mb-2">
                                    <thead className="border-b border-gray-200 bg-gray-50">
                                        <tr>
                                            <th className="py-2 px-2">Date</th>
                                            <th className="py-2 px-2">Name</th>
                                            <th className="py-2 px-2">Type</th>
                                            <th className="py-2 px-2 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {charges.map((c) => (
                                            <tr key={c.id} className="border-b border-gray-50">
                                                <td className="py-2 px-2">{c.charge_date || new Date(c.created_at).toLocaleDateString()}</td>
                                                <td className="py-2 px-2 font-medium">{c.charge_name}</td>
                                                <td className="py-2 px-2">{c.charge_type}</td>
                                                <td className="py-2 px-2 text-right">${parseFloat(c.amount || 0).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* Pathology Section */}
                    {pathologyBills.length > 0 && (
                        <>
                            <h4 className="text-[#6046B5] font-bold mb-2 uppercase text-xs border-b pb-1">Pathology Bills</h4>
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-left mb-2">
                                    <thead className="border-b border-gray-200 bg-gray-50">
                                        <tr>
                                            <th className="py-2 px-2">Bill No</th>
                                            <th className="py-2 px-2">Doctor</th>
                                            <th className="py-2 px-2 text-right">Net Amount</th>
                                            <th className="py-2 px-2 text-right">Paid</th>
                                            <th className="py-2 px-2 text-right">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pathologyBills.map((b) => (
                                            <tr key={b.id} className="border-b border-gray-50">
                                                <td className="py-2 px-2">{b.id}</td>
                                                <td className="py-2 px-2">{b.doctor_name || b.doctor}</td>
                                                <td className="py-2 px-2 text-right">${parseFloat(b.amount || 0).toFixed(2)}</td>
                                                <td className="py-2 px-2 text-right">${parseFloat(b.paid_amount || 0).toFixed(2)}</td>
                                                <td className="py-2 px-2 text-right text-red-600">${parseFloat(b.balance || 0).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* Radiology Section */}
                    {radiologyBills.length > 0 && (
                        <>
                            <h4 className="text-[#6046B5] font-bold mb-2 uppercase text-xs border-b pb-1">Radiology Bills</h4>
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-left mb-2">
                                    <thead className="border-b border-gray-200 bg-gray-50">
                                        <tr>
                                            <th className="py-2 px-2">Bill No</th>
                                            <th className="py-2 px-2">Doctor</th>
                                            <th className="py-2 px-2 text-right">Net Amount</th>
                                            <th className="py-2 px-2 text-right">Paid</th>
                                            <th className="py-2 px-2 text-right">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {radiologyBills.map((b) => (
                                            <tr key={b.id} className="border-b border-gray-50">
                                                <td className="py-2 px-2">{b.id}</td>
                                                <td className="py-2 px-2">{b.doctor_name || b.doctor}</td>
                                                <td className="py-2 px-2 text-right">${parseFloat(b.amount || 0).toFixed(2)}</td>
                                                <td className="py-2 px-2 text-right">${parseFloat(b.paid_amount || 0).toFixed(2)}</td>
                                                <td className="py-2 px-2 text-right text-red-600">${parseFloat(b.balance || 0).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* Pharmacy Section */}
                    {pharmacyBills.length > 0 && (
                        <>
                            <h4 className="text-[#6046B5] font-bold mb-2 uppercase text-xs border-b pb-1">Pharmacy Bills</h4>
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full text-left mb-2">
                                    <thead className="border-b border-gray-200 bg-gray-50">
                                        <tr>
                                            <th className="py-2 px-2">Bill No</th>
                                            <th className="py-2 px-2">Doctor</th>
                                            <th className="py-2 px-2 text-right">Net Amount</th>
                                            <th className="py-2 px-2 text-right">Paid</th>
                                            <th className="py-2 px-2 text-right">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pharmacyBills.map((b) => (
                                            <tr key={b.id} className="border-b border-gray-50">
                                                <td className="py-2 px-2">{b.id}</td>
                                                <td className="py-2 px-2">{b.doctor_name || "N/A"}</td>
                                                <td className="py-2 px-2 text-right">${parseFloat(b.net_amount || 0).toFixed(2)}</td>
                                                <td className="py-2 px-2 text-right">${parseFloat(b.paid_amount || 0).toFixed(2)}</td>
                                                <td className="py-2 px-2 text-right text-red-600">${parseFloat(b.balance_amount || 0).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* Transactions Section */}
                    <h4 className="text-[#6046B5] font-bold mb-2 uppercase text-xs border-b pb-1">All Transactions</h4>
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full text-left mb-2">
                            <thead className="border-b border-gray-200 bg-gray-100">
                                <tr>
                                    <th className="py-2 px-2">Payment Date</th>
                                    <th className="py-2 px-2">Service Type</th>
                                    <th className="py-2 px-2">Payment Mode</th>
                                    <th className="py-2 px-2">Note</th>
                                    <th className="py-2 px-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length > 0 ? (
                                    payments.map((p) => (
                                        <tr key={p.id} className="border-b border-gray-50">
                                            <td className="py-2 px-2">{p.payment_date}</td>
                                            <td className="py-2 px-2">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-800 uppercase">
                                                    {p.service_type || 'General'}
                                                </span>
                                            </td>
                                            <td className="py-2 px-2">{p.payment_mode}</td>
                                            <td className="py-2 px-2 text-xs text-gray-500 italic max-w-[200px] truncate">{p.note}</td>
                                            <td className="py-2 px-2 text-right font-semibold">${parseFloat(p.paid_amount || 0).toFixed(2)}</td>
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
                    <div className="flex justify-end mt-8">
                        <div className="w-full sm:w-1/2 md:w-1/3 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-inner">
                            <h4 className="text-gray-800 font-bold mb-3 text-lg border-b border-gray-200 pb-1">Grand Total Summary</h4>
                            <div className="flex justify-between py-1 text-gray-600">
                                <span>Grand Total Charges:</span>
                                <span className="font-medium text-gray-900">${grandTotalCharges.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1 text-green-700">
                                <span>Total Amount Paid:</span>
                                <span className="font-medium font-bold">${grandTotalPayments.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-t border-gray-200 mt-2 font-bold text-xl">
                                <span className="text-gray-800">Balance:</span>
                                <span className={grandBalance > 0 ? "text-red-600" : "text-green-600"}>
                                    ${grandBalance.toFixed(2)}
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
