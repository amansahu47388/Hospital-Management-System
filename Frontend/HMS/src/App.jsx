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
import BirthRecord from "./pages/BirthDeathRecord/BirthRecord";
import DeathRecord from "./pages/BirthDeathRecord/DeathRecord";
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
import RadiologyBill from "./pages/radiology/RadiologyBill";
import RadiologyTest from "./pages/radiology/RadiologyTest";
import Billing from "./pages/Billing/Billing";
import BillingDetails from "./pages/Billing/BillingDetails";
import NurseNotesSinglePage from "./pages/IPD/IPDNurseNotes";
import NurseNotesSinglePage from "./pages/IPD/IPDNurseNotes";


//setup route paths and components
import BedStatus from "./pages/Setup/Bed/BedStatus";
import BedList from "./pages/Setup/Bed/BedList";
import BedTypeList from "./pages/Setup/Bed/BedTypeList";
import BedGroupList from "./pages/Setup/Bed/BedGroupList";
import FloorList from "./pages/Setup/Bed/FloorList";
import ChargesDetailsList from "./pages/Setup/Charges/ChargesDetailsList";
import ChargeCategoryList from "./pages/Setup/Charges/ChargeCategoryList";
import ChargeTypeList from "./pages/Setup/Charges/ChargeTypeList";
import TaxCategoryList from "./pages/Setup/Charges/TaxCategoryList";
import UnitTypeList from "./pages/Setup/Charges/UnitTypeList";
import AppointmentHeaderFooter from "./pages/Setup/Header_Footer/AppointmentHeaderFooter";
import OpdPrescriptionHeaderFooter from "./pages/Setup/Header_Footer/OpdPrescriptionHeaderFooter";
import OpdBillHeaderFooter from "./pages/Setup/Header_Footer/OpdBillHeaderFooter";
import IpdPrescriptionHeaderFooter from "./pages/Setup/Header_Footer/IpdPrescriptionHeaderFooter";
import IpdBillHeaderFooter from "./pages/Setup/Header_Footer/IpdBillHeaderFooter";
import PaySlipHeaderFooter from "./pages/Setup/Header_Footer/PayslipHeaderFooter";
import PharmacyBillHeaderFooter from "./pages/Setup/Header_Footer/PharmacyBillHeaderFooter";
import BillSummaryHeaderFooter from "./pages/Setup/Header_Footer/BillSummaryHeaderFooter";
import PaymentReceiptHeaderFooter from "./pages/Setup/Header_Footer/PaymentReceiptHeaderFooter";
import BirthRecordHeaderFooter from "./pages/Setup/Header_Footer/BirthRecordHeaderFooter";
import DeathRecordHeaderFooter from "./pages/Setup/Header_Footer/DeathRecordHeaderFooter";
import RadiologyHeaderFooter from "./pages/Setup/Header_Footer/RadiologyHeaderFooter";
import PathologyHeaderFooter from "./pages/Setup/Header_Footer/PathologyHeaderFooter";
import OperationHeaderFooter from "./pages/Setup/Header_Footer/OperationHeaderFooter";
import AmbulanceHeaderFooter from "./pages/Setup/Header_Footer/OperationHeaderFooter";
import ObstetricHistoryHeaderFooter from "./pages/Setup/Header_Footer/ObstetricHistoryHeaderFooter";
import OpdAntenatalFindingHeaderFooter from "./pages/Setup/Header_Footer/OpdAntenatalFindingHeaderFooter";
import IpdAntenatalFindingHeaderFooter from "./pages/Setup/Header_Footer/IpdAntenatalFindingHeaderFooter";
import DischargeCardHeaderFooter from "./pages/Setup/Header_Footer/DischargeCardHeaderFooter";
import PurposeList from "./pages/Setup/Front_Office/PurposeList";
import ComplaintType from "./pages/Setup/Front_Office/ComplaintType";
import Source from "./pages/Setup/Front_Office/Source";
import OperationList from "./pages/Setup/Operation/OperationList";
import MedicineCategory from "./pages/Setup/Pharmacy/MedicineCategory";
import Supplier from "./pages/Setup/Pharmacy/Supplier";
import DoseInterval from "./pages/Setup/Pharmacy/Dose";
import Dose from "./pages/Setup/Pharmacy/Dose";
import MedicineDosage from "./pages/Setup/Pharmacy/MedicineDosage";
import Company from "./pages/Setup/Pharmacy/Company";
import Unit from "./pages/Setup/Pharmacy/Unit";
import MedicineGroup from "./pages/Setup/Pharmacy/MedicineGroup";
import PathologyCategory from "./pages/Setup/Pathology/PathologyCategory";
import PathologyParameter from "./pages/Setup/Pathology/PathologyParameter";
import RadiologyCategory from "./pages/Setup/Radiology/RadiologyCategory";
import RadiologyParameter from "./pages/Setup/Radiology/RadiologyParameter";
import Symptoms from "./pages/Setup/Symptoms/Symptoms";
import FindingSetup from "./pages/Setup/Finding/FindingSetup";
import FindingCategory from "./pages/Setup/Finding/FindingCategory";
import VitalList from "./pages/Setup/Vital/VitalList";
import IncomeHead from "./pages/Setup/Finance/IncomeHead";
import ExpenseHead from "./pages/Setup/Finance/ExpenseHead";
import Shift from "./pages/Setup/Appointment/Shift";
import AppointmentPriority from "./pages/Setup/Appointment/AppointmentPriority";
import ItemCategory from "./pages/Setup/Inventory/ItemCategory";
import ItemStore from "./pages/Setup/Inventory/ItemStore";
import ItemSupplier from "./pages/Setup/Inventory/ItemSupplier";
import IPDComprehensivePage from "./pages/IPD/IPDComprehensive";
import PrescriptionSinglePage from "./pages/IPD/IPDPrescription";
import ConsultantRegisterSinglePage from "./pages/IPD/ConsultantRegister";
import OperationsSinglePage from "./pages/IPD/IPDOperations";
import IPDBedHistoryPage from "./pages/IPD/IPDBedHistory";
import IPDPaymentPage from "./pages/IPD/IPDPayment";
import IPDChargesPage from "./pages/IPD/IPDCharges";
import IPDTreatmentHistoryPage from "./pages/IPD/IPDTreatmentHistory";
import IPDVitalsPage from "./pages/IPD/IPDVitals";
import OPDComprehensivePage from "./pages/OPD/OPDComprehensive";
import OPDVisitsPage from "./pages/OPD/OPDVisitsPage";
import OPDOperationsPage from "./pages/OPD/OPDOperations";
import OPDChargesPage from "./pages/OPD/OPDCharges";
import OPDPaymentPage from "./pages/OPD/OPDPayment";
import OPDTreatmentHistoryPage from "./pages/OPD/OPDTreatmentHistory";
import OPDVitalsPage from "./pages/OPD/OPDVitals";




