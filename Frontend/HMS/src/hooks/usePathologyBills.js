import { useMemo, useState } from "react";

const MOCK_BILLS = [
  {
    billNo: "PATHOB616",
    caseId: 7576,
    billDate: "12/12/2025 04:31 PM",
    patient: "Rubin Hermann",
    generatedBy: "Super Admin",
    doctor: "Sansa Gomez",
    amount: 156,
    discount: 0,
    tax: 28.08,
    netAmount: 184.08,
    paid: 100,
  },
  {
    billNo: "PATHOB615",
    caseId: 7519,
    billDate: "12/30/2025 04:45 PM",
    patient: "Olivier Thomas",
    generatedBy: "Belina Turner",
    doctor: "Sonia Bush",
    amount: 170,
    discount: 0,
    tax: 30.6,
    netAmount: 200.6,
    paid: 200.6,
  },
];

export default function usePathologyBills() {
  const [search, setSearch] = useState("");

  const bills = useMemo(() => {
    return MOCK_BILLS.map((b) => ({
      ...b,
      balance: +(b.netAmount - b.paid).toFixed(2),
    })).filter((b) =>
      b.patient.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return {
    bills,
    search,
    setSearch,
  };
}
