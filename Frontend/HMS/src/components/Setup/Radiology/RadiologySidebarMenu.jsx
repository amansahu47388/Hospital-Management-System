import { NavLink } from "react-router-dom";

export default function RadiologySidebarMenu() {
  const menus = [
    {
      label: "Radiology Category",
      path: "/admin/setup/radiology/category",
    },
    {
      label: "Radiology Parameter",
      path: "/admin/setup/radiology/parameter",
    },
  ];

  return (
    <div className="bg-white rounded-md  overflow-hidden">
      <ul className="text-sm divide-y">
        {menus.map((menu) => (
          <li key={menu.path}>
            <NavLink
              to={menu.path}
              className={({ isActive }) =>
                `
                block px-5 py-3 transition-all duration-200
                ${
                  isActive
                     ? "bg-purple-200 text-purple-600 font-bold"
                    : "hover:bg-purple-100 hover:text-purple-500"
                }
              `
              }
            >
              {menu.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