//patient entity routes
import PatientDashboardPage from "./pages/Patient/PatientDashboardPage";
import PatientAppointmentsPage from "./pages/Patient/My_Appointment/PatientAppointmentsPage";
import PatientOPDHistoryPage from "./pages/Patient/OPD/PatientOPDHistoryPage";
import IPDOverviewPage from "./pages/Patient/IPD/IPDOverviewPage";
import NurseNotes from "./pages/Patient/IPD/NurseNotes";
import IPDPrescription from "./pages/Patient/IPD/IPDPrescription";
import IPDConsultantRegister from "./pages/Patient/IPD/IPDConsultantRegister";
import Charges from "./pages/Patient/IPD/Charges";
import Operations from "./pages/Patient/IPD/Operations";
import LabInvestigation from "./pages/Patient/IPD/LabInvestigation";
import Vitals from "./pages/Patient/IPD/Vitals";
import Payment from "./pages/Patient/IPD/Payment";
import Timeline from "./pages/Patient/IPD/Timeline";
import TreatmentHistory from "./pages/Patient/IPD/TreatmentHistory";
import BedHistory from "./pages/Patient/IPD/BedHistory";
import Pharmacy from "./pages/Patient/Pharmacy/Pharmacy";
import Pathology from "./pages/Patient/Pathology/Pathology";
import Radiology from "./pages/Patient/Radiology/Radiology";
import Ambulance from "./pages/Patient/Ambulance/Ambulance";




