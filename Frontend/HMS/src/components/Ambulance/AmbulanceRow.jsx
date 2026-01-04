import AmbulanceActions from "./AmbulanceActions";

export default function AmbulanceRow({ row }) {
  return (
    <tr className="border-b text-sm hover:bg-gray-50">
      <td>{row.billNo}</td>
      <td>{row.caseId}</td>
      <td>{row.patient}</td>
      <td>{row.generatedBy}</td>
      <td>{row.vehicleNo}</td>
      <td>{row.model}</td>
      <td>{row.driver}</td>
      <td>{row.contact}</td>
      <td>{row.address}</td>
      <td>{row.date}</td>
      <td>{row.amount.toFixed(2)}</td>
      <td>{row.discount.toFixed(2)}</td>
      <td>{row.tax.toFixed(2)}</td>
      <td>{row.net.toFixed(2)}</td>
      <td>{row.paid.toFixed(2)}</td>
      <td>{row.balance.toFixed(2)}</td>

      {/* ACTION COLUMN */}
      <td>
        <AmbulanceActions
          onView={() => console.log("View", row.billNo)}
          onEdit={() => console.log("Edit", row.billNo)}
          onPrint={() => console.log("Print", row.billNo)}
          onDelete={() => {
            if (confirm("Are you sure you want to delete?")) {
              console.log("Delete", row.billNo);
            }
          }}
        />
      </td>
    </tr>
  );
}
