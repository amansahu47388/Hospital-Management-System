import React, { useState, useEffect } from "react";
import { X, Printer, Trash2 } from "lucide-react";
import { 
  getAmbulanceBillDetail, 
  getAmbulanceBillTransactions,
  createAmbulanceBillTransaction,
  deleteAmbulanceBillTransaction
} from "../../api/ambulanceApi";
import { useNotify } from "../../context/NotificationContext";

const formatAmount = (value) => {
    const num = Number.parseFloat(value);
    return Number.isNaN(num) ? "0.00" : num.toFixed(2);
  };
  

/* ---------- Reusable Row ---------- */
const InfoRow = ({ label, value }) => (
  <div className="flex justify-between text-sm py-1 border-b-2 border-gray-300">

    <span className="text-gray-600">{label}</span>
    <span className="font-medium text-gray-900">{value || "-"}</span>
  </div>
);

export default function UpdateAmbulance({ open, onClose, billId, onSuccess }) {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const [bill, setBill] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    date: "",
    amount: "",
    mode: "cash",
    note: "",
  });

  useEffect(() => {
    if (open && billId) {
      loadBill();
      loadTransactions();
    } else {
      setBill(null);
      setTransactions([]);
      setForm({ date: "", amount: "", mode: "cash", note: "" });
    }
  }, [open, billId]);

  const loadBill = async () => {
    try {
      setLoading(true);
      const res = await getAmbulanceBillDetail(billId);
      const billData = res.data;
      setBill(billData);
      
      // Pre-fill form with current date and balance
      setForm({
        date: new Date().toISOString().split('T')[0],
        amount: billData.balance || "",
        mode: "cash",
        note: "",
      });
    } catch (error) {
      notify("error", "Failed to load bill details");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const res = await getAmbulanceBillTransactions(billId);
      setTransactions(res.data || []);
    } catch (error) {
      console.error("Failed to load transactions:", error);
      setTransactions([]);
    }
  };

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!bill || !form.date || !form.amount || parseFloat(form.amount) <= 0) {
      notify("error", "Please fill in all required fields with valid amount");
      return;
    }

    try {
      setLoading(true);
      
      // Create transaction
      const transactionData = {
        date: new Date(`${form.date}T${new Date().toTimeString().split(' ')[0]}`).toISOString(),
        payment_mode: form.mode.toLowerCase(),
        amount: parseFloat(form.amount),
        note: form.note || "",
      };

      const res = await createAmbulanceBillTransaction(billId, transactionData);
      
      // Update bill amounts from response
      if (res.data.bill) {
        setBill(prev => ({
          ...prev,
          paid_amount: res.data.bill.paid_amount,
          balance: res.data.bill.balance
        }));
      }
      
      // Reload transactions and bill
      await loadTransactions();
      await loadBill();
      
      // Reset form
      setForm({
        date: new Date().toISOString().split('T')[0],
        amount: "",
        mode: "cash",
        note: "",
      });
      
      notify("success", "Transaction added successfully");
    } catch (error) {
      notify("error", error?.response?.data?.message || error?.response?.data?.error || "Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }

    try {
      setLoading(true);
      const res = await deleteAmbulanceBillTransaction(billId, transactionId);
      
      // Update bill amounts from response
      if (res.data.bill) {
        setBill(prev => ({
          ...prev,
          paid_amount: res.data.bill.paid_amount,
          balance: res.data.bill.balance
        }));
      }
      
      // Reload transactions
      await loadTransactions();
      notify("success", "Transaction deleted successfully");
    } catch (error) {
      notify("error", error?.response?.data?.message || "Failed to delete transaction");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (transaction) => {
    // Placeholder for print functionality
    window.print();
  };

  const formatDateTime = (dateString) => {
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

  if (loading && !bill) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white p-6 rounded">Loading...</div>
      </div>
    );
  }

  if (!bill) return null;

  return (
        <div className="fixed inset-0 bg-black/40 z-50">
      <div className="bg-white w-full h-full flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-blue-500 text-white">
          <h2 className="text-sm font-semibold">Payments</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 grid grid-cols-3 gap-4">
          {/* Left Info */}
          <div className="col-span-1 space-y-1">
            <InfoRow label="Bill No" value={bill.bill_no || `#${bill.id}`} />
            <InfoRow label="Patient" value={`${bill.patient_name || "-"} (${bill.patient_phone || "-"})`} />
            <InfoRow label="Vehicle Number" value={bill.ambulance_details?.vehicle_number || "-"} />
            <InfoRow label="Vehicle Model" value={bill.ambulance_details?.vehicle_model || "-"} />
            <InfoRow label="Driver Name" value={bill.ambulance_details?.driver_name || "-"} />
            <InfoRow label="Driver Contact" value={bill.ambulance_details?.driver_contact || "-"} />
            <InfoRow label="Date" value={bill.date ? new Date(bill.date).toLocaleDateString() : "-"} />
            <InfoRow label="Generated By" value={bill.created_by_name || "-"} />
          </div>

          {/* Amount Summary */}
          <div className="col-span-1 space-y-1">
            <InfoRow label="Amount" value={`$${formatAmount(bill.total_amount)}`} />
            <InfoRow label="Discount" value={`$${formatAmount(bill.discount)}`} />
            <InfoRow label="Tax" value={`$${formatAmount(bill.tax)}`} />
            <InfoRow label="Net Amount" value={`$${formatAmount(bill.net_amount)}`} />
            <InfoRow label="Paid Amount" value={`$${formatAmount(bill.paid_amount)}`} />
            <InfoRow label="Balance Amount" value={`$${formatAmount(bill.balance)}`} />
          </div>
          {/* Payment Form */}
          <div className="col-span-1 space-y-3">
            <div>
              <label className="text-xs text-gray-600">Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Amount ($) *</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-gray-600">Payment Mode</label>
              <select
                name="mode"
                value={form.mode}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-600">Note</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-800 text-sm px-4 py-1 rounded hover:bg-gray-400"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 text-white text-sm px-4 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add Payment"}
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="px-4 pb-4 flex-1 overflow-auto">
          <h3 className="text-sm font-semibold mb-2">Transaction History</h3>

          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1 text-left">Transaction ID</th>
                <th className="border px-2 py-1 text-center">Date</th>
                <th className="border px-2 py-1 text-center">Mode</th>
                <th className="border px-2 py-1 text-center">Amount ($)</th>
                <th className="border px-2 py-1 text-center">Note</th>
                <th className="border px-2 py-1 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="border px-2 py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-1">{transaction.transaction_id || `#${transaction.id}`}</td>
                    <td className="border px-2 py-1 text-center">
                      {formatDateTime(transaction.date)}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {transaction.payment_mode_display || transaction.payment_mode || "-"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      ${formatAmount(transaction.amount)}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      {transaction.note || "—"}
                    </td>
                    <td className="border px-2 py-1 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handlePrint(transaction)}
                          className="text-purple-600 hover:text-purple-800 p-1"
                          title="Print"
                        >
                          <Printer size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                          disabled={loading}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
