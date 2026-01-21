import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Pill,
  UserRound,
  Calendar,
  Users,
  UserCheck,
  Hospital,
  Stethoscope,
  FlaskConical,
  Droplet,
  Bed,
  Ambulance,
  Building2,
  QrCode,
  ClipboardList,
  CalendarDays,
  MessageCircle,
  FileDown,
  FileBadge,
  Monitor,
  BarChart3,
  Settings,
  FolderGit2,
  Menu,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  CreditCard,
  Video,
  Download,
} from "lucide-react";

const adminNavItems = [
  { to: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/admin/patients", label: "Patient", Icon: UserRound },
  { to: "/admin/appointments", label: "Appointment", Icon: Calendar },
  { to: "/admin/opd-patients", label: "OPD-Out patient", Icon: Hospital },
  { to: "/admin/ipd-patients", label: "IPD-In Patient", Icon: Bed },
  { to: "/admin/pharmacy-bills", label: "Pharmacy", Icon: Pill },
  { to: "/admin/pathology-bills", label: "Pathology", Icon: FlaskConical },
  { to: "/admin/radiology-bills", label: "Radiology", Icon: FolderGit2 },
  { to: "/admin/Ambulance", label: "Ambulance", Icon: Ambulance },
  { to: "/admin/finance-bills", label: "Billing", Icon: CreditCard },
  { to: "/admin/front-office/visitor-list", label: "Front Office", Icon: ClipboardList },
  { to: "/admin/Inventory/Item-Stock", label: "Inventory", Icon: ClipboardList },
  //{ to: "/QR-Code-Attendance", label: "QR Code Attendance", Icon: QrCode },
  //{ to: "/Duty-Roster", label: "Duty Roster", Icon: ClipboardList },
  // { to: "/Annual-Calendar", label: "Annual Calendar", Icon: CalendarDays },
  //{ to: "/Referral", label: "Referral", Icon: UserCheck },
  //{ to: "/TPA-Management", label: "TPA Management", Icon: Building2 },
  { to: "/Finance", label: "Finance", Icon: BarChart3 },

  //{ to: "/Messaging", label: "Messaging", Icon: MessageCircle },
  //{ to: "/Download-Calendar", label: "Download Calendar", Icon: FileDown },

  //{ to: "/Front-CMS", label: "Front CMS", Icon: Monitor },
  //{ to: "/Live-Consultation", label: "Live Consultation", Icon: Stethoscope },
  //{ to: "/Reports", label: "Reports", Icon: BarChart3 },
  { to: "/Setup", label: "Setup", Icon: Settings },
];

const patientNavItems = [
  { to: "/patient-portal/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/patient-portal/appointments", label: "My Appointments", Icon: CalendarDays },
  { to: "/patient-portal/opd-history/:section", label: "OPD", Icon: Stethoscope },
  { to: "/patient-portal/ipd-history/:section", label: "IPD", Icon: Bed },
  { to: "/patient-portal/pharmacy", label: "Pharmacy", Icon: Pill },
  { to: "/patient-portal/pathology", label: "Pathology", Icon: FlaskConical },
  { to: "/patient-portal/radiology", label: "Radiology", Icon: FolderGit2 },
  { to: "/patient-portal/blood-bank", label: "Blood Bank", Icon: Droplet },
  { to: "/patient-portal/ambulance", label: "Ambulance", Icon: Ambulance },
  { to: "/patient-portal/live-consultation", label: "Live Consultation", Icon: Video },
  { to: "/patient-portal/download-center", label: "Download Center", Icon: Download },
];

function Sidebar({ role = "admin" }) {
  const navItems = role === "admin" ? adminNavItems : patientNavItems;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [birthDeathRecordOpen, setBirthDeathRecordOpen] = useState(false);

  const [financeOpen, setFinanceOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const handleToggle = () => {
    if (window.innerWidth < 700) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const toggleBirthDeathRecord = () => {
    setBirthDeathRecordOpen(!birthDeathRecordOpen);
  };



  const toggleFinance = () => {
    setFinanceOpen(!financeOpen);
  };
  const toggleSetup = () => {
    setSetupOpen(!setupOpen);
  };


  // Close submenu when sidebar collapses
  useEffect(() => {
    if (collapsed) {
      setBirthDeathRecordOpen(false);

      setFinanceOpen(false);
      setSetupOpen(false);
    }
  }, [collapsed]);


  return (
    <div className="relative">
      {/* FLOATING TOGGLE BUTTON (Right side like your image) */}
      <button
        onClick={handleToggle}
        className="absolute  top-4 -right-10 z-50 p-1  cursor-pointer bg-transparent border-0 outline-0 focus:outline-0 focus:ring-0"
      >
        <Menu />
      </button>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:relative top-0 left-0 z-40 ${collapsed ? "w-20" : "w-64"
          } h-screen overflow-y-auto
        text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
        transition-transform duration-1000 md:transition-all md:duration-1000
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-5 justify-even">
          {/* Logo */}
          <div className="text-xl font-bold mb-10 flex items-center gap-3">
            {/* <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
              ML
            </div>
            {!collapsed && <span>MediLab Hospital</span>} */}
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-3 text-md font-semibold pb-10">
            {navItems.map(({ to, label, Icon }) => {
              /* FRONT OFFICE + BIRTH & DEATH */
              if (to === "/admin/front-office/visitor-list" && role === "admin") {
                return (
                  <React.Fragment key={to}>
                    <NavLink
                      to={to}
                      end
                      className={({ isActive }) =>
                        `w-full flex items-center gap-4 py-2 px-2 transition-all duration-500 no-underline
                        ${isActive
                          ? "!text-white bg-white/10 rounded-md"
                          : "!text-white hover:!text-gray-200"
                        }`
                      }
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      <span className={`${collapsed ? "hidden" : "block"}`}>{label}</span>
                    </NavLink>

                    {/* Birth & Death */}
                    <div>
                      <button
                        onClick={toggleBirthDeathRecord}
                        className={`w-full flex items-center justify-between py-2 px-2 transition-all duration-700
                        ${birthDeathRecordOpen
                            ? "bg-white/10 rounded-md"
                            : "hover:text-gray-200"
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          <FileBadge size={20} />
                          <span className={`${collapsed ? "hidden" : "block"} whitespace-nowrap truncate`}>
                            Birth & Death
                          </span>
                        </div>
                        {!collapsed &&
                          (birthDeathRecordOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                      </button>

                      {birthDeathRecordOpen && !collapsed && (
                        <div className="ml-8 mt-2 space-y-2">
                          <NavLink
                            to="/admin/birth-death-record/birth-record"
                            className={({ isActive }) =>
                              `w-full flex items-center gap-4 py-2 px-2 no-underline
                              ${isActive ? "bg-white/10 rounded-md" : ""}
                              !text-white hover:!text-white`
                            }
                          >
                            <ChevronRight size={20} className="flex-shrink-0 opacity-80" />
                            Birth Record
                          </NavLink>
                          <NavLink
                            to="/admin/birth-death-record/death-record"
                            className={({ isActive }) =>
                              `w-full flex items-center gap-4 py-2 px-2 no-underline
                              ${isActive ? "bg-white/10 rounded-md" : ""}
                              !text-white hover:!text-white`
                            }
                          >
                            <ChevronRight size={20} className="flex-shrink-0 opacity-80" />
                            Death Record
                          </NavLink>
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                );
              }

              /* FINANCE MENU WITH SUBMENU */
              if (to === "/Finance" && role === "admin") {
                return (
                  <React.Fragment key={to}>
                    <button
                      onClick={toggleFinance}
                      className={`w-full flex items-center justify-between py-2 px-2 transition-all duration-700
                      ${financeOpen
                          ? "bg-white/10 rounded-md"
                          : "hover:text-gray-200"
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <BarChart3 size={20} />
                        <span className={`${collapsed ? "hidden" : "block"} whitespace-nowrap truncate`}>
                          Finance
                        </span>
                      </div>
                      {!collapsed &&
                        (financeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </button>

                    {financeOpen && !collapsed && (
                      <div className="ml-8 mt-2 space-y-2">
                        <NavLink
                          to="/admin/finance/income-list"
                          className={({ isActive }) =>
                            `w-full flex items-center gap-4 py-2 px-2 no-underline
                            ${isActive ? "bg-white/10 rounded-md" : ""}
                            !text-white hover:!text-white`
                          }
                        >
                          <ChevronRight size={20} className="flex-shrink-0 opacity-80" />
                          Income
                        </NavLink>
                        <NavLink
                          to="/admin/finance/expense-list"
                          className={({ isActive }) =>
                            `w-full flex items-center gap-4 py-2 px-2 no-underline
                            ${isActive ? "bg-white/10 rounded-md" : ""}
                            !text-white hover:!text-white`
                          }
                        >
                          <ChevronRight size={14} className="flex-shrink-0 opacity-80" />
                          Expenditure
                        </NavLink>
                      </div>
                    )}
                  </React.Fragment>
                );
              }

              /* SETUP MENU WITH SUBMENU */
              if (to === "/Setup" && role === "admin") {
                return (
                  <React.Fragment key={to}>
                    <button
                      onClick={toggleSetup}
                      className={`w-full flex items-center justify-between py-2 px-2 transition-all duration-700
                      ${setupOpen ? "bg-white/10 rounded-md" : "hover:text-gray-200"}`}
                    >
                      <div className="flex items-center gap-4">
                        <Settings size={20} />
                        <span className={`${collapsed ? "hidden" : "block"} whitespace-nowrap truncate`}>
                          Setup
                        </span>
                      </div>

                      {!collapsed &&
                        (setupOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </button>

                    {setupOpen && !collapsed && (
                      <div className="ml-8 mt-2 space-y-2 ">
                        {[
                          { label: "Settings", path: "/admin/setup/settings" },
                          { label: "Hospital Charges", path: "/admin/setup/charges-details" },
                          { label: "Bed", path: "/admin/setup/bed-status" },
                          { label: "Print Head. Foot.", path: "/admin/setup/appointment-header-footer" },
                          { label: "Front Office", path: "/admin/setup/front-office/purpose-list" },
                          { label: "Operations", path: "/admin/setup/operation/operation-list" },
                          { label: "Pharmacy", path: "/admin/setup/pharmacy/medicine-category" },
                          { label: "Pathology", path: "/admin/setup/pathology/category" },
                          { label: "Radiology", path: "/admin/setup/radiology/category" },
                          { label: "Symptoms", path: "/admin/setup/symptoms/symptoms-head" },
                          { label: "Findings", path: "/admin/setup/finding" },
                          { label: "Vitals", path: "/admin/setup/vitals" },
                          { label: "Finance", path: "/admin/setup/finance/income-head" },
                          { label: "Inventory", path: "/admin/setup/inventory/item-category" },
                          { label: "Appointment", path: "/admin/setup/appointment/slots" },
                          { label: "Custom Fields", path: "/admin/setup/Custom Fields" },

                        ].map(({ label, path }) => (
                          <NavLink
                            key={path}
                            to={path}
                            className={({ isActive }) =>
                              `w-full flex items-center gap-3 py-2 px-2 no-underline
                              ${isActive ? "bg-white/10 rounded-md" : ""}
                              !text-white hover:!text-white`
                            }
                          >
                            <ChevronRight size={14} className="opacity-80" />
                            <span className="whitespace-nowrap">{label}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </React.Fragment>
                );
              }

              /* NORMAL MENU */
              return (
                <NavLink
                  key={to}
                  to={to}
                  end
                  className={({ isActive }) =>
                    `w-full flex items-center gap-4 py-2 px-2 transition-all duration-500 no-underline
                    ${isActive
                      ? "!text-white bg-white/10 rounded-md"
                      : "!text-white hover:!text-gray-200"
                    }`
                  }
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className={`${collapsed ? "hidden" : "block"}`}>
                    {label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;