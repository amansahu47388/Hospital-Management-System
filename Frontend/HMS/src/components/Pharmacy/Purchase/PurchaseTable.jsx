import PurchaseRow from "./PurchaseRow";

export default function PurchaseTable({ purchases }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-2 text-left">Pharmacy Purchase No</th>
            <th className="p-2 text-left">Purchase Date</th>
            <th className="p-2 text-left">Bill No</th>
            <th className="p-2 text-left">Supplier Name</th>
            <th className="p-2 text-left">Total ($)</th>
            <th className="p-2 text-left">Discount ($)</th>
            <th className="p-2 text-left">Tax ($)</th>
            <th className="p-2 text-left">Net Amount ($)</th>
          </tr>
        </thead>

        <tbody>
          {purchases.map((item) => (
            <PurchaseRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
