export default function BirthRecordRow({ item }) {
    return (
      <tr className="border-t text-sm">
        <td className="px-3 py-2">{item.refNo}</td>
        <td className="px-3 py-2">{item.caseId}</td>
        <td className="px-3 py-2">{item.generatedBy}</td>
        <td className="px-3 py-2">{item.childName}</td>
        <td className="px-3 py-2">{item.gender}</td>
        <td className="px-3 py-2 whitespace-nowrap">{item.birthDate}</td>
        <td className="px-3 py-2">{item.mother}</td>
        <td className="px-3 py-2">{item.father}</td>
        <td className="px-3 py-2 text-blue-600 cursor-pointer">
          Report
        </td>
      </tr>
    );
  }
  