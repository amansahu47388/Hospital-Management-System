import { useState } from "react";

export default function usePharmacyBill() {
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);

  const bills = [
    {
      billNo: "PHARMAB532",
      caseId: "7576",
      date: "12/12/2025 04:31 PM",
      patient: "Rubin Hermann (1163)",
      generatedBy: "Super Admin (9001)",
      doctor: "Sansa Gomez (9008)",
      amount: 518.25,
      discount: "25.91 (5.00%)",
      tax: "58.46 (11.87%)",
      net: 550.8,
      paid: 420,
      refund: 0,
      balance: 130.8
    },
    {
      billNo: "PHARMAB531",
      caseId: "7519",
      date: "12/30/2025 05:22 PM",
      patient: "Hayley Matthews (1121)",
      generatedBy: "Harry Grant (9012)",
      doctor: "Sansa Gomez (9008)",
      amount: 247.5,
      discount: "24.75 (10.00%)",
      tax: "16.81 (7.55%)",
      net: 239.56,
      paid: 440.84,
      refund: 201.28,
      balance: 0
    }
  ];

  const filteredBills = bills.filter(
    (b) =>
      b.billNo.toLowerCase().includes(search.toLowerCase()) ||
      b.patient.toLowerCase().includes(search.toLowerCase())
  );

  return {
    bills: filteredBills,
    search,
    setSearch,
    limit,
    setLimit
  };
}
