import { NavLink } from "react-router-dom";

export default function OperationSidebarMenu() {
  return (
    <div className="bg-white rounded-md h-fit sticky top-6">
      <ul className="divide-y text-sm">
        <li>
          <NavLink
            to="/admin/setup/operation/operation-list"
           className={({ isActive }) =>
                `block px-3 py-2 rounded border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2
                ${
                  isActive
                    ? "bg-[#6046B5] text-white font-bold"
                    : "hover:bg-[#6046B5] hover:text-white"
                }`
              }
          >
            Operation
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
