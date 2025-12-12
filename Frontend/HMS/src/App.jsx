import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/HomeModule/Home";
import About from "./pages/HomeModule/About";
import Contact from "./pages/HomeModule/Contact";
import Dashboard from "./pages/AdminModule/Dashboard";
import PatientDashboard from "./pages/PatientModule/patientDashboard";
import useModal from "./hooks/useModal";
import LoginModal from "./components/Account/UserLogin";
import SignupModal from "./components/Account/UserSignup";
import PatientDetail from "./pages/PatientModule/patientDetail";
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
         <Route path="/patient" element={<PatientDashboard />} />
         <Route path="/patients" element={<PatientDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
