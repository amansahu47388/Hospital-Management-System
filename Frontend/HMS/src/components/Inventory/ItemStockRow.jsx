export default function ItemStockRow({ item }) {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="p-2 text-blue-600">{item.name}</td>
      <td className="p-2">{item.category}</td>
      <td className="p-2">{item.supplier}</td>
      <td className="p-2">{item.store}</td>
      <td className="p-2">{item.date}</td>
      <td className="p-2">{item.description}</td>
      <td className="p-2 text-center">{item.quantity}</td>
      <td className="p-2">{item.generatedBy}</td>
      <td className="p-2">{item.price}</td>
    </tr>
  );
}
