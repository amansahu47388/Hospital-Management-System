import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Home from "./pages/HomeModule/Home";
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
import AddOpd from "./pages/OPD/AddOpd";
import AddIpd from "./pages/IPD/AddIpd";
import UpdatePatient from "./components/PatientComponent/UpdatePatient"; 
import AdminProfile from "./pages/AdminModule/AdminProfie";
import DischargePatients from "./pages/IPD/DischargePatients";
import UpdateOpdPatient from "./pages/OPD/UpdateOpdPatient";
import UpdateIpdPatient from "./pages/IPD/UpdateIpdPatient";
import PathologyBill from "./pages/pathology/PathologyBill";
import  GenerateBill from "./pages/pathology/GenerateBill";
import PathologyTest from "./pages/pathology/PathologyTest";



function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
        <Routes>
          {/* Home Routes */}
          <Route path="/" element={<Home />} /> 

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          {/* <Route path="/admin/profile/edit" element={<UpdateAdminProfile />} />
          <Route path="/admin/profile/change-password" element={<ChangePassword />} /> */}


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
          <Route path="/admin/appointments/doctor-wise-appointments" element={<DoctorWiseAppointment />} />
          <Route path="/admin/appointments/patient-queue" element={<PatientQueue />} />

          {/* OPD and IPD Routes */}
          <Route path="/admin/opd-patients" element={<OpdPatient />} />
          <Route path="/admin/ipd-patients" element={<IpdPatient />} />
          <Route path="/admin/opd-patients/add-opd" element={<AddOpd />} />
          <Route path="/admin/ipd-patients/add-ipd" element={<AddIpd />} />
          <Route path="/admin/opd-patients/:opdId/update" element={<UpdateOpdPatient />} />
          <Route path="/admin/ipd-patients/:ipdId/update" element={<UpdateIpdPatient />} />
          <Route path="/admin/ipd-patients/discharge-patients" element={<DischargePatients />} />

          {/* Pathoogy Routes */}
          <Route path="/admin/pathology-bill" element={<PathologyBill />} />
          <Route path="/admin/pathology-bill/generate-bill" element={<GenerateBill />} />
          <Route path="/admin/pathology-tests" element={<PathologyTest />} />


          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
