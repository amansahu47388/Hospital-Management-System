export function PaymentSection({
  paymentMode,
  setPaymentMode,
  paidAmount,
  setPaidAmount
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <div>
        <label className="block mb-1">Payment Mode</label>
        <select
          className="border p-2 w-full"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
        >
          <option>Cash</option>
          <option>UPI</option>
          <option>Card</option>
          <option>Bank</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Amount *</label>
        <input
          className="border p-2 w-full"
          value={paidAmount}
          onChange={(e) => setPaidAmount(e.target.value)}
        />
      </div>
    </div>
  );
}
