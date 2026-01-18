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
    <div className="w-full md:w-64 bg-white rounded-md p-3 shadow">
      <ul className="space-y-1 text-sm text-black">
        {menuItems.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded 
                ${
                  isActive
                    ? "bg-gray-200 text-purple-600 font-bold"
                    : "hover:bg-gray-100 hover:text-purple-500"
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
