import React from "react";

 function StatsCard({ title, value }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-card w-full">
      <div className="text-sm text-muted">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
    </div>
  );
}
export default StatsCard;