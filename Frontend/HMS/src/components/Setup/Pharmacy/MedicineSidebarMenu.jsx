import { NavLink } from "react-router-dom";

export default function MedicineSidebarMenu() {
  const menus = [
    { label: "Medicine Category", path: "/admin/setup/pharmacy/medicine-category" },
    { label: "Supplier", path: "/admin/setup/pharmacy/supplier" },
    { label: "Medicine Dosage", path: "/admin/setup/pharmacy/medicine-dosage" },
    { label: "Dose", path: "/admin/setup/pharmacy/dose" },
    { label: "Unit", path: "/admin/setup/pharmacy/unit" },
    { label: "Company", path: "/admin/setup/pharmacy/company" },
    { label: "Medicine Group", path: "/admin/setup/pharmacy/medicine-group" },
  ];

  return (
    <div className="bg-white rounded-md ">
      <ul className="text-sm">
        {menus.map((menu) => (
          <li key={menu.path}>
            <NavLink
              to={menu.path}
              className={({ isActive }) =>
                `
                relative block px-5 py-3 transition-all duration-200
                ${
                  isActive
                   ? "bg-purple-200 text-purple-600 font-bold"
                    : "hover:bg-purple-100 hover:text-purple-500"
                }
              `
              }
            >
              {/* Active left bar */}
              <span
                className={`absolute left-0 top-0 h-full w-1 rounded-r
                ${menu.path && "bg-transparent"}
                `}
              />
              {menu.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
