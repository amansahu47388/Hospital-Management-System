import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
export default function PortalDropdown() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md"
      >
        Portal <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md z-50">
          <button onClick={() => navigate("/admin/front-office/postal-dispatch")} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
            Dispatch List
          </button>
          <button onClick={() => navigate("/admin/front-office/postal-receive")} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
            Receive List
          </button>
        </div>
      )}
    </div>
  );
}
