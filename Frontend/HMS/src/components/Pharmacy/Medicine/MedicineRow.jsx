export default function MedicineRow({ item, selected, onSelect }) {
  const isOut = item.qty === 0;

  return (
    <tr className="border-b hover:bg-gray-50 text-sm">
      <td className="p-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(item.id)}
        />
      </td>

      <td className="p-2 font-medium">{item.name}</td>
      <td className="p-2">{item.company}</td>
      <td className="p-2">{item.composition}</td>
      <td className="p-2">{item.category}</td>
      <td className="p-2">{item.group}</td>
      <td className="p-2">{item.unit}</td>

      <td className="p-2 font-semibold">
        {isOut ? (
          <span className="text-red-600">
            0 (Out of Stock)
          </span>
        ) : (
          item.qty
        )}
      </td>
    </tr>
  );
}
