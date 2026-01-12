import ActionButtons from "./ActionButtons";

export default function VisitorTable({ visitors, onShow, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-white rounded-md mt-4">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {[
              "Purpose",
              "Name",
              "Visit To",
              "IPD/OPD/Staff",
              "Phone",
              "Date",
              "In Time",
              "Out Time",
              "Action",
            ].map((h) => (
              <th key={h} className="px-3 py-2 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {visitors.map((v) => (
            <tr key={v.id} className="border-b hover:bg-gray-50 group">
              <td className="px-3 py-2">{v.purpose}</td>
              <td className="px-3 py-2">{v.name}</td>
              <td className="px-3 py-2">{v.visitTo}</td>
              <td className="px-3 py-2">{v.staff}</td>
              <td className="px-3 py-2">{v.phone}</td>
              <td className="px-3 py-2">{v.date}</td>
              <td className="px-3 py-2">{v.inTime}</td>
              <td className="px-3 py-2">{v.outTime}</td>

              <td className="px-3 py-2">
                <ActionButtons
                  row={v}               
                  onShow={onShow}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
