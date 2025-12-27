export default function IpdTableRow({ p }) {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-2 text-blue-600 font-medium">{p.name}</td>
      <td className="px-4 py-2">{p.patientId}</td>
      <td className="px-4 py-2 hidden lg:table-cell">{p.caseId}</td>
      <td className="px-4 py-2">{p.gender}</td>
      <td className="px-4 py-2">{p.phone}</td>
      <td className="px-4 py-2 hidden md:table-cell">{p.generatedBy}</td>
      <td className="px-4 py-2 hidden md:table-cell">{p.doctor}</td>
      <td className="px-4 py-2">{p.admissionDate}</td>
      <td className="px-4 py-2">{p.dischargeDate}</td>
      <td className="px-4 py-2 text-right">{p.tax.toFixed(2)}</td>
      <td className="px-4 py-2 text-right">{p.net.toFixed(2)}</td>
      <td className="px-4 py-2 text-right">{p.total.toFixed(2)}</td>
    </tr>
  );
}
