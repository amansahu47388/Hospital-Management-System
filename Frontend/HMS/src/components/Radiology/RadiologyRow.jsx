import RadiologyActions from "./RadiologyActions";

export default function RadiologyRow({ data }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-2 font-medium">{data.billNo}</td>
      <td className="p-2">{data.caseId}</td>
      <td className="p-2">{data.date}</td>
      <td className="p-2">{data.patient}</td>
      <td className="p-2">{data.generatedBy}</td>
      <td className="p-2">{data.doctor}</td>
      <td className="p-2">{data.report}</td>
      <td className="p-2">{data.amount.toFixed(2)}</td>
      <td className="p-2">{data.discount.toFixed(2)}</td>
      <td className="p-2">{data.tax.toFixed(2)}</td>
      <td className="p-2">{data.net.toFixed(2)}</td>
      <td className="p-2">{data.paid.toFixed(2)}</td>
      <td className="p-2">{data.balance.toFixed(2)}</td>
      <td className="p-2">
        <RadiologyActions />
      </td>
    </tr>
  );
}
