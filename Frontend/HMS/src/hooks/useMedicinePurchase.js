import { useMemo, useState } from "react";

export default function useMedicinePurchase() {
  const [search, setSearch] = useState("");

  const [purchases] = useState([
    {
      id: "PCHN0188",
      date: "12/31/2025 04:36 PM",
      billNo: "",
      supplier: "SGS Pharmacy",
      total: 28000,
      discount: "0.00 (0.00%)",
      tax: "3360.00 (12.00%)",
      netAmount: 31360,
    },
    {
      id: "PCHN0187",
      date: "12/30/2025 06:02 PM",
      billNo: "9089067",
      supplier: "SGS Pharmacy",
      total: 32500,
      discount: "4875.00 (15.00%)",
      tax: "2762.50 (10.00%)",
      netAmount: 30387.5,
    },
    {
      id: "PCHN0186",
      date: "12/22/2025 03:30 PM",
      billNo: "5674",
      supplier: "Anant Pharmacy",
      total: 45100,
      discount: "9020.00 (20.00%)",
      tax: "3608.00 (10.00%)",
      netAmount: 39688,
    },
  ]);

  const filtered = useMemo(() => {
    if (!search.trim()) return purchases;

    return purchases.filter(
      (p) =>
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.supplier.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, purchases]);

  return {
    search,
    setSearch,
    purchases: filtered,
  };
}
