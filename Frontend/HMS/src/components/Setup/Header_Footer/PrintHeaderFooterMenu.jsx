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
    { label: "Payslip", path: "/admin/setup/payslip-header-footer" },
    { label: "Payment Receipt", path: "/admin/setup/payment-receipt-header-footer" },
    { label: "Birth Record", path: "/admin/setup/birth-record-header-footer" },
    { label: "Death Record", path: "/admin/setup/death-record-header-footer" },
    { label: "Pathology", path: "/admin/setup/pathology-header-footer" },
    { label: "Radiology", path: "/admin/setup/radiology-header-footer" },
    { label: "Operation", path: "/admin/setup/operation-header-footer" },
    //{ label: "Blood Bank", path: "/admin/print/blood-bank" },
    { label: "Ambulance", path: "/admin/setup/ambulance-header-footer" },
    { label: "Discharge Card", path: "/admin/setup/discharge-card-header-footer" },
    { label: "OPD Antenatal Finding", path: "/admin/setup/opd-antenatal-finding-header-footer" },
    { label: "Obstetric History", path: "/admin/setup/obstetric-history-header-footer" },
    { label: "IPD Antenatal Finding", path: "/admin/setup/ipd-antenatal-finding-header-footer" },
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
