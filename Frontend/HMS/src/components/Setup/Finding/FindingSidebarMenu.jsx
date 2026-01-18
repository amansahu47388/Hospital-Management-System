import { NavLink } from "react-router-dom";

export default function FindingSidebarMenu() {
  return (
    <div className="bg-white rounded-md shadow h-fit sticky top-6">
      <ul className="text-sm">
        <li>
          <NavLink
            to="/admin/setup/finding"
            className={({ isActive }) =>
              `block px-4 py-3 transition ${
                isActive
                  ? "text-[#6046B5] font-semibold bg-purple-50"
                  : "hover:bg-gray-100"
              }`
            }
          >
            Finding
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/setup/finding/category"
            className={({ isActive }) =>
              `block px-4 py-3 transition ${
                isActive
                  ? "text-[#6046B5] font-semibold bg-purple-50"
                  : "hover:bg-gray-100"
              }`
            }
          >
            Category
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
