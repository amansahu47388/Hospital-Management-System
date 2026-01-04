import { useState, useMemo } from "react";

const mockData = [
  {
    refNo: "BREF86",
    caseId: 7543,
    generatedBy: "Super Admin (9001)",
    childName: "Jason",
    gender: "Male",
    birthDate: "12/24/2025 05:26 PM",
    mother: "Sofie Berg (1142)",
    father: "Albert",
  },
  {
    refNo: "BREF84",
    caseId: 6721,
    generatedBy: "Super Admin (9001)",
    childName: "Jason",
    gender: "Male",
    birthDate: "10/20/2025 03:04 PM",
    mother: "Hayley Matthews (1121)",
    father: "Oliver",
  },
];

export default function useBirthRecords() {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    return mockData.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  return {
    search,
    setSearch,
    data: filteredData,
  };
}