function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>


            {/*/*****************************************************************************/}
            {/*                         ADMIN ROUTES                                        */}
            {/*/*****************************************************************************/}

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
           
            {/* IPD Routes */}
            <Route path="/admin/ipd-patients" element={<IpdPatient />} />
            <Route path="/admin/opd-patients/add-opd" element={<AddOpd />} />
            <Route path="/admin/ipd-patients/add-ipd" element={<AddIpd />} />
            <Route path="/admin/opd-patients/:opdId/update" element={<UpdateOpdPatient />} />
            <Route path="/admin/ipd-patients/:ipdId/update" element={<UpdateIpdPatient />} />
            <Route path="/admin/ipd-patients/discharge-patients" element={<DischargePatients />} />
            <Route path="/admin/ipd-patients/:ipdId/comprehensive-page" element={<IPDComprehensivePage />} />
            <Route path="/admin/ipd-patients/:ipdId/nurse-notes" element={<NurseNotesSinglePage />} />
            <Route path="/admin/ipd-patients/:ipdId/prescription" element={<PrescriptionSinglePage />} />
            <Route path="/admin/ipd-patients/:ipdId/profile" element={<IPDComprehensivePage />} />
            <Route path="/admin/ipd-patients/:ipdId/consultant" element={<ConsultantRegisterSinglePage />} />            <Route path="/admin/ipd-patients/:ipdId/operations" element={<OperationsSinglePage />} />
            <Route path="/admin/ipd-patients/:ipdId/bed-history" element={<IPDBedHistoryPage />} />
            <Route path="/admin/ipd-patients/:ipdId/payments" element={<IPDPaymentPage />} />
            <Route path="/admin/ipd-patients/:ipdId/charges" element={<IPDChargesPage />} />
            <Route path="/admin/ipd-patients/:ipdId/treatment-history" element={<IPDTreatmentHistoryPage />} />
            <Route path="/admin/ipd-patients/:ipdId/vitals" element={<IPDVitalsPage />} />

            <Route path="/admin/opd-patients" element={<OpdPatient />} />
            <Route path="/admin/opd-patients/:opdId/profile" element={<OPDComprehensivePage />} />
            <Route path="/admin/opd-patients/:opdId/visits" element={<OPDVisitsPage />} />            <Route path="/admin/opd-patients/:opdId/operations" element={<OPDOperationsPage />} />
            <Route path="/admin/opd-patients/:opdId/charges" element={<OPDChargesPage />} />
            <Route path="/admin/opd-patients/:opdId/payments" element={<OPDPaymentPage />} />
            <Route path="/admin/opd-patients/:opdId/treatment-history" element={<OPDTreatmentHistoryPage />} />
            <Route path="/admin/opd-patients/:opdId/vitals" element={<OPDVitalsPage />} />

            <Route path="/admin/ipd-patients/:ipdId/nurse-notes" element={<NurseNotesSinglePage />} />
            <Route path="/admin/ipd-patients/:ipdId/prescription" element={<PrescriptionSinglePage />} />
            <Route path="/admin/ipd-patients/:ipdId/profile" element={<IPDComprehensivePage />} />
            <Route path="/admin/ipd-patients/:ipdId/consultant" element={<ConsultantRegisterSinglePage />} />            <Route path="/admin/ipd-patients/:ipdId/operations" element={<OperationsSinglePage />} />
            <Route path="/admin/ipd-patients/:ipdId/bed-history" element={<IPDBedHistoryPage />} />
            <Route path="/admin/ipd-patients/:ipdId/payments" element={<IPDPaymentPage />} />
            <Route path="/admin/ipd-patients/:ipdId/charges" element={<IPDChargesPage />} />
            <Route path="/admin/ipd-patients/:ipdId/treatment-history" element={<IPDTreatmentHistoryPage />} />
            <Route path="/admin/ipd-patients/:ipdId/vitals" element={<IPDVitalsPage />} />

            <Route path="/admin/opd-patients" element={<OpdPatient />} />
            <Route path="/admin/opd-patients/:opdId/profile" element={<OPDComprehensivePage />} />
            <Route path="/admin/opd-patients/:opdId/visits" element={<OPDVisitsPage />} />            <Route path="/admin/opd-patients/:opdId/operations" element={<OPDOperationsPage />} />
            <Route path="/admin/opd-patients/:opdId/charges" element={<OPDChargesPage />} />
            <Route path="/admin/opd-patients/:opdId/payments" element={<OPDPaymentPage />} />
            <Route path="/admin/opd-patients/:opdId/treatment-history" element={<OPDTreatmentHistoryPage />} />
            <Route path="/admin/opd-patients/:opdId/vitals" element={<OPDVitalsPage />} />

            {/* Pathology Routes */}
            <Route path="/admin/pathology-bills" element={<PathologyBill />} />
            <Route path="/admin/pathology-tests" element={<PathologyTest />} />

            {/* Radiology Routes */}
            <Route path="/admin/radiology-bills" element={<RadiologyBill />} />
            <Route path="/admin/radiology-tests" element={<RadiologyTest />} />

            {/* Billing Routes */}
            <Route path="/admin/billing" element={<Billing />} />
            <Route path="/admin/billing/details" element={<BillingDetails />} />


            {/* Pharmacy Routes */}
            <Route path="/admin/pharmacy-bills" element={<PharmacyBill />} />
            <Route path="/admin/pharmacy-bill/medicine-stock" element={<MedicineStock />} />
            <Route path="/admin/pharmacy-bill/medicine-purchase-list" element={<MedicinePurchaseList />} />

            {/* Ambulance Routes */}
            <Route path="/admin/ambulance" element={<AmbulanceCallList />} />
            <Route path="/admin/ambulance-list" element={<AmbulanceList />} />

            {/* Birth - Death Routes */}
            <Route path="/admin/birth-death-record/birth-record" element={<BirthRecord />} />
            <Route path="/admin/birth-death-record/death-record" element={<DeathRecord />} />

            {/* Inventory Routes */}
            <Route path="/admin/Inventory/Item-Stock" element={<ItemStockPage />} />
            <Route path="/admin/Inventory/Issue-Item" element={<IssueItemPage />} />
            <Route path="/admin/Inventory/Item-List" element={<ItemListPage />} />

            {/* Front Office Routes */}
            <Route path="/admin/front-office/visitor-list" element={<VisitorList />} />
            <Route path="/admin/front-office/postal-receive" element={<PostalReceive />} />
            <Route path="/admin/front-office/postal-dispatch" element={<PostalDispatch />} />
            <Route path="/admin/front-office/complain-list" element={<ComplainList />} />

            {/* Finance Routes */}
            <Route path="/admin/finance/income-list" element={<IncomeList />} />
            <Route path="/admin/finance/expense-list" element={<ExpenseList />} />

            {/* Calendar Routes */}
            <Route path="/admin/Calendar" element={<CelenderPage />} />







