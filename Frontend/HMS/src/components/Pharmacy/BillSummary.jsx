export function BillSummary({ total }) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Total ($)</span>
        <span>{total.toFixed(2)}</span>
      </div>

      <div className="flex justify-between">
        <span>Discount ($)</span>
        <span>0</span>
      </div>

      <div className="flex justify-between">
        <span>Tax ($)</span>
        <span>0</span>
      </div>

      <div className="flex justify-between font-semibold text-lg">
        <span>Net Amount ($)</span>
        <span>{total.toFixed(2)}</span>
      </div>
    </div>
  );
}
