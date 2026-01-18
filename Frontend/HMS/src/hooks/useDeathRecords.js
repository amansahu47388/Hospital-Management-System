import { useState, useEffect, useCallback } from "react";
import { getDeathRecords, deleteDeathRecord as deleteRecordApi } from "../api/birthDeathApi";

export default function useDeathRecords() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDeathRecords(search);
      setRecords(response.data || []);
    } catch (error) {
      console.error("Failed to load death records:", error);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const deleteRecord = async (id) => {
    try {
      await deleteRecordApi(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Failed to delete death record:", error);
      throw error;
    }
  };

  const filtered = records.filter((r) =>
    (r.patientName || r.patient || "").toLowerCase().includes(search.toLowerCase())
  );

  return {
    records: filtered,
    search,
    setSearch,
    deleteRecord,
    loading,
    refresh: loadRecords,
  };
}
