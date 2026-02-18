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
                `block px-3 py-2 rounded border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2
                ${
                  isActive
                    ? "bg-[#6046B5] text-white font-bold"
                    : "hover:bg-[#6046B5] hover:text-white"
                }`
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
