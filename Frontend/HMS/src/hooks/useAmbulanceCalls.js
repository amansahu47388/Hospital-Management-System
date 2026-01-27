import { useMemo, useState, useEffect, useCallback } from "react";
import { getAmbulanceBills } from "../api/ambulanceApi";

export default function useAmbulanceCalls() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBills = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAmbulanceBills(search);
      const bills = response.data || [];

      // Transform API data to match table structure
      const transformedData = bills.map((bill) => {
        // Format date - handle both date string and datetime
        let formattedDate = "-";
        if (bill.date) {
          const date = new Date(bill.date);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
          }
        } else if (bill.created_at) {
          const date = new Date(bill.created_at);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toLocaleString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });
          }
        }

        return {
          id: bill.id,
          billNo: bill.bill_no || `AMB-${bill.id}`,
          caseId: bill.case_id || "-",
          patient: bill.patient_name || "N/A",
          generatedBy: bill.created_by_name || "N/A",
          vehicleNo: bill.ambulance_number || "-",
          model: bill.ambulance_model || "-",
          driver: bill.driver_name || "-",
          contact: bill.driver_contact || "-",
          address: bill.patient_address || "-",
          date: formattedDate,
          amount: parseFloat(bill.total_amount) || 0,
          discount: parseFloat(bill.discount) || 0,
          tax: parseFloat(bill.tax) || 0,
          net: parseFloat(bill.net_amount) || 0,
          paid: parseFloat(bill.paid_amount) || 0,
          balance: parseFloat(bill.balance) || 0,
        };
      });

      setData(transformedData);
    } catch (error) {
      console.error("Failed to load ambulance bills:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  const filtered = useMemo(() => {
    return data.filter(
      (d) =>
        d.patient.toLowerCase().includes(search.toLowerCase()) ||
        d.billNo.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  return { search, setSearch, data: filtered, loading, refresh: loadBills };
}
