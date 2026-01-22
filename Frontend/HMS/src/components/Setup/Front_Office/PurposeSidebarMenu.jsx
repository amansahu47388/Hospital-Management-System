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
                    ? "bg-purple-200 text-purple-600 font-bold"
                    : "hover:bg-purple-100 hover:text-purple-600"
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
