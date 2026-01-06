import BirthRecordActions from "./BirthRecordActions";

export default function BirthRecordRow({item,onView,onEdit,onDelete}) {
  const handleView = () => {
   onView(item);
  };

  const handleEdit = () => {
  onEdit(item);
  };

  const handleDelete = () => {
    onDelete(item);
  };

  return (
    <tr className="border-t text-sm group hover:bg-gray-50 transition">
      <td className="px-3 py-2">{item.refNo}</td>
      <td className="px-3 py-2">{item.caseId}</td>
      <td className="px-3 py-2">{item.generatedBy}</td>
      <td className="px-3 py-2">{item.childName}</td>
      <td className="px-3 py-2">{item.gender}</td>
      <td className="px-3 py-2 whitespace-nowrap">
        {item.birthDate}
      </td>
      <td className="px-3 py-2">{item.mother}</td>
      <td className="px-3 py-2">{item.father}</td>

      {/* REPORT COLUMN */}
      <td className="px-3 py-2 flex items-center gap-3">
      

      

        <BirthRecordActions
           record={item}
           onView={handleView}
         onEdit={handleEdit}
          onDelete={handleDelete}
/>
        
      </td>
    </tr>
  );
}
