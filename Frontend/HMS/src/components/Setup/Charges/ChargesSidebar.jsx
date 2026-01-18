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
                `block px-3 py-2 rounded
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-100"
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