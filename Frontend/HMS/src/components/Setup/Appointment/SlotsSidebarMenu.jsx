import { NavLink } from "react-router-dom";

export default function SlotsSidebarMenu() {
  return (
    <div className="bg-white rounded-md shadow h-fit sticky top-6">
      <ul className="text-sm">
        {[
          { name: "Shift", path: "/admin/setup/appointment/shift" },
          { name: "Appointment Priority", path: "/admin/setup/appointment/priority" },
        ].map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
             className={({ isActive }) =>
                `block px-3 py-2 rounded border border-gray-300 focus:border-[#6046B5] focus:ring-0.5 focus:ring-[#8A63D2] outline-none transition rounded px-3 py-2
                ${
                  isActive
                    ? "bg-[#6046B5] text-white font-bold"
                    : "hover:bg-[#6046B5] hover:text-white"
                }`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
