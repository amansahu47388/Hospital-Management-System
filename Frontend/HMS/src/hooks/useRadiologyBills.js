import { useMemo, useState } from "react";

export default function useRadiologyBills() {
  const [search, setSearch] = useState("");

  const bills = [
    {
      billNo: "RADIOB551",
      caseId: 7576,
      date: "12/11/2025 04:32 PM",
      patient: "Rubin Hermann",
      generatedBy: "Super Admin",
      doctor: "Sansa Gomez",
      report: "NA",
      amount: 165,
      discount: 0,
      tax: 33,
      net: 198,
      paid: 198,
      balance: 0,
    },
    {
      billNo: "RADIOB550",
      caseId: 7575,
      date: "12/30/2025 12:30 PM",
      patient: "Gaurav Shrivastava",
      generatedBy: "John Hook",
      doctor: "Amit Singh",
      report: "NA",
      amount: 165,
      discount: 0,
      tax: 33,
      net: 198,
      paid: 198,
      balance: 0,
    },
    {
      billNo: "RADIOB549",
      caseId: 7549,
      date: "12/25/2025 04:20 PM",
      patient: "Katie Strutt",
      generatedBy: "John Hook",
      doctor: "Sonia Bush",
      report: "NA",
      amount: 330,
      discount: 33,
      tax: 59.4,
      net: 356.4,
      paid: 300,
      balance: 56.4,
    },
  ];

  const filteredBills = useMemo(() => {
    return bills.filter(
      (b) =>
        b.billNo.toLowerCase().includes(search.toLowerCase()) ||
        b.patient.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, bills]);

  return {
    search,
    setSearch,
    bills: filteredBills,
  };
}
