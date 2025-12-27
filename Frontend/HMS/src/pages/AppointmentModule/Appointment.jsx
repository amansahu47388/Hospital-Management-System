import React from "react";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import AppointmentTabs from "../../components/AppointmentComponent/AppointmentTabs";
import AppointmentToolbar from "../../components/AppointmentComponent/AppointmentToolbar";
import AppointmentTable from "../../components/AppointmentComponent/AppointmentTable";
import { useAppointments } from "./../../hooks/useAppointments";
 import AddAppointmentModal from "../../components/AppointmentComponent/Addappointment";
 //import appointments_data from "../../data/dummyData/appointments_data";
 const appointments_data= [
  {
    patient_name: "John Doe",
    appointment_no: "APP001",
    created_by: "Admin",
    appointment_date: "2023-10-01",
    phone: "1234567890",
    gender: "Male",
    doctor: "Dr. Smith",
    source: "Online",
    priority: "High",
    live_consultant: "Yes",
    alternate_address: "123 Main St",
    fees: 100,
    discount: 10,
    paid: 90,
    status: "Confirmed",
  },
  {
    patient_name: "Jane Smith",
    appointment_no: "APP002",
    created_by: "Receptionist",
    appointment_date: "2023-10-02",
    phone: "0987654321",
    gender: "Female",
    doctor: "Dr. Johnson",
    source: "Walk-in",
    priority: "Medium",
    live_consultant: "No",
    alternate_address: "456 Elm St",
    fees: 150,
    discount: 0,
    paid: 150,
    status: "Pending",
  },
  // Add more as needed
];
 import { useState } from "react";
export default function Appointment() {
 
const [openAdd, setOpenAdd] = useState(false);
  const {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    limit,
    setLimit,
    appointments,
    loading,
    error,
    refetch,
  } = useAppointments();

  return (
    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <div className="sticky top-0 z-20 w-full">
        <Navbar />

        <main className="p-4 sm:p-6">
          <div className="bg-white rounded shadow p-4">
            <AppointmentTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <AppointmentToolbar
              search={search}
              setSearch={setSearch}
              limit={limit}
              setLimit={setLimit}
               onAdd={() => setOpenAdd(true)}
            />

            <div className="mt-6">
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              )}

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  Error: {error}
                </div>
              )}

              {!loading && !error && (
                <AppointmentTable data={appointments} onUpdate={refetch} onDelete={refetch} />
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span>Records: {appointments.length} appointments</span>
              <span>Page 1 of 1</span>
            </div>
          </div>
        </main>
         
      </div>
        <AddAppointmentModal open={openAdd} onClose={() => setOpenAdd(false)} onSuccess={() => { setOpenAdd(false); refetch(); }} />
    </div>
  );
}
