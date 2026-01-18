import { NavLink } from "react-router-dom";

export default function OperationSidebarMenu() {
  return (
    <div className="bg-white rounded-md shadow h-fit sticky top-6">
      <ul className="divide-y text-sm">
        <li>
          <NavLink
            to="/admin/setup/operation/operation-list"
            className={({ isActive }) =>
              `block px-4 py-2 ${
                isActive
                  ? "bg-purple-200 text-purple-600 font-bold"
                    : "hover:bg-purple-100 hover:text-purple-500"
              }`
            }
          >
            Operation
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/setup/operation/operation-category"
            className={({ isActive }) =>
              `block px-4 py-2 ${
                isActive
                  ? "bg-purple-200 text-purple-600 font-bold"
                    : "hover:bg-purple-100 hover:text-purple-500"
              }`
            }
          >
            Operation Category
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
