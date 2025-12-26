import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function usePathologyBill() {
  const navigate = useNavigate();

  const [applyTPA, setApplyTPA] = useState(false);
  const [tests, setTests] = useState([
    { id: Date.now(), name: "", days: "", date: "", tax: 0, amount: 0 }
  ]);

  const [discount, setDiscount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState("");

  // ---------------- CALCULATIONS ----------------
  const total = useMemo(
    () => tests.reduce((sum, t) => sum + Number(t.amount || 0), 0),
    [tests]
  );

  const taxAmount = useMemo(
    () =>
      tests.reduce(
        (sum, t) => sum + (Number(t.amount || 0) * Number(t.tax || 0)) / 100,
        0
      ),
    [tests]
  );

  const discountValue = useMemo(() => {
    if (discountPercent)
      return (total * discountPercent) / 100;
    return Number(discount || 0);
  }, [discount, discountPercent, total]);

  const netAmount = useMemo(
    () => total - discountValue + taxAmount,
    [total, discountValue, taxAmount]
  );

  // ---------------- HANDLERS ----------------
  const addRow = () =>
    setTests([
      ...tests,
      { id: Date.now(), name: "", days: "", date: "", tax: 0, amount: 0 }
    ]);

  const removeRow = (id) =>
    setTests(tests.filter((row) => row.id !== id));

  const updateRow = (id, field, value) => {
    setTests((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  const closePage = () => navigate(-1);

  return {
    tests,
    addRow,
    removeRow,
    updateRow,
    applyTPA,
    setApplyTPA,
    total,
    taxAmount,
    discount,
    setDiscount,
    discountPercent,
    setDiscountPercent,
    netAmount,
    paymentMode,
    setPaymentMode,
    paidAmount,
    setPaidAmount,
    closePage
  };
}
