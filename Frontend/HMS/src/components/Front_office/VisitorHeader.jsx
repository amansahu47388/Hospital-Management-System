import PortalDropdown from "./PortalDropdown";
import { useNavigate } from "react-router-dom";
export default function VisitorHeader({ setOpenAdd }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
      <h2 className="text-xl font-semibold text-black">Visitor List</h2>

      <div className="flex gap-2">
        <button onClick={() => setOpenAdd(true)} className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md">
          + Add Visitor
        </button>
        
        <PortalDropdown />
        <button onClick={() => navigate("/admin/front-office/complain-list")} className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-md">
          Complain
        </button>
      </div>
    </div>
  );
}
