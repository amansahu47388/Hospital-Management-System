import { useState, useMemo, useEffect, useCallback } from "react";
import { getBirthRecords } from "../api/birthDeathApi";

export default function useBirthRecords() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getBirthRecords(search);
      setData(response.data || []);
    } catch (error) {
      console.error("Failed to load birth records:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [data, search]);

  return {
    search,
    setSearch,
    data: filteredData,
    loading,
    refresh: loadRecords,
  };
}
