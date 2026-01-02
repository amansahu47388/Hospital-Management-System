export default function RadiologyTestRow({ item }) {
  return (
    <tr className="border-b hover:bg-gray-50 text-sm">
      <td className="p-2">{item.name}</td>
      <td className="p-2">{item.shortName}</td>
      <td className="p-2">{item.type}</td>
      <td className="p-2">{item.category}</td>
      <td className="p-2">{item.subCategory}</td>
      <td className="p-2 text-center">{item.reportDays}</td>
      <td className="p-2 text-center">{item.tax.toFixed(2)}</td>
      <td className="p-2 text-center">{item.charge.toFixed(2)}</td>
      <td className="p-2 text-center">{item.amount.toFixed(2)}</td>
    </tr>
  );
}
