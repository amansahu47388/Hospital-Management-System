import { NavLink } from "react-router-dom";

export default function RadiologySidebarMenu() {
  const menus = [
    {
      label: "Radiology Category",
      path: "/admin/setup/radiology/category",
    },
    {
      label: "Unit",
      path: "/admin/setup/radiology/unit",
    },
    {
      label: "Radiology Parameter",
      path: "/admin/setup/radiology/parameter",
    },
  ];

  return (
    <div className="bg-white rounded-md  shadow-md overflow-hidden">
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
                    ? "bg-gradient-to-r from-[#6046B5]/15 to-[#8A63D2]/15 text-[#6046B5] font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
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
