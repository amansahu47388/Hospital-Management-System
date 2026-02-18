import { NavLink } from "react-router-dom";

export default function PrintHeaderFooterMenu() {
  const menu = [
    { label: "Appointment", path: "/admin/setup/appointment-header-footer" },
    { label: "OPD Prescription", path: "/admin/setup/opd-prescription-header-footer" },
    { label: "OPD Bill", path: "/admin/setup/opd-bill-header-footer" },
    { label: "IPD Prescription", path: "/admin/setup/ipd-prescription-header-footer" },
    { label: "IPD Bill", path: "/admin/setup/ipd-bill-header-footer" },
    { label: "Bill Summary", path: "/admin/setup/bill-summary-header-footer" },
    { label: "Pharmacy Bill", path: "/admin/setup/pharmacy-bill-header-footer" },
    { label: "Birth Record", path: "/admin/setup/birth-record-header-footer" },
    { label: "Death Record", path: "/admin/setup/death-record-header-footer" },
    { label: "Pathology", path: "/admin/setup/pathology-header-footer" },
    { label: "Radiology", path: "/admin/setup/radiology-header-footer" },
    { label: "Operation", path: "/admin/setup/operation-header-footer" },
    { label: "Ambulance", path: "/admin/setup/ambulance-header-footer" },
    { label: "Discharge Card", path: "/admin/setup/discharge-card-header-footer" },
  ];

  return (
    <div className="bg-white rounded-md p-3">
      <ul className="space-y-1 text-sm">
        {menu.map((item) => (
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
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
