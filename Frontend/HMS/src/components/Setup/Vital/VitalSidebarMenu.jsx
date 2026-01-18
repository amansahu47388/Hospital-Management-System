import { NavLink } from "react-router-dom";

export default function VitalSidebarMenu() {
  return (
    <div className="bg-white rounded shadow">
      <ul className="text-sm">
        <li>
          <NavLink
            to="/admin/setup/vitals"
            className={({ isActive }) =>
              `block px-4 py-3 transition
              ${
                isActive
                  ? "text-[#6046B5] font-semibold bg-purple-50"
                  : "hover:bg-gray-100"
              }`
            }
          >
            Vital List
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
