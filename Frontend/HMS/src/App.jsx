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
  const login = useModal();
  const signup = useModal();

  return (
    <BrowserRouter>
      {/* Popup Modals */}
      <LoginModal open={login.open} closeModal={login.closeModal} />
      <SignupModal open={signup.open} closeModal={signup.closeModal} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              openLogin={login.openModal}
              openSignup={signup.openModal}
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
