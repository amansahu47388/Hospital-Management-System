import { useState, useMemo } from "react";

export default function usePharmacyBill() {
  const [rows, setRows] = useState([
    {
      id: Date.now(),
      category: "",
      medicine: "",
      batch: "",
      expiry: "",
      qty: "",
      price: "",
      tax: "",
      discount: "",
      amount: 0
    }
  ]);

  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState("");

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: Date.now(),
        category: "",
        medicine: "",
        batch: "",
        expiry: "",
        qty: "",
        price: "",
        tax: "",
        discount: "",
        amount: 0
      }
    ]);
  };

  const removeRow = (id) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;

        const updated = { ...r, [field]: value };

        const qty = Number(updated.qty || 0);
        const price = Number(updated.price || 0);
        const tax = Number(updated.tax || 0);
        const discount = Number(updated.discount || 0);

        const base = qty * price;
        const taxAmt = (base * tax) / 100;
        const discAmt = (base * discount) / 100;

        updated.amount = (base + taxAmt - discAmt).toFixed(2);

        return updated;
      })
    );
  };

  const total = useMemo(
    () => rows.reduce((s, r) => s + Number(r.amount || 0), 0),
    [rows]
  );

  return {
    rows,
    addRow,
    removeRow,
    updateRow,
    total,
    paymentMode,
    setPaymentMode,
    paymentAmount,
    setPaymentAmount
  };
}
