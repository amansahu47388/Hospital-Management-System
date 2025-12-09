import React from "react";

function StatusBadge({ status }) {
  const cls = {
    pending: "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  }[status] || "bg-gray-100 text-gray-700";

  return <span className={`px-3 py-1 rounded-full text-xs ${cls}`}>{status}</span>;
}

export default function AppointmentList({ items }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Appointments</h3>
      </div>

      <div className="space-y-3">
        {items.map((a) => (
          <div key={a.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{a.name}</div>
              <div className="text-xs text-muted">{a.date}</div>
            </div>
            <StatusBadge status={a.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
