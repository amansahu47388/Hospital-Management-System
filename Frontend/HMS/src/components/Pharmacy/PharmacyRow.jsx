import PharmacyActions from "./PharmacyActions";

export default function PharmacyRow({ row }) {
  return (
    <tr className="border-b hover:bg-gray-50 text-sm">

      <td className="px-3 py-2 text-blue-600 font-medium">{row.billNo}</td>
      <td className="px-3 py-2">{row.caseId}</td>
      <td className="px-3 py-2">{row.date}</td>
      <td className="px-3 py-2">{row.patient}</td>
      <td className="px-3 py-2">{row.generatedBy}</td>
      <td className="px-3 py-2">{row.doctor}</td>

      <td className="px-3 py-2 text-right">{row.amount.toFixed(2)}</td>
      <td className="px-3 py-2 text-right">{row.discount}</td>
      <td className="px-3 py-2 text-right">{row.tax}</td>
      <td className="px-3 py-2 text-right">{row.net.toFixed(2)}</td>
      <td className="px-3 py-2 text-right">{row.paid.toFixed(2)}</td>
      <td className="px-3 py-2 text-right">{row.refund.toFixed(2)}</td>
      <td className="px-3 py-2 text-right">{row.balance.toFixed(2)}</td>

      <td className="px-3 py-2 text-right">
        <PharmacyActions bill={row} />
      </td>
    </tr>
  );
}
