import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Pill,
  UserRound,
  Calendar,
  Hospital,
  Bed,
  Ambulance,
  ClipboardList,
  FileBadge,
  BarChart3,
  Settings,
  FolderGit2,
  Menu,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  CreditCard,
  FlaskConical,
} from "lucide-react";

const navItems = [
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
  { to: "/Finance", label: "Finance", Icon: BarChart3 },
  { to: "/Setup", label: "Setup", Icon: Settings },
];

function Sidebar() {
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

  useEffect(() => {
    if (collapsed) {
      setBirthDeathRecordOpen(false);
      setFinanceOpen(false);
      setSetupOpen(false);
    }
  }, [collapsed]);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={handleToggle}
        className="absolute top-4 -right-10 z-50 p-1 bg-transparent border-0"
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-0 left-0 z-40 ${
          collapsed ? "w-20" : "w-64"
        } h-screen overflow-y-auto text-white
        bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
        transition-all duration-1000
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-5">

          <nav className="space-y-3 text-md font-bold pb-10">
          {navItems.map(({ to, label, Icon }) => {

/* FRONT OFFICE + BIRTH & DEATH */
if (to === "/admin/front-office/visitor-list") {
  return (
    <React.Fragment key={to}>
      <NavLink
        to={to}
        end
        className={({ isActive }) =>
          `w-full flex items-center gap-4 py-2 px-2 transition-all duration-500 no-underline
          ${
            isActive
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
          ${
            birthDeathRecordOpen
              ? "bg-white/10 rounded-md"
              : "hover:text-gray-200"
          }`}
        >
          <div className="flex items-center gap-4">
            <FileBadge size={20} />
            <span
                 className={`${collapsed ? "hidden" : "block"} whitespace-nowrap truncate`}
             >
              
       Birth & Death..

          
     </span>

          </div>
          {!collapsed &&
            (birthDeathRecordOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
        </button>

        {birthDeathRecordOpen && !collapsed && (
          <div className="ml-8 mt-2 space-y-2">
            <NavLink to="/admin/birth-death-record/birth-record" className={({ isActive }) =>
    `w-full flex items-center gap-4 py-2 px-2 no-underline
     ${isActive ? "bg-white/10 rounded-md" : ""}
     !text-white hover:!text-white`
  }>    <ChevronRight size={20} className="flex-shrink-0 opacity-80" />
           
              Birth Record
            </NavLink>
            <NavLink to="/admin/birth-death-record/death-record" className={({ isActive }) =>
    `w-full flex items-center gap-4 py-2 px-2 no-underline
     ${isActive ? "bg-white/10 rounded-md" : ""}
     !text-white hover:!text-white`
  }>     <ChevronRight size={20} className="flex-shrink-0 opacity-80" />
              Death Record
            </NavLink>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

/* CERTIFICATE MENU WITH SUBMENU */

/* FINANCE MENU WITH SUBMENU */
if (to === "/Finance") {
  return (
    <React.Fragment key={to}>
      <button
        onClick={toggleFinance}
        className={`w-full flex items-center justify-between py-2 px-2 transition-all duration-700
        ${
          financeOpen
            ? "bg-white/10 rounded-md"
            : "hover:text-gray-200"
        }`}
      >
        <div className="flex items-center gap-4">
          <BarChart3 size={20} />
          <span
               className={`${collapsed ? "hidden" : "block"} whitespace-nowrap truncate`}
           >
            
     Finance

        
   </span>

        </div>
        {!collapsed &&
          (financeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
      </button>

      {financeOpen && !collapsed && (
        <div className="ml-8 mt-2 space-y-2">
          <NavLink to="/admin/finance/income-list" className={({ isActive }) =>
  `w-full flex items-center gap-4 py-2 px-2 no-underline
   ${isActive ? "bg-white/10 rounded-md" : ""}
   !text-white hover:!text-white`
}>    <ChevronRight size={20} className="flex-shrink-0 opacity-80" />
         
            Income
          </NavLink>
          <NavLink to="/admin/finance/expense-list" className={({ isActive }) =>
  `w-full flex items-center gap-4 py-2 px-2 no-underline
   ${isActive ? "bg-white/10 rounded-md" : ""}
   !text-white hover:!text-white`
}>     <ChevronRight size={14} className="flex-shrink-0 opacity-80" />
            Expenditure
          </NavLink>
        </div>
      )}
    </React.Fragment>
  );
}

/* SETUP MENU WITH SUBMENU */
if (to === "/Setup") {
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
        <div className="ml-8 mt-2 space-y-2">

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
            { label: "Finance", path: "/admin/setup/finance" },
            { label: "Appointment", path: "/admin/setup/Appointment" },
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

              /* SETUP */
              if (to === "/Setup") {
                return (
                  <React.Fragment key={to}>
                    <button
                      onClick={() => setSetupOpen(!setupOpen)}
                      className="w-full flex justify-between items-center py-2 px-2"
                    >
                      <div className="flex gap-4">
                        <Icon size={20} />
                        {!collapsed && "Setup"}
                      </div>
                      {!collapsed &&
                        (setupOpen ? <ChevronUp /> : <ChevronDown />)}
                    </button>

                    {setupOpen && !collapsed && (
                      <div className="ml-8 space-y-2">
                        {[
                          "settings",
                          "charges-details",
                          "bed-status",
                          "front-office",
                          "operations",
                          "pharmacy",
                          "pathology",
                          "radiology",
                          "blood-bank",
                          "finance",
                        ].map((item) => (
                          <NavLink
                            key={item}
                            to={`/admin/setup/${item}`}
                            className="flex gap-2 py-1"
                          >
                            <ChevronRight size={16} /> {item}
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
                  className={({ isActive }) =>
                    `flex items-center gap-4 py-2 px-2 no-underline ${
                      isActive ? "bg-white/10 rounded-md" : ""
                    } !text-white`
                  }
                >
                  <Icon size={20} />
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
