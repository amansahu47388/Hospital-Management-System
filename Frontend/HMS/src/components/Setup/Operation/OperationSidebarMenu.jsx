import { NavLink } from "react-router-dom";

export default function OperationSidebarMenu() {
  return (
    <div className="bg-white  rounded-md shadow h-fit sticky top-6">
      <ul className=" text-sm">
        <li>
          <NavLink
            to="/admin/setup/operation/operation-list"
            className={({ isActive }) =>
              `block px-4 py-2 ${
                isActive
                  ? "text-blue-600 font-semibold bg-blue-50"
                  : "text-gray-700 hover:bg-gray-100"
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
                  ? "text-blue-600 font-semibold bg-blue-50"
                  : "text-gray-700 hover:bg-gray-100"
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
