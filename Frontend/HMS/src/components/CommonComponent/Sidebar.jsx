import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Pill,
  UserRound,
  Calendar,
  Users,
  UserCheck,
  UserCog,
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
import FullLogo from "../../assets/icons/logo4.png"
import IconLogo from "../../assets/icons/shortlogo.png"


// Role-based permissions configuration
const ROLE_PERMISSIONS = {
  admin: ['dashboard', 'patient', 'appointment', 'opd', 'ipd', 'pharmacy', 'pathology', 'radiology', 'ambulance', 'billing', 'front-office', 'birth-death', 'inventory', 'finance', 'setup'],
  doctor: ['dashboard', 'patient', 'appointment', 'opd', 'ipd', 'pathology', 'radiology', 'ambulance', 'billing', 'birth-death', 'setup'],
  pharmacist: ['dashboard', 'patient', 'opd', 'ipd', 'pharmacy', 'billing', 'setup'],
  pathologist: ['dashboard', 'patient', 'opd', 'ipd', 'pathology', 'billing', 'setup'],
  radiologist: ['dashboard', 'patient', 'opd', 'ipd', 'radiology', 'billing', 'setup'],
  accountant: ['dashboard', 'patient', 'appointment', 'opd', 'ipd', 'pharmacy', 'pathology', 'radiology', 'ambulance', 'billing', 'inventory', 'finance', 'setup'],
  receptionist: ['dashboard', 'patient', 'appointment', 'opd', 'ipd', 'pharmacy', 'pathology', 'radiology', 'ambulance', 'billing', 'front-office', 'birth-death', 'inventory', 'setup'],
  nurse: ['dashboard', 'patient', 'opd', 'ipd', 'setup'],
};

// Setup submenu permissions for each role
const SETUP_PERMISSIONS = {
  admin: ['hospital-charges', 'bed', 'print-header-footer', 'front-office', 'operations', 'pharmacy', 'pathology', 'radiology', 'symptoms', 'findings', 'vitals', 'finance', 'inventory', 'appointment'],
  doctor: ['hospital-charges', 'bed', 'print-header-footer', 'pharmacy', 'symptoms', 'findings', 'vitals', 'finance', 'inventory', 'appointment'],
  pharmacist: ['hospital-charges', 'print-header-footer', 'pharmacy', 'finance', 'inventory', 'appointment'],
  pathologist: ['hospital-charges', 'print-header-footer', 'pathology', 'finance', 'inventory'],
  radiologist: ['hospital-charges', 'print-header-footer', 'radiology', 'finance', 'inventory'],
  accountant: ['hospital-charges', 'print-header-footer', 'bed', 'pharmacy', 'finance', 'inventory', 'appointment'],
  receptionist: ['bed', 'print-header-footer', 'front-office', 'finance', 'inventory', 'appointment'],
  nurse: ['bed', 'vitals', 'finance', 'inventory'],
};


const adminNavItems = [
  { to: "/admin/dashboard", label: "Dashboard", Icon: LayoutDashboard, permission: 'dashboard' },
  { to: "/admin/patients", label: "Patient", Icon: UserRound, permission: 'patient' },
  { to: "/admin/appointments", label: "Appointment", Icon: Calendar, permission: 'appointment' },
  { to: "/admin/opd-patients", label: "OPD-Out patient", Icon: Hospital, permission: 'opd' },
  { to: "/admin/ipd-patients", label: "IPD-In Patient", Icon: Bed, permission: 'ipd' },
  { to: "/admin/pharmacy-bills", label: "Pharmacy", Icon: Pill, permission: 'pharmacy' },
  { to: "/admin/pathology-bills", label: "Pathology", Icon: FlaskConical, permission: 'pathology' },
  { to: "/admin/radiology-bills", label: "Radiology", Icon: FolderGit2, permission: 'radiology' },
  { to: "/admin/Ambulance", label: "Ambulance", Icon: Ambulance, permission: 'ambulance' },
  { to: "/admin/billing", label: "Billing", Icon: CreditCard, permission: 'billing' },
  { to: "/admin/front-office/visitor-list", label: "Front Office", Icon: ClipboardList, permission: 'front-office' },
  { to: "/admin/Inventory/Item-Stock", label: "Inventory", Icon: ClipboardList, permission: 'inventory' },
  { to: "/Finance", label: "Finance", Icon: BarChart3, permission: 'finance' },
  { to: "/Setup", label: "Setup", Icon: Settings, permission: 'setup' },
];

