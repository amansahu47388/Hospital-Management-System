import React from "react";
import ProfileDropdown from "./AdminProfileDropDown";

 function Navbar() {
  const user = {
    name: "Super Admin",
    role: "Super Admin",
    avatar: "https://i.pravatar.cc/150?img=3",
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/admin/login";
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <div className="flex items-center  gap-4">
        {/* <button className="md:hidden p-2 rounded bg-gray-100">☰</button> */}
        <div className="text-lg font-semibold ml-20">MediLab Hospital</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-muted hidden sm:block">Madhusha</div>
        <ProfileDropdown user={user} onLogout={handleLogout} />
      </div>
    </header>
  );
}
export default Navbar;