import MedicineRow from "./MedicineRow";

export default function MedicineTable({
  medicines,
  selected,
  toggleSelect
}) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full">
        <thead className="bg-gray-100 text-sm">
          <tr>
            <th className="p-2 text-left">
              <input type="checkbox" />
            </th>
            <th className="p-2 text-left">Medicine Name</th>
            <th className="p-2 text-left">Company</th>
            <th className="p-2 text-left">Composition</th>
            <th className="p-2 text-left">Category</th>
            <th className="p-2 text-left">Group</th>
            <th className="p-2 text-left">Unit</th>
            <th className="p-2 text-left">Available Qty</th>
          </tr>
        </thead>

        <tbody>
          {medicines.map(item => (
            <MedicineRow
              key={item.id}
              item={item}
              selected={selected.includes(item.id)}
              onSelect={toggleSelect}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
