import { NavLink } from "react-router-dom";

export default function ItemSidebarMenu() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-3 text-sm transition ${
      isActive
        ? "text-[#6046B5] font-semibold bg-purple-50"
        : "hover:bg-gray-100"
    }`;

  return (
    <div className="bg-white rounded-md shadow h-fit sticky top-6">
      <NavLink to="/admin/setup/inventory/item-category" className={linkClass}>
        Item Category
      </NavLink>
      <NavLink to="/admin/setup/inventory/item-store" className={linkClass}>
        Item Store
      </NavLink>
      <NavLink to="/admin/setup/inventory/item-supplier" className={linkClass}>
        Item Supplier
      </NavLink>
    </div>
  );
}
