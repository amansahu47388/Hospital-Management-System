import { NavLink } from "react-router-dom";

export default function PathologySidebarMenu() {
  const menus = [
    {
      label: "Pathology Category",
      path: "/admin/setup/pathology/category",
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
                `block px-3 py-2 rounded border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2
                ${
                  isActive
                    ? "bg-[#6046B5] text-white font-bold"
                    : "hover:bg-[#6046B5] hover:text-white"
                }`
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
