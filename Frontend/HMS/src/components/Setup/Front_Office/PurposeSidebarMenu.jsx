import { NavLink } from "react-router-dom";

export default function PurposeSidebarMenu() {
  const menu = [
    { label: "Purpose", path: "/admin/setup/front-office/purpose-list" },
    { label: "Complain Type", path: "/admin/setup/front-office/complain-type" },
    { label: "Source", path: "/admin/setup/front-office/source" },
  ];

  return (
    <div className="bg-white rounded-md shadow h-fit sticky top-6">
      <ul className="space-y-1 text-sm">
        {menu.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded ${
                  isActive
                    ? "bg-blue-100 text-blue-600 font-medium"
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
