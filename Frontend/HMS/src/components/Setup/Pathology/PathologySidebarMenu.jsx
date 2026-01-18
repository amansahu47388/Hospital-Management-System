import { NavLink } from "react-router-dom";

export default function PathologySidebarMenu() {
  const menus = [
    {
      label: "Pathology Category",
      path: "/admin/setup/pathology/category",
    },
    {
      label: "Unit",
      path: "/admin/setup/pathology/unit",
    },
    {
      label: "Pathology Parameter",
      path: "/admin/setup/pathology/parameter",
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