{/*****************************************************************************/}
{/*                         SETUP ROUTES                                        */}
{/*/*****************************************************************************/}
            {/* Bad Setup Routes */}
            <Route path="/admin/setup/bed-status" element={<BedStatus />} />
            <Route path="/admin/setup/bed" element={<BedList />} />
            <Route path="/admin/setup/bed-type" element={<BedTypeList />} />
            <Route path="/admin/setup/bed-group" element={<BedGroupList />} />
            <Route path="/admin/setup/floor" element={<FloorList />} />

            {/* Hospital charges Setup Routes */}
            <Route path="/admin/setup/charges-details" element={<ChargesDetailsList />} />
            <Route path="/admin/setup/charge-category" element={<ChargeCategoryList />} />
            <Route path="/admin/setup/charge-type" element={<ChargeTypeList />} />
            <Route path="/admin/setup/tax-category" element={<TaxCategoryList />} />
            <Route path="/admin/setup/unit-type" element={<UnitTypeList />} />

            {/* Header Footer Setup Routes */}
            <Route path="/admin/setup/appointment-header-footer" element={<AppointmentHeaderFooter />} />
            <Route path="/admin/setup/opd-prescription-header-footer" element={<OpdPrescriptionHeaderFooter />} />
            <Route path="/admin/setup/opd-bill-header-footer" element={<OpdBillHeaderFooter />} />
            <Route path="/admin/setup/ipd-prescription-header-footer" element={<IpdPrescriptionHeaderFooter />} />
            <Route path="/admin/setup/ipd-bill-header-footer" element={<IpdBillHeaderFooter />} />
            <Route path="/admin/setup/payslip-header-footer" element={<PaySlipHeaderFooter />} />
            <Route path="/admin/setup/pharmacy-bill-header-footer" element={<PharmacyBillHeaderFooter />} />
            <Route path="/admin/setup/bill-summary-header-footer" element={<BillSummaryHeaderFooter />} />
            <Route path="/admin/setup/payment-receipt-header-footer" element={<PaymentReceiptHeaderFooter />} />
            <Route path="/admin/setup/birth-record-header-footer" element={<BirthRecordHeaderFooter />} />
            <Route path="/admin/setup/death-record-header-footer" element={<DeathRecordHeaderFooter />} />
            <Route path="/admin/setup/radiology-header-footer" element={<RadiologyHeaderFooter />} />
            <Route path="/admin/setup/pathology-header-footer" element={<PathologyHeaderFooter />} />
            <Route path="/admin/setup/operation-header-footer" element={<OperationHeaderFooter />} />
            <Route path="/admin/setup/ambulance-header-footer" element={<AmbulanceHeaderFooter />} />
            <Route path="/admin/setup/obstetric-history-header-footer" element={<ObstetricHistoryHeaderFooter />} />
            <Route path="/admin/setup/opd-antenatal-finding-header-footer" element={<OpdAntenatalFindingHeaderFooter />} />
            <Route path="/admin/setup/ipd-antenatal-finding-header-footer" element={<IpdAntenatalFindingHeaderFooter />} />
            <Route path="/admin/setup/discharge-card-header-footer" element={<DischargeCardHeaderFooter />} />
            
            
            <Route path="/admin/setup/front-office/purpose-list" element={<PurposeList />} />
            <Route path="/admin/setup/front-office/complain-type" element={<ComplaintType />} />
            <Route path="/admin/setup/front-office/source" element={<Source />} />
            <Route path="/admin/setup/operation/operation-list" element={<OperationList />} />
            <Route path="/admin/setup/pharmacy/medicine-category" element={<MedicineCategory />} />
            <Route path="/admin/setup/pharmacy/supplier" element={<Supplier />} />
            <Route path="/admin/setup/pharmacy/dose-interval" element={<DoseInterval />} />
            <Route path="/admin/setup/pharmacy/medicine-dosage" element={<MedicineDosage />} />
            <Route path="/admin/setup/pharmacy/company" element={<Company />} />
            <Route path="/admin/setup/pharmacy/dose" element={<Dose />} />
            <Route path="/admin/setup/pharmacy/unit" element={<Unit />} />
            <Route path="/admin/setup/pharmacy/medicine-group" element={<MedicineGroup />} />
            <Route path="/admin/setup/pathology/category" element={<PathologyCategory />} />
            <Route path="/admin/setup/pathology/parameter" element={<PathologyParameter />} />
            <Route path="/admin/setup/radiology/category" element={<RadiologyCategory />} />
            <Route path="/admin/setup/radiology/parameter" element={<RadiologyParameter />} />
            <Route path="/admin/setup/symptoms" element={<Symptoms />} />
            <Route path="/admin/setup/finding" element={<FindingSetup />} />
            <Route path="/admin/setup/finding/category" element={<FindingCategory />} />
            <Route path="/admin/setup/vitals" element={<VitalList />} />
            <Route path="/admin/setup/finance/income-head" element={<IncomeHead />} />
            <Route path="/admin/setup/finance/expense-head" element={<ExpenseHead />} />
            <Route path="/admin/setup/appointment/shift" element={<Shift />} />
            <Route path="/admin/setup/appointment/priority" element={<AppointmentPriority />} />
            <Route path="/admin/setup/inventory/item-category" element={<ItemCategory />} />
            <Route path="/admin/setup/inventory/item-store" element={<ItemStore />} />
            <Route path="/admin/setup/inventory/item-supplier" element={<ItemSupplier />} />

   



