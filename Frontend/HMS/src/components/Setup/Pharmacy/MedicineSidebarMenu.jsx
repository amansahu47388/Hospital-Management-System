import { NavLink } from "react-router-dom";

export default function MedicineSidebarMenu() {
  const menus = [
    { label: "Medicine Category", path: "/admin/setup/pharmacy/medicine-category" },
    { label: "Supplier", path: "/admin/setup/pharmacy/supplier" },
    { label: "Medicine Dosage", path: "/admin/setup/pharmacy/medicine-dosage" },
    { label: "Dose Interval", path: "/admin/setup/pharmacy/dose-interval" },
    { label: "Dose Duration", path: "/admin/setup/pharmacy/dose-duration" },
    { label: "Unit", path: "/admin/setup/pharmacy/unit" },
    { label: "Company", path: "/admin/setup/pharmacy/company" },
    { label: "Medicine Group", path: "/admin/setup/pharmacy/medicine-group" },
  ];

  return (
    <div className="bg-white rounded-sm shadow-sm">
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
                    ? "bg-gradient-to-r from-[#6046B5]/10 to-[#8A63D2]/10 text-[#6046B5] font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
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
