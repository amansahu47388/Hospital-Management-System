export function PaymentSection({
  paymentMode,
  setPaymentMode,
  paymentAmount,
  setPaymentAmount
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-3">
      <div>
        <label className="block text-sm font-medium">Payment Mode</label>
        <select
          className="border p-2 rounded w-full"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
        >
          <option>Cash</option>
          <option>Card</option>
          <option>UPI</option>
          <option>Bank</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">
          Payment Amount ($)
        </label>
        <input
          className="border p-2 rounded w-full"
          value={paymentAmount}
          onChange={(e) => setPaymentAmount(e.target.value)}
        />
      </div>
    </div>
  );
}
