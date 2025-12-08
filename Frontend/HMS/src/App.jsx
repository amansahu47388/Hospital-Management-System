import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import useModal from "./hooks/useModal";
import UserLogin from "./components/Account/UserLogin";
import UserSignup from "./components/Account/UserSignup";
import AdminSignup from "./components/Account/AdminSignup";
import AdminLogin from "./components/Account/AdminLogin";

function App() {
  // Custom modal hook for handling popup visibility
  const userlogin = useModal();
  const usersignup = useModal();
  const adminSignup = useModal();
  const adminLogin = useModal();

  return (
    <BrowserRouter>
      {/* Popup Modals */}
      <UserLogin
        open={userlogin.open}
        closeModal={userlogin.closeModal}
        openAdminLogin={adminLogin.openModal}
        openAdminSignup={adminSignup.openModal}
      />
      <UserSignup
        open={usersignup.open}
        closeModal={usersignup.closeModal}
        openAdminSignup={adminSignup.openModal}
        openAdminLogin={adminLogin.openModal}
      />
      <AdminSignup
        open={adminSignup.open}
        closeModal={adminSignup.closeModal}
        openUserSignup={usersignup.openModal}
        openUserLogin={userlogin.openModal}
      />
      <AdminLogin
        open={adminLogin.open}
        closeModal={adminLogin.closeModal}
        openUserSignup={usersignup.openModal}
        openUserLogin={userlogin.openModal}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              openLogin={userlogin.openModal}
              openSignup={usersignup.openModal}
              openAdminSignup={adminSignup.openModal}
              openAdminLogin={adminLogin.openModal}
            />
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
