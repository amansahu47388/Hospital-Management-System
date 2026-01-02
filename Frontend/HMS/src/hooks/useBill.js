import { useState, useMemo } from "react";

export default function useBill(type = "pathology") {
  // -----------------------------
  // ROW DATA
  // -----------------------------
  
  const [tests, setTests] = useState([
    {
      id: Date.now(),
      name: "",
      reportDays: "",
      reportDate: "",
      tax: 0,
      amount: 0,
    },
  ]);

  // -----------------------------
  // TPA / PAYMENT STATES
  // -----------------------------
  const [applyTPA, setApplyTPA] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);

  const [paymentMode, setPaymentMode] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  // -----------------------------
  // ROW HANDLERS
  // -----------------------------
  const addRow = () => {
    setTests((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        reportDays: "",
        reportDate: "",
        tax: 0,
        amount: 0,
      },
    ]);
  };

  const removeRow = (id) => {
    setTests((prev) => prev.filter((row) => row.id !== id));
  };

  const updateRow = (id, field, value) => {
    setTests((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  // -----------------------------
  // CALCULATIONS
  // -----------------------------
  const total = useMemo(() => {
    return tests.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0
    );
  }, [tests]);

  const calculatedDiscount = useMemo(() => {
    if (discountPercent > 0) {
      return (total * discountPercent) / 100;
    }
    return Number(discount || 0);
  }, [discount, discountPercent, total]);

  const taxAmount = useMemo(() => {
    return tests.reduce(
      (sum, row) => sum + Number(row.tax || 0),
      0
    );
  }, [tests]);

  const netAmount = useMemo(() => {
    return total - calculatedDiscount + taxAmount;
  }, [total, calculatedDiscount, taxAmount]);

  // -----------------------------
  // CLOSE / RESET PAGE
  // -----------------------------
  const closePage = () => {
    // reset everything (optional)
    setTests([
      {
        id: Date.now(),
        name: "",
        reportDays: "",
        reportDate: "",
        tax: 0,
        amount: 0,
      },
    ]);
    setDiscount(0);
    setDiscountPercent(0);
    setPaidAmount("");
    setPaymentMode("");
    setApplyTPA(false);
  };

  return {
    // rows
    tests,
    addRow,
    removeRow,
    updateRow,

    // tpa
    applyTPA,
    setApplyTPA,

    // totals
    total,
    discount,
    setDiscount,
    discountPercent,
    setDiscountPercent,
    taxAmount,
    netAmount,

    // payment
    paymentMode,
    setPaymentMode,
    paidAmount,
    setPaidAmount,

    // actions
    closePage,
  };
}
