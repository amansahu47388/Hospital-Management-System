export function BillSummary({
  total,
  discount,
  setDiscount,
  discountPercent,
  setDiscountPercent,
  taxAmount,
  netAmount
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4 mt-6">
      <div />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Total ($)</span>
          <span>{total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Discount ($)</span>
          <input
            className="border p-1 w-28"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center">
          <span>Discount %</span>
          <input
            className="border p-1 w-28"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />
        </div>

        <div className="flex justify-between">
          <span>Tax ($)</span>
          <span>{taxAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-bold text-lg">
          <span>Net Amount ($)</span>
          <span>{netAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
