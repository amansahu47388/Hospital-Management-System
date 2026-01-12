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
import PathologyTest from "./pages/pathology/PathologyTest";
import PharmacyBill from "./pages/Pharmacy/PharmacyBill";
import MedicineStock from "./pages/Pharmacy/MedicineStock";
import MedicinePurchaseList from "./pages/Pharmacy/MedicinePurchaseList";
import AmbulanceCallList from "./pages/Ambulance/AmbulanceCallList";
import AmbulanceList from "./pages/Ambulance/AmbulanceList";
import BirthRecord  from "./pages/Birthrecord/BirthRecord";
import DeathRecordPage from "./pages/Deathrecord/DeathRecordPage";
import ItemStockPage from "./pages/Inventory/ItemStockPage"; 
import IssueItemPage from "./pages/Inventory/IssueItemPage";
import ItemListPage from "./pages/Inventory/ItemListPage";
import CelenderPage from "./pages/Celender/CalendarPage";
import VisitorList from "./pages/Front_office/VisitorList";
import PostalReceive from "./pages/Front_office/PostalReceive";
import PostalDispatch from "./pages/Front_office/PostalDispatch";
import ComplainList from "./pages/Front_office/ComplainList";
import IncomeList from "./pages/Finance/IncomeList";
import ExpenseList from "./pages/Finance/ExpenseList";

//sertup route paths and components
import BedStatus from "./pages/Setup/Bed/BedStatus";
import BedList from "./pages/Setup/Bed/BedList";
import BedTypeList from "./pages/Setup/Bed/BedTypeList";

import RadiologyBill from "./pages/radiology/RadiologyBill";
import RadiologyTest from "./pages/radiology/RadiologyTest";
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


          {/* Pathology Routes */}
          <Route path="/admin/pathology-bills" element={<PathologyBill />} />
          <Route path="/admin/pathology-tests" element={<PathologyTest />} />


          {/* Radiology Routes */}
          <Route path="/admin/radiology-bills" element={<RadiologyBill />} />
          <Route path="/admin/radiology-tests" element={<RadiologyTest />} />


          {/* Pharmacy Routes */}
          <Route path="/admin/pharmacy-bills" element={<PharmacyBill />} />
          <Route path="/admin/pharmacy-bill/medicine-stock" element={<MedicineStock />} />
          <Route path="/admin/pharmacy-bill/medicine-purchase-list" element={<MedicinePurchaseList />} />


          {/* Ambulance Routes */}
          <Route path="/admin/Ambulance" element={<AmbulanceCallList />} />
          <Route path="/admin/ambulance-list" element={<AmbulanceList />} />
            
            
          <Route path="/admin/Birth-Record"   element={<BirthRecord/>} />
          <Route path="/admin/Death-Record"   element={<DeathRecordPage/>} />
          <Route path="/admin/Inventory/Item-Stock"   element={<ItemStockPage/>} />   
          <Route path="/admin/Inventory/Issue-Item"   element={<IssueItemPage/>} />
          <Route path="/admin/Inventory/Item-List"   element={<ItemListPage/>} />
          <Route path="/admin/Calendar"   element={<CelenderPage/>} />
          <Route path="/admin/front-office/visitor-list"   element={<VisitorList/>} />
          <Route path="/admin/front-office/postal-receive"   element={<PostalReceive/>} />
          <Route path="/admin/front-office/postal-dispatch"   element={<PostalDispatch/>} />
          <Route path="/admin/front-office/complain-list"   element={<ComplainList/>} />
          <Route path="/admin/finance/income-list"   element={<IncomeList/>} />
          <Route path="/admin/finance/expense-list"   element={<ExpenseList/>} />

          // Setup Routes
          <Route path="/admin/setup/bed-status" element={<BedStatus />}
           />
          <Route path="/admin/setup/bed" element={<BedList />} />
          <Route path="/admin/setup/bed-type" element={<BedTypeList />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
