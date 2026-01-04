import { Eye, Pencil, Printer, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PharmacyActions({ bill }) {
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 justify-end">
      <button
        title="View"
        onClick={() => navigate(`/pharmacy/view/${bill.billNo}`)}
        className="p-1.5 border rounded hover:bg-gray-100"
      >
        <Eye size={16} />
      </button>

      <button
        title="Edit"
        onClick={() => navigate(`/pharmacy/edit/${bill.billNo}`)}
        className="p-1.5 border rounded hover:bg-gray-100 text-blue-600"
      >
        <Pencil size={16} />
      </button>

      <button
        title="Print"
        onClick={() => window.print()}
        className="p-1.5 border rounded hover:bg-gray-100 text-green-600"
      >
        <Printer size={16} />
      </button>

      <button
        title="Delete"
        onClick={() => window.confirm("Delete this bill?")}
        className="p-1.5 border rounded hover:bg-red-50 text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
