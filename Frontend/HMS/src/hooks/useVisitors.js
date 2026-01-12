import { useState } from "react";

export const useVisitors = () => {
  const [visitors] = useState([
    {
      id: 1,
      purpose: "Visit",
      name: "Nishant Kadakia",
      visitTo: "Staff",
      staff: "Harry Grant (9012)",
      phone: "9807898678",
      date: "01/30/2026",
      inTime: "01:31 PM",
      outTime: "02:31 PM",
    },
    {
      id: 2,
      purpose: "Seminar",
      name: "Georgia Paten",
      visitTo: "OPD Patient",
      staff: "Shakib Khanna (520)",
      phone: "8090796785",
      date: "01/25/2026",
      inTime: "01:00 PM",
      outTime: "02:00 PM",
    },
  ]);

  return { visitors };
};
