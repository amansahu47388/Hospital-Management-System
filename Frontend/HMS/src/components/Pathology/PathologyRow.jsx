export default function PathologyRow({ bill }) {
  return (
    <tr className="border-b text-sm hover:bg-gray-50">
      <td className="px-3 py-2 font-medium">{bill.billNo}</td>
      <td className="px-3 py-2">{bill.caseId}</td>
      <td className="px-3 py-2">{bill.billDate}</td>
      <td className="px-3 py-2">{bill.patient}</td>
      <td className="px-3 py-2">{bill.generatedBy}</td>
      <td className="px-3 py-2">{bill.doctor}</td>

      <td className="px-3 py-2 text-right">
        {bill.netAmount.toFixed(2)}
      </td>

      <td className="px-3 py-2 text-right text-green-600">
        {bill.paid.toFixed(2)}
      </td>

      <td className="px-3 py-2 text-right text-red-500">
        {bill.balance.toFixed(2)}
      </td>

    </tr>
  );
}
