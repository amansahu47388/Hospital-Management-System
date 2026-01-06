import { useState } from "react";

const mockData = [
  {
    id: 1,
    refNo: "DREF70",
    caseId: 7447,
    generatedBy: "Super Admin (9001)",
    patient: "Alfred (987)",
    guardian: "David",
    gender: "Male",
    date: "12/22/2025 01:53 PM",
    report: "-",
  },
  {
    id: 2,
    refNo: "DREF68",
    caseId: 6604,
    generatedBy: "Super Admin (9001)",
    patient: "Georgia Paten (1103)",
    guardian: "William Paten",
    gender: "Female",
    date: "11/22/2025 05:31 PM",
    report: "Natural",
  },
];

export default function useDeathRecords() {
  const [records, setRecords] = useState(mockData);
  const [search, setSearch] = useState("");

  const filtered = records.filter((r) =>
    r.patient.toLowerCase().includes(search.toLowerCase())
  );

  const deleteRecord = (id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return {
    records: filtered,
    search,
    setSearch,
    deleteRecord,
  };
}
