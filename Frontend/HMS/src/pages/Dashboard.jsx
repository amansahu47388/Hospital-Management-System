import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import PatientsChart from "../components/PatientsChart";
import SimpleTable from "../components/SimpleTable";
import AppointmentList from "../components/AppointmentList";
import { useFetchData } from "../hooks/useFetchData";

 function DashboardPage() {
  const { loading, data } = useFetchData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const { stats, chart, doctors, stock, appointments } = data;

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <main className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {stats.map((s) => (
              <StatsCard key={s.id} title={s.title} value={s.value} />
            ))}
          </div>

          {/* Chart + Appointments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <PatientsChart data={chart} />
            </div>
            <div>
              <AppointmentList items={appointments} />
            </div>
          </div>

          {/* Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SimpleTable
              columns={[
                { key: "id", label: "ID" },
                { key: "name", label: "Name" },
                { key: "mobile", label: "Mobile" },
                { key: "address", label: "Address" },
                { key: "fee", label: "Consultancy Charge", render: (r) => r.fee },
                { key: "education", label: "Education" },
                { key: "dob", label: "DOB" },
                { key: "status", label: "Status", render: (r) => <span className={`text-xs px-2 py-1 rounded ${r.status === "online" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{r.status}</span> },
              ]}
              rows={doctors}
            />

            <SimpleTable
              columns={[
                { key: "id", label: "ID" },
                { key: "drug", label: "Drug Name" },
                { key: "expire", label: "Expire Date" },
                { key: "mfr", label: "Manufacture Date" },
                { key: "price", label: "Price" },
                { key: "qty", label: "QTY" },
              ]}
              rows={stock}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
export default DashboardPage;