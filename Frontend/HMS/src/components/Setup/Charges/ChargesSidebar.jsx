import { NavLink } from "react-router-dom";

export default function ChargesSidebar() {
  const menuItems = [
    { label: "Charges", path: "/admin/setup/charges-details" },
    { label: "Charge Category", path: "/admin/setup/charge-category" },
    { label: "Charge Type", path: "/admin/setup/charge-type" },
    { label: "Tax Category", path: "/admin/setup/tax-category" },
    { label: "Unit Type", path: "/admin/setup/unit-type" },
  ];

  return (
    <div className="w-full md:w-64 bg-white rounded-md shadow h-fit sticky top-6">
      <ul className="space-y-1 text-sm">
        {menuItems.map((item) => (
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
