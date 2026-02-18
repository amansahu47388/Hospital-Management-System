import { NavLink } from "react-router-dom";

export default function FinanceSidebarMenu() {
  return (
    <div className="bg-white rounded-md">
      <ul className="text-sm">
        {[
          { label: "Income Head", path: "/admin/setup/finance/income-head" },
          { label: "Expense Head", path: "/admin/setup/finance/expense-head" },
        ].map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2
                ${
                  isActive
                    ? "bg-[#6046B5] text-white font-bold"
                    : "hover:bg-[#6046B5] hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
