import { useMemo, useState } from "react";

const mockData = [
  {
    name: "Jamie Overton",
    patientId: 1146,
    caseId: 7085,
    gender: "Male",
    phone: "9807897895",
    generatedBy: "Super Admin (9001)",
    doctor: "Reyan Jain (9011)",
    admissionDate: "04/12/2025 03:41 PM",
    dischargeDate: "12/25/2025 04:50 PM",
    tax: 0,
    net: 0,
    total: 0,
  },
  {
    name: "Marcus Jacobsen",
    patientId: 1141,
    caseId: 6914,
    gender: "Male",
    phone: "089978968",
    generatedBy: "Super Admin (9001)",
    doctor: "Reyan Jain (9011)",
    admissionDate: "01/12/2025 11:15 AM",
    dischargeDate: "06/20/2025 10:04 AM",
    tax: 0,
    net: 0,
    total: 0,
  },
];

export default function useIpdDischarged() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    return mockData.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return {
    search,
    setSearch,
    page,
    setPage,
    totalPages: Math.ceil(filtered.length / pageSize),
    data: paginated,
  };
}