const patientNavItems = [
  { to: "/patient-portal/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/patient-portal/appointments", label: "My Appointments", Icon: CalendarDays },
  { to: "/patient-portal/calendar", label: "Calendar", Icon: Calendar },
  { to: "/patient-portal/opd-history/overview", label: "OPD", Icon: Stethoscope },
  { to: "/patient-portal/ipd-history/overview", label: "IPD", Icon: Bed },
  { to: "/patient-portal/pharmacy", label: "Pharmacy", Icon: Pill },
  { to: "/patient-portal/pathology", label: "Pathology", Icon: FlaskConical },
  { to: "/patient-portal/radiology", label: "Radiology", Icon: FolderGit2 },
  { to: "/patient-portal/ambulance", label: "Ambulance", Icon: Ambulance },
];

function Sidebar({ role = "admin", user = null }) {
  // Helper function to check if user has permission
  const hasPermission = (permission) => {
    if (role === "patient") return true;
    const userPermissions = ROLE_PERMISSIONS[role.toLowerCase()] || ROLE_PERMISSIONS['admin'];
    return userPermissions.includes(permission);
  };

  // Helper function to check if user has permission for setup submenu items
  const hasSetupPermission = (setupItem) => {
    if (role === "patient") return false;
    const setupPermissions = SETUP_PERMISSIONS[role.toLowerCase()] || SETUP_PERMISSIONS['admin'];
    return setupPermissions.includes(setupItem);
  };

  // Filter nav items based on role permissions
  const navItems = role === "patient"
    ? patientNavItems
    : adminNavItems.filter(item => hasPermission(item.permission));

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
          {/* LOGO – hidden on mobile */}
          <div className="hidden md:flex mb-4 h-16 md:h-20 items-center justify-center">
            <img
              src={collapsed ? IconLogo : FullLogo}
              alt="Smart Hospital Logo"
              className={`
      object-contain transition-all duration-300
      ${collapsed
                  ? "h-10 w-10"
                  : "h-12 sm:h-14 md:h-16 lg:h-20 xl:h-24 w-auto"}
    `}
            />
          </div>

          {/* NAVIGATION */}
          <nav className="space-y-3 text-md font-semibold pb-10">
            {/* STAFF MANAGEMENT - Only for Super Admin */}
            {role !== "patient" && user?.is_superuser && (
              <NavLink
                to="/admin/staff-management"
                end
                className={({ isActive }) =>
                  `w-full flex items-center gap-4 py-2 px-2 transition-all duration-500 no-underline
                  ${isActive
                    ? "!text-white bg-white/10 rounded-md"
                    : "!text-white hover:!text-gray-200"
                  }`
                }
              >
                <UserCog size={20} className="flex-shrink-0" />
                <span className={`${collapsed ? "hidden" : "block"}`}>
                  Staff Management
                </span>
              </NavLink>
            )}
            {navItems.map(({ to, label, Icon }) => {
              /* FRONT OFFICE + BIRTH & DEATH */
              if (to === "/admin/front-office/visitor-list" && role !== "patient") {
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

                    {/* Birth & Death - Only show if user has permission */}
                    {hasPermission('birth-death') && (
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
                    )}
                  </React.Fragment>
                );
              }

              /* FINANCE MENU WITH SUBMENU */
              if (to === "/Finance" && role !== "patient") {
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
              if (to === "/Setup" && role !== "patient") {
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
                          { label: "Hospital Charges", path: "/admin/setup/charges-details", permission: "hospital-charges" },
                          { label: "Bed", path: "/admin/setup/bed-status", permission: "bed" },
                          { label: "Print Head. Foot.", path: "/admin/setup/appointment-header-footer", permission: "print-header-footer" },
                          { label: "Front Office", path: "/admin/setup/front-office/purpose-list", permission: "front-office" },
                          { label: "Operations", path: "/admin/setup/operation/operation-list", permission: "operations" },
                          { label: "Pharmacy", path: "/admin/setup/pharmacy/medicine-category", permission: "pharmacy" },
                          { label: "Pathology", path: "/admin/setup/pathology/category", permission: "pathology" },
                          { label: "Radiology", path: "/admin/setup/radiology/category", permission: "radiology" },
                          { label: "Symptoms", path: "/admin/setup/symptoms", permission: "symptoms" },
                          { label: "Findings", path: "/admin/setup/finding", permission: "findings" },
                          { label: "Vitals", path: "/admin/setup/vitals", permission: "vitals" },
                          { label: "Finance", path: "/admin/setup/finance/income-head", permission: "finance" },
                          { label: "Inventory", path: "/admin/setup/inventory/item-category", permission: "inventory" },
                          { label: "Appointment", path: "/admin/setup/appointment/shift", permission: "appointment" },
                        ]
                          .filter(item => hasSetupPermission(item.permission))
                          .map(({ label, path }) => (
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