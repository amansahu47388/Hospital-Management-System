import { NavLink } from "react-router-dom";

export default function FindingSidebarMenu() {
  return (
    <div className="bg-white rounded-md">
      <ul className="text-sm">
        {[
          { label: "Finding", path: "/admin/setup/finding" },
          { label: "Finding Category", path: "/admin/setup/finding/category" },
        ].map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "block px-3 py-2 rounded bg-purple-200 text-purple-600 font-bold"
                  : "block px-3 py-2 rounded hover:bg-purple-100 transition hover:text-purple-500"
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
