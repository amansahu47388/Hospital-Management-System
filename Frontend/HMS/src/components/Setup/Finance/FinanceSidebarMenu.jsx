import { NavLink } from "react-router-dom";

export default function FinanceSidebarMenu() {
  return (
    <div className="bg-white rounded-md shadow h-fit sticky top-6">
      <ul className="text-sm">
        <li>
          <NavLink
            to="/admin/setup/finance/income-head"
            className={({ isActive }) =>
              `block px-5 py-3 transition ${
                isActive
                  ? "text-[#6046B5] font-semibold bg-purple-50"
                  : "hover:bg-gray-100"
              }`
            }
          >
            Income Head
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/setup/finance/expense-head"
            className={({ isActive }) =>
              `block px-5 py-3 transition ${
                isActive
                  ? "text-[#6046B5] font-semibold bg-purple-50"
                  : "hover:bg-gray-100"
              }`
            }
          >
            Expense Head
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
