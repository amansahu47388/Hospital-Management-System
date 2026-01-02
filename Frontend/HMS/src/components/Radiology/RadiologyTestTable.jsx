import RadiologyTestRow from "./RadiologyTestRow";

export default function RadiologyTestTable({ tests }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-2 text-left">Test Name</th>
            <th className="p-2 text-left">Short Name</th>
            <th className="p-2 text-left">Test Type</th>
            <th className="p-2 text-left">Category Name</th>
            <th className="p-2 text-left">Sub Category</th>
            <th className="p-2 text-center">Report Days</th>
            <th className="p-2 text-center">Tax (%)</th>
            <th className="p-2 text-center">Charge ($)</th>
            <th className="p-2 text-center">Amount ($)</th>
          </tr>
        </thead>

        <tbody>
          {tests.length > 0 ? (
            tests.map((item) => (
              <RadiologyTestRow key={item.id} item={item} />
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center py-6 text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
