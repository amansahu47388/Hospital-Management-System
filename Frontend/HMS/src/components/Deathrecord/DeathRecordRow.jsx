import DeathRecordActions from "./DeathRecordActions";

export default function DeathRecordRow({ data, item,
  onView, onEdit }) {
  return (
    <tr className="group hover:bg-gray-50 transition">
      <td className="px-3 py-2">{data.refNo}</td>
      <td className="px-3 py-2 text-center">{data.caseId}</td>
      <td className="px-3 py-2">{data.generatedBy}</td>
      <td className="px-3 py-2">{data.patient}</td>
      <td className="px-3 py-2">{data.guardian}</td>
      <td className="px-3 py-2">{data.gender}</td>
      <td className="px-3 py-2">{data.date}</td>
      <td className="px-3 py-2">{data.report}</td>

      {/* ACTIONS */}
      <td className="px-3 py-2">
        <div className="opacity-0 group-hover:opacity-100 transition">
          <DeathRecordActions
            onDelete={() => onDelete(data.id)}
            item={item}
           onView={onView} 
           onEdit={onEdit}
          />

           
        </div>
      </td>
    </tr>
  );
}
