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

                    <button
                      onClick={() => setBirthDeathRecordOpen(!birthDeathRecordOpen)}
                      className="w-full flex justify-between items-center py-2 px-2"
                    >
                      <div className="flex gap-4">
                        <FileBadge size={20} />
                        {!collapsed && "Birth & Death"}
                      </div>
                      {!collapsed &&
                        (birthDeathRecordOpen ? <ChevronUp /> : <ChevronDown />)}
                    </button>

                    {birthDeathRecordOpen && !collapsed && (
                      <div className="ml-8 space-y-2">
                        <NavLink to="/admin/Birth-Record" className="flex gap-2 py-1">
                          <ChevronRight size={16} /> Birth Record
                        </NavLink>
                        <NavLink to="/admin/Death-Record" className="flex gap-2 py-1">
                          <ChevronRight size={16} /> Death Record
                        </NavLink>
                      </div>
                    )}
                  </React.Fragment>
                );
              }

              /* FINANCE */
              if (to === "/Finance") {
                return (
                  <React.Fragment key={to}>
                    <button
                      onClick={() => setFinanceOpen(!financeOpen)}
                      className="w-full flex justify-between items-center py-2 px-2"
                    >
                      <div className="flex gap-4">
                        <Icon size={20} />
                        {!collapsed && "Finance"}
                      </div>
                      {!collapsed &&
                        (financeOpen ? <ChevronUp /> : <ChevronDown />)}
                    </button>

                    {financeOpen && !collapsed && (
                      <div className="ml-8 space-y-2">
                        <NavLink to="/admin/finance/income-list" className="flex gap-2 py-1">
                          <ChevronRight size={16} /> Income
                        </NavLink>
                        <NavLink to="/admin/finance/expense-list" className="flex gap-2 py-1">
                          <ChevronRight size={16} /> Expenditure
                        </NavLink>
                      </div>
                    )}
                  </React.Fragment>
                );
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
