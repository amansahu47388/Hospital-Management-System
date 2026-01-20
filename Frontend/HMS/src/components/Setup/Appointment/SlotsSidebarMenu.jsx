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
                `block px-4 py-3 transition ${
                  isActive
                    ? "text-[#6046B5] font-semibold bg-purple-50"
                    : "hover:bg-gray-100"
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
