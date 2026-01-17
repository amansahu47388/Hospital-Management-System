import { NavLink } from "react-router-dom";

export default function PrintHeaderFooterMenu() {
  const menu = [
    { label: "Appointment", path: "/admin/setup/appointment-header-footer" },
    { label: "OPD Prescription", path: "/admin/setup/opd-prescription-header-footer" },
    { label: "OPD Bill", path: "/admin/setup/opd-bill-header-footer" },
    { label: "IPD Prescription", path: "/admin/setup/ipd-prescription-header-footer" },
    { label: "IPD Bill", path: "/admin/setup/ipd-bill-header-footer" },
    { label: "Bill Summary", path: "/admin/print/bill-summary" },
    { label: "Pharmacy Bill", path: "/admin/print/pharmacy-bill" },
    { label: "Payslip", path: "/admin/print/payslip" },
    { label: "Payment Receipt", path: "/admin/print/payment-receipt" },
    { label: "Birth Record", path: "/admin/print/birth-record" },
    { label: "Death Record", path: "/admin/print/death-record" },
    { label: "Pathology", path: "/admin/print/pathology" },
    { label: "Radiology", path: "/admin/print/radiology" },
    { label: "Operation", path: "/admin/print/operation" },
    { label: "Blood Bank", path: "/admin/print/blood-bank" },
    { label: "Ambulance", path: "/admin/print/ambulance" },
    { label: "Discharge Card", path: "/admin/print/discharge-card" },
    { label: "OPD Antenatal Finding", path: "/admin/print/opd-antenatal" },
    { label: "Obstetric History", path: "/admin/print/obstetric-history" },
    { label: "IPD Antenatal Finding", path: "/admin/print/ipd-antenatal" },
  ];

  return (
    <div className="bg-white rounded-md p-3">
      <ul className="space-y-1 text-sm">
        {menu.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `
                block px-3 py-2 rounded transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600 font-semibold"
                    : "hover:bg-gray-100"
                }
                `
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