{/*****************************************************************************/}
{/*                         PATIENT ROUTES                                     */}
{/*****************************************************************************/}
            {/* Patient Entity Routes */}
            <Route path="/patient-portal/dashboard" element={<PatientDashboardPage />} />
            <Route path="/patient-portal/appointments" element={<PatientAppointmentsPage />} />
            <Route path="/patient-portal/opd-history/:section" element={<PatientOPDHistoryPage />} />
            <Route path="/patient-portal/ipd-history/:section" element={<IPDOverviewPage />} />
            <Route path="/patient-portal/ipd-history/nurse-notes" element={<NurseNotes />} />
            <Route path="/patient-portal/ipd-history/prescription" element={<IPDPrescription />} />
            <Route path="/patient-portal/ipd-history/consultant-register" element={<IPDConsultantRegister />} />
            <Route path="/patient-portal/ipd-history/charges" element={<Charges />} />
            <Route path="/patient-portal/ipd-history/operations" element={<Operations />} />
            <Route path="/patient-portal/ipd-history/lab-investigation" element={<LabInvestigation />} />
            <Route path="/patient-portal/ipd-history/vitals" element={<Vitals />} />
            <Route path="/patient-portal/ipd-history/payment" element={<Payment />} />
            <Route path="/patient-portal/ipd-history/timeline" element={<Timeline />} />
            <Route path="/patient-portal/ipd-history/treatment-history" element={<TreatmentHistory />} />
            <Route path="/patient-portal/ipd-history/bed-history" element={<BedHistory />} />

            <Route path="/patient-portal/pharmacy" element={<Pharmacy />} />
            <Route path="/patient-portal/pathology" element={<Pathology />} />
            <Route path="/patient-portal/radiology" element={<Radiology />} />
            <Route path="/patient-portal/ambulance" element={<Ambulance />} />


        </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
