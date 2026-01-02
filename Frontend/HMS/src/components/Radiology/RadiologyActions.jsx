import { Eye, FileText, Printer } from "lucide-react";

export default function RadiologyActions() {
  return (
    <div className="flex gap-2">
      <button className="text-blue-600 hover:text-blue-800">
        <Eye size={16} />
      </button>
      <button className="text-green-600 hover:text-green-800">
        <FileText size={16} />
      </button>
      <button className="text-gray-700 hover:text-black">
        <Printer size={16} />
      </button>
    </div>
  );
}
