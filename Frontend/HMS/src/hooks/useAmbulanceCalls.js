import { useMemo, useState } from "react";

export default function useAmbulanceCalls() {
  const [search, setSearch] = useState("");

  const data = [
    {
      billNo: "ACB495",
      caseId: 7576,
      patient: "Rubin Hermann",
      generatedBy: "Super Admin",
      vehicleNo: "MP20SW5674",
      model: "DF342",
      driver: "Arun",
      contact: "8907789657",
      address: "—",
      date: "12/08/2025 04:33 PM",
      amount: 150,
      discount: 0,
      tax: 22.5,
      net: 172.5,
      paid: 172.5,
      balance: 0,
    },
  ];

  const filtered = useMemo(() => {
    return data.filter(
      (d) =>
        d.patient.toLowerCase().includes(search.toLowerCase()) ||
        d.billNo.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  return { search, setSearch, data: filtered };
}
