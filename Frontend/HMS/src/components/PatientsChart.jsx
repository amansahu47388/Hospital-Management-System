import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

 function PatientsChart({ data }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-card h-64">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Patients</h3>
        <div className="text-sm text-muted">7 days</div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="patients" stroke="#6B5DD3" strokeWidth={3} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export default PatientsChart;