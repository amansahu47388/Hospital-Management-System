export default function PurchaseRow({ item }) {
    return (
      <tr className="border-b text-sm hover:bg-gray-50">
        <td className="p-2 font-medium text-blue-700">{item.id}</td>
        <td className="p-2">{item.date}</td>
        <td className="p-2">{item.billNo || "-"}</td>
        <td className="p-2">{item.supplier}</td>
        <td className="p-2">{item.total.toFixed(2)}</td>
        <td className="p-2">{item.discount}</td>
        <td className="p-2">{item.tax}</td>
        <td className="p-2 font-semibold">{item.netAmount.toFixed(2)}</td>
      </tr>
    );
  }
  