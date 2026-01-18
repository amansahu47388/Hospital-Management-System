import { NavLink } from "react-router-dom";

export default function SymptomsSidebarMenu() {
  return (
    <div className="bg-white rounded-md shadow h-fit sticky top-6">
      <ul className="text-sm">
        <li>
          <NavLink
            to="/admin/setup/symptoms/symptoms-head"
            className={({ isActive }) =>
              `block px-5 py-3 transition
               ${
                 isActive
                   ? "text-[#6046B5] font-semibold bg-purple-50"
                   : "hover:bg-gray-100 text-gray-700"
               }`
            }
          >
            Symptoms Head
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/setup/symptoms/symptoms-type"
            className={({ isActive }) =>
              `block px-5 py-3 transition
               ${
                 isActive
                   ? "text-[#6046B5] font-semibold bg-purple-50"
                   : "hover:bg-gray-100 text-gray-700"
               }`
            }
          >
            Symptoms Type
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
