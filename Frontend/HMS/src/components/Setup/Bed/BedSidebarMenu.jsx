import { NavLink } from "react-router-dom";

export default function BedSidebarMenu() {
    return (
        <div className="bg-white rounded-md">
            <ul className="text-sm">
                {[
                    { label: "Bed Status", path: "/admin/setup/bed-status" },
                    { label: "Bed", path: "/admin/setup/bed" },
                    { label: "Bed Type", path: "/admin/setup/bed-type" },
                    { label: "Bed Group", path: "/admin/setup/bed-group" },
                    { label: "Floor", path: "/admin/setup/floor" },
                ].map((item) => (
                    <li key={item.label}>
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
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}
