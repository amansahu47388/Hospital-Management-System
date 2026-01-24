import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";

import AppointmentTabs from "../../components/AppointmentComponent/AppointmentTabs";
import AppointmentToolbar from "../../components/AppointmentComponent/AppointmentToolbar";
import AppointmentTable from "../../components/AppointmentComponent/AppointmentTable";
import AddAppointmentModal from "../../components/AppointmentComponent/Addappointment";

import { useAppointments } from "../../hooks/useAppointments";

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
    <AdminLayout>
      <main className="p-4 sm:p-6">
        <div className="bg-white rounded shadow p-4">
          {/* Tabs */}
          <AppointmentTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {/* Toolbar */}
          <AppointmentToolbar
            search={search}
            setSearch={setSearch}
            limit={limit}
            setLimit={setLimit}
            onAdd={() => setOpenAdd(true)}
          />

          {/* Table Section */}
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
              <AppointmentTable
                data={appointments}
                onUpdate={refetch}
                onDelete={refetch}
              />
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between text-xs text-gray-500 mt-4">
            <span>Records: {appointments.length} appointments</span>
            <span>Page 1 of 1</span>
          </div>
        </div>
      </main>

      {/* Add Appointment Modal */}
      <AddAppointmentModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={() => {
          setOpenAdd(false);
          refetch();
        }}
      />
    </AdminLayout>
  );
}
