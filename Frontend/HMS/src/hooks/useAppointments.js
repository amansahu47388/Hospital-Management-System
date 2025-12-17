import { useState } from "react";

export function useAppointments() {
  const [activeTab, setActiveTab] = useState("today");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);

  // API will come later
  const appointments = [];

  return {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    limit,
    setLimit,
    appointments,
  };
}
