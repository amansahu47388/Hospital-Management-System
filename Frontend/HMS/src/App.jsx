import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Home from "./pages/HomeModule/Home";
import Contact from "./pages/HomeModule/Contact";
import Dashboard from "./pages/AdminModule/Dashboard";
import PatientDashboard from "./pages/PatientModule/patientDashboard";
import PatientDetail from "./pages/PatientModule/patientDetail";
import UserLogin from "./pages/account/UserLogin";
import UserSignup from "./pages/account/UserSignup";
import AdminSignup from "./pages/account/AdminSignup";
import AdminLogin from "./pages/account/AdminLogin";
import Appointment from "./pages/AppointmentModule/Appointment";
import DoctorWiseAppointment from "./pages/AppointmentModule/DoctorWiseAppointment";
import PatientQueue from "./pages/AppointmentModule/PatientQueue";
import AddPatient from "./components/PatientComponent/AddPatient";
import OpdPatient from "./pages/OPD/OpdPatient";
import IpdPatient from "./pages/IPD/IpdPatient";
import UpdatePatient from "./components/PatientComponent/UpdatePatient"; 

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
        <Routes>
          {/* Home Routes */}
          <Route path="/" element={<Home />} /> 
          
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />

          {/* Auth Routes */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />

          {/* Patient Routes */}
          <Route path="/admin/patients" element={<PatientDashboard />} />
          <Route path="/admin/patients/add" element={<AddPatient />} />
          <Route path="/admin/patients/:id" element={<PatientDetail />} />
          <Route path="/admin/patients/:id/update" element={<UpdatePatient />} />
            
          {/* Appointment Routes */}
          <Route path="/admin/appointments" element={<Appointment />} />
          <Route path="/admin/appointment/doctor-wise-appointments" element={<DoctorWiseAppointment />} />
          <Route path="/admin/appointment/patient-queues" element={<PatientQueue />} />
            
          {/* OPD/IPD Routes */}
          <Route path="/admin/opd-patients" element={<OpdPatient />} />
          <Route path="/admin/IPD-In Patients" element={<IpdPatient />} />


          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
