import { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  Eye,
  Printer,
  IndianRupee,
  Trash2,
} from "lucide-react";

export default function PathologyActions({ onView, onPay, onPrint, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="p-1  rounded hover:bg-gray-100"
      >
        <MoreVertical size={18} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="
          absolute right-0 mt-2 w-40
          bg-white rounded-md shadow-lg
          z-50 overflow-hidden
        ">
          <ActionItem icon={Eye} label="View" onClick={onView} />
          <ActionItem icon={IndianRupee} label="Pay" onClick={onPay} />
          <ActionItem icon={Printer} label="Print" onClick={onPrint} />
          <ActionItem
            icon={Trash2}
            label="Delete"
            onClick={onDelete}
            danger
          />
        </div>
      )}
    </div>
  );
}

function ActionItem({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`
          w-full flex items-center gap-2 px-3 py-2 text-sm text-left
        hover:bg-gray-100
        ${danger ? "text-red-600 hover:bg-red-50" : ""}
      `}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}
