import { useMemo, useState } from "react";

export default function useRadiologyTests() {
  const [search, setSearch] = useState("");

  const tests = [
    {
      id: 1,
      name: "MRI",
      shortName: "MRI",
      type: "MRI",
      category: "CT CHEST PLAIN",
      subCategory: "-",
      reportDays: 0,
      tax: 15,
      charge: 500,
      amount: 575,
    },
    {
      id: 2,
      name: "Resting 12-lead EKG",
      shortName: "Resting 12-lead EKG",
      type: "Resting 12-lead EKG",
      category: "X-RAY CHEST PA VIEW",
      subCategory: "Resting 12-lead EKG",
      reportDays: 2,
      tax: 15,
      charge: 500,
      amount: 575,
    },
  ];

  const filtered = useMemo(() => {
    return tests.filter(
      (t) =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.shortName.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, tests]);

  return {
    search,
    setSearch,
    tests: filtered,
  };
}
