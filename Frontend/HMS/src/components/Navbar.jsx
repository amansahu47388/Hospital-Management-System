import React from "react";

 function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 rounded bg-gray-100">☰</button>
        <div className="text-lg font-semibold">MediLab Hospital</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-muted hidden sm:block">Madhusha</div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500"></div>
      </div>
    </header>
  );
}
export default Navbar;