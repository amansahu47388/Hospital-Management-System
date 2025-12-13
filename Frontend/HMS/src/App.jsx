import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/HomeModule/Home";
import About from "./pages/HomeModule/About";
import Contact from "./pages/HomeModule/Contact";
import Dashboard from "./pages/AdminModule/Dashboard";
import PatientDashboard from "./pages/PatientModule/patientDashboard";
import PatientDetail from "./pages/PatientModule/patientDetail";

// Page-level auth
import UserLogin from "./pages/account/UserLogin";
import UserSignup from "./pages/account/UserSignup";
import AdminSignup from "./pages/account/AdminSignup";
import AdminLogin from "./pages/account/AdminLogin";

import { AuthProvider } from "./context/AuthContext"; 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patient" element={<PatientDashboard />} />
          <Route path="/patients" element={<PatientDashboard />} />
          <Route path="/patients/:id" element={<PatientDetail />} />

          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
