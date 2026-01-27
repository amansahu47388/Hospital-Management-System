import { X, Plus, Trash2, Search } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNotify } from "../../context/NotificationContext";
import {
  getMedicineCategories,
  getBillingMedicines,
  getBillingBatches,
  generatePharmacyBill,
} from "../../api/pharmacyApi";
import { getPatientList, getMedicalCases, searchPatient } from "../../api/patientApi";
import { getDoctors } from "../../api/appointmentApi";

/* ================= ROW STRUCTURE ================= */
const emptyRow = {
  medicine_category_id: "",
  medicine_id: "",
  stock_id: "", // MedicineStock.id for tracking selected batch
  batch_id: "", // MedicineBatch.id for API
  batch_no: "",
  expiry_date: "",
  available_qty: 0,
  quantity: 1,
  sale_price: 0,
  tax_percentage: 0,
  discount_percentage: 0,
  amount: "0.00",
  batches: [],
};

export default function GeneratePharmacyBill({ open, onClose, onSuccess }) {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState([{ ...emptyRow }]);
  const [patientSearch, setPatientSearch] = useState("");
  const [patientList, setPatientList] = useState([]);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [isSelectingPatient, setIsSelectingPatient] = useState(false);
  const dropdownRef = useRef(null);

  const [doctors, setDoctors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [billingMedicines, setBillingMedicines] = useState([]);

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [cases, setCases] = useState([]);
  const [caseId, setCaseId] = useState("");
  const [note, setNote] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState("");

  /* ================= LOAD DROPDOWNS ================= */
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const [catRes, medsRes, docsRes] = await Promise.all([
          getMedicineCategories(),
          getBillingMedicines(),
          getDoctors(),
        ]);
        setCategories(catRes.data || []);
        setBillingMedicines(medsRes.data || []);
        setDoctors(docsRes.data || []);
      } catch (err) {
        console.error("Error loading billing data:", err);
        notify("error", "Failed to load billing data");
      }
    })();
  }, [open, notify]);

  /* ================= PATIENT SEARCH EFFECT ================= */
  useEffect(() => {
    if (!patientSearch || isSelectingPatient) return;

    const timer = setTimeout(async () => {
      try {
        const res = await searchPatient(patientSearch);
        setPatientList(res.data || []);
        setShowPatientDropdown(true);
      } catch {
        setPatientList([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [patientSearch, isSelectingPatient]);

  const handlePatientSelect = (p) => {
    setIsSelectingPatient(true);
    setPatientId(p.id);
    setPatientSearch(`${p.first_name} ${p.last_name}`);
    setShowPatientDropdown(false);
    setTimeout(() => setIsSelectingPatient(false), 0);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowPatientDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setRows([{ ...emptyRow }]);
      setPatientId("");
      setPatientSearch("");
      setPatientList([]);
      setShowPatientDropdown(false);
      setDoctorId("");
      setCases([]);
      setCaseId("");
      setNote("");
      setPaymentMode("Cash");
      setPaymentAmount("");
    }
  }, [open]);

  useEffect(() => {
    if (patientId) {
      (async () => {
        try {
          const res = await getMedicalCases(patientId);
          setCases(res.data || []);
          setCaseId("");
        } catch (err) {
          console.error("Error fetching cases:", err);
        }
      })();
    } else {
      setCases([]);
      setCaseId("");
    }
  }, [patientId]);

  const addRow = () => setRows((p) => [...p, { ...emptyRow }]);

  const removeRow = (i) => {
    if (rows.length === 1) {
      notify("error", "At least one medicine row is required");
      return;
    }
    setRows((p) => p.filter((_, idx) => idx !== i));
  };

  /* ================= CASCADE DROPDOWNS ================= */
  const handleCategoryChange = (i, categoryId) => {
    const updated = [...rows];
    updated[i] = { ...emptyRow, medicine_category_id: categoryId };
    setRows(updated);
  };

  const handleMedicineChange = async (i, medicineId) => {
    if (!medicineId) {
      const updated = [...rows];
      updated[i] = { ...emptyRow, medicine_category_id: updated[i].medicine_category_id };
      setRows(updated);
      return;
    }

    try {
      setLoading(true);
      const res = await getBillingBatches(medicineId);
      const updated = [...rows];
      updated[i].medicine_id = medicineId;
      updated[i].batches = res.data || [];
      updated[i].stock_id = "";
      updated[i].batch_id = "";
      updated[i].batch_no = "";
      updated[i].expiry_date = "";
      updated[i].available_qty = 0;
      updated[i].sale_price = 0;
      updated[i].tax_percentage = 0;
      updated[i].quantity = 1;
      updated[i].discount_percentage = 0;
      updated[i].amount = "0.00";
      setRows(updated);
    } catch (err) {
      console.error("Error loading batches:", err);
      notify("error", "Failed to load batches");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchChange = (i, stockId) => {
    if (!stockId) {
      const updated = [...rows];
      updated[i].stock_id = "";
      updated[i].batch_id = "";
      updated[i].batch_no = "";
      updated[i].expiry_date = "";
      updated[i].available_qty = 0;
      updated[i].sale_price = 0;
      updated[i].tax_percentage = 0;
      updated[i].quantity = 1;
      updated[i].discount_percentage = 0;
      updated[i].amount = "0.00";
      setRows(updated);
      return;
    }

    const updated = [...rows];
    const batchData = updated[i].batches.find((b) => String(b.id) === String(stockId));

    if (!batchData) {
      notify("error", "Batch not found");
      return;
    }

    // Format expiry date for month input (YYYY-MM)
    const expiryDate = batchData.expiry
      ? new Date(batchData.expiry).toISOString().slice(0, 7)
      : "";

    updated[i].stock_id = stockId; // MedicineStock.id for tracking
    updated[i].batch_id = batchData.batch_id; // MedicineBatch.id for API
    updated[i].batch_no = batchData.batch_no;
    updated[i].expiry_date = expiryDate;
    updated[i].available_qty = batchData.available_qty || 0;
    updated[i].sale_price = Number(batchData.sale_price) || 0;
    updated[i].tax_percentage = Number(batchData.tax_percentage) || 0;
    updated[i].quantity = 1;
    updated[i].discount_percentage = 0;

    // Calculate initial amount
    const qty = updated[i].quantity;
    const price = updated[i].sale_price;
    const tax = updated[i].tax_percentage;
    const discount = updated[i].discount_percentage;

    const base = qty * price;
    const taxAmt = (base * tax) / 100;
    const discountAmt = (base * discount) / 100;
    updated[i].amount = (base + taxAmt - discountAmt).toFixed(2);

    setRows(updated);
  };

  /* ================= CALCULATION ================= */
  const updateRow = (i, field, value) => {
    const updated = [...rows];

    // Validate quantity doesn't exceed available
    if (field === "quantity") {
      const qty = Number(value) || 0;
      if (qty > updated[i].available_qty) {
        notify("error", `Quantity cannot exceed available quantity (${updated[i].available_qty})`);
        return;
      }
      if (qty < 0) {
        notify("error", "Quantity cannot be negative");
        return;
      }
    }

    // Update the field value
    updated[i][field] = value;

    // Recalculate amount
    const qty = Number(updated[i].quantity || 0);
    const price = Number(updated[i].sale_price || 0);
    const tax = Number(updated[i].tax_percentage || 0);
    const discount = Number(updated[i].discount_percentage || 0);

    const base = qty * price;
    const taxAmt = (base * tax) / 100;
    const discountAmt = (base * discount) / 100;
    updated[i].amount = (base + taxAmt - discountAmt).toFixed(2);

    setRows(updated);
  };

  // Calculate totals from rows
  const calculateRowAmounts = (row) => {
    const qty = Number(row.quantity || 0);
    const price = Number(row.sale_price || 0);
    const tax = Number(row.tax_percentage || 0);
    const discount = Number(row.discount_percentage || 0);

    const base = qty * price;
    const taxAmt = (base * tax) / 100;
    const discountAmt = (base * discount) / 100;
    const amount = base + taxAmt - discountAmt;

    return { base, taxAmt, discountAmt, amount };
  };

  // Calculate totals
  const totals = rows.reduce(
    (acc, row) => {
      const amounts = calculateRowAmounts(row);
      return {
        base: acc.base + amounts.base,
        tax: acc.tax + amounts.taxAmt,
        discount: acc.discount + amounts.discountAmt,
        total: acc.total + amounts.amount,
      };
    },
    { base: 0, tax: 0, discount: 0, total: 0 }
  );

  const baseTotal = totals.base;
  const taxAmount = totals.tax;
  const discountAmount = totals.discount;
  const totalAmount = totals.total;

  const paid = Number(paymentAmount || 0);
  const balance = Math.max(totalAmount - paid, 0);

  /* ================= SAVE ================= */
  const handleSave = async () => {
    // Validation
    if (!patientId) {
      notify("error", "Please select a patient");
      return;
    }

    // Filter valid rows (must have medicine, batch, and quantity > 0)
    const validRows = rows.filter(
      (r) =>
        r.medicine_id &&
        r.batch_id &&
        r.stock_id &&
        Number(r.quantity) > 0 &&
        Number(r.amount) > 0
    );

    if (validRows.length === 0) {
      notify("error", "Please add at least one medicine with valid details");
      return;
    }

    // Validate quantities don't exceed available stock
    for (const row of validRows) {
      if (Number(row.quantity) > Number(row.available_qty)) {
        notify("error", `Quantity for ${row.batch_no} exceeds available stock`);
        return;
      }
    }

    try {
      setLoading(true);

      // Calculate totals from valid rows (using same logic as displayed totals)
      const calculatedTotals = validRows.reduce(
        (acc, row) => {
          const amounts = calculateRowAmounts(row);
          return {
            base: acc.base + amounts.base,
            tax: acc.tax + amounts.taxAmt,
            discount: acc.discount + amounts.discountAmt,
            total: acc.total + amounts.amount,
          };
        },
        { base: 0, tax: 0, discount: 0, total: 0 }
      );

      const calculatedBaseTotal = calculatedTotals.base;
      const calculatedTaxAmount = calculatedTotals.tax;
      const calculatedDiscountAmount = calculatedTotals.discount;
      const calculatedNetAmount = calculatedTotals.total;

      const payload = {
        patient: patientId,
        doctor: doctorId || null,
        case: caseId || null,
        payment_mode: paymentMode,
        note: note || "",
        total_amount: calculatedBaseTotal.toFixed(2),
        discount_amount: calculatedDiscountAmount.toFixed(2),
        tax_amount: calculatedTaxAmount.toFixed(2),
        net_amount: calculatedNetAmount.toFixed(2),
        paid_amount: paid.toFixed(2),
        refund_amount: "0.00",
        balance_amount: balance.toFixed(2),
        items: validRows.map((r) => ({
          medicine: r.medicine_id,
          batch: r.batch_id, // MedicineBatch.id
          quantity: Number(r.quantity),
          sale_price: Number(r.sale_price).toFixed(2),
          tax_percentage: Number(r.tax_percentage).toFixed(2),
          discount_percentage: Number(r.discount_percentage).toFixed(2),
          amount: Number(r.amount).toFixed(2),
        })),
      };

      await generatePharmacyBill(payload);
      notify("success", "Pharmacy Bill Generated Successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Error generating bill:", err);
      const errorMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        err?.response?.data?.items?.[0] ||
        err?.message ||
        "Failed to generate bill";
      notify("error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-[999] bg-black/40 p-2 sm:p-4 md:p-0">
      <div className="w-full h-full bg-white flex flex-col overflow-hidden rounded-lg md:rounded-none">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 px-3 sm:px-4 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <div className="relative w-full sm:w-80" ref={dropdownRef}>
            <div className="flex items-center bg-white rounded px-3 py-1 text-black">
              <Search size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search Patient..."
                className="w-full text-sm sm:text-base outline-none"
                value={patientSearch}
                onChange={(e) => {
                  setPatientSearch(e.target.value);
                  setShowPatientDropdown(true);
                }}
              />
            </div>

            {showPatientDropdown && patientList.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border shadow-lg z-50 text-black max-h-60 overflow-y-auto rounded-b text-sm">
                {patientList.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handlePatientSelect(p)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                  >
                    <span>{p.first_name} {p.last_name}</span>
                    <span className="text-gray-400">#{p.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => !loading && onClose()}
            className="self-end sm:self-auto"
            disabled={loading}
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-4 py-2 border-b flex gap-4 bg-gray-50 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Case ID</label>
            <select
              className="border px-3 py-1 rounded text-sm min-w-[150px]"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              disabled={!patientId}
            >
              <option value="">Select Case</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>{c.case_id}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="flex-1 overflow-auto px-2 py-3">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-1 sm:px-2 py-1 text-left whitespace-nowrap text-xs sm:text-sm">
                    Medicine Category
                  </th>
                  <th className="px-1 sm:px-2 py-1 text-left whitespace-nowrap text-xs sm:text-sm">
                    Medicine Name
                  </th>
                  <th className="px-1 sm:px-2 py-1 text-left whitespace-nowrap text-xs sm:text-sm">
                    Batch No
                  </th>
                  <th className="px-1 sm:px-2 py-1 text-left whitespace-nowrap text-xs sm:text-sm">
                    Expiry Date
                  </th>
                  <th className="px-1 sm:px-2 py-1 text-left whitespace-nowrap text-xs sm:text-sm">
                    Quantity
                  </th>
                  <th className="px-1 sm:px-2 py-1 text-left whitespace-nowrap text-xs sm:text-sm">
                    Available Qty
                  </th>
                  <th className="px-1 sm:px-2 py-1 text-left whitespace-nowrap text-xs sm:text-sm">
                    Sale Price
                  </th>
                  <th className="px-1 sm:px-2 py-1 text-left whitespace-nowrap text-xs sm:text-sm">
                    Tax (%)
                  </th>
                  <th className="px-1 sm:px-2 py-1 text-left whitespace-nowrap text-xs sm:text-sm">
                    Discount (%)
                  </th>
                  <th className="px-1 sm:px-2 py-1 text-left whitespace-nowrap text-xs sm:text-sm">
                    Amount
                  </th>
                  <th className="px-1 sm:px-2 py-1 text-center">
                    <Plus
                      onClick={addRow}
                      className="cursor-pointer text-purple-600 hover:text-purple-800"
                      size={16}
                    />
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td className="p-1">
                      <select
                        className="border w-full px-1 py-1 text-xs sm:text-sm rounded"
                        value={row.medicine_category_id}
                        onChange={(e) => handleCategoryChange(i, e.target.value)}
                      >
                        <option value="">Select</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.category_name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-1">
                      <select
                        className="border w-full px-1 py-1 text-xs sm:text-sm rounded"
                        value={row.medicine_id}
                        onChange={(e) => handleMedicineChange(i, e.target.value)}
                        disabled={!row.medicine_category_id}
                      >
                        <option value="">Select</option>
                        {billingMedicines
                          .filter(
                            (m) =>
                              String(m.category_id) === String(row.medicine_category_id)
                          )
                          .map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                      </select>
                    </td>

                    <td className="p-1">
                      <select
                        className="border w-full px-1 py-1 text-xs sm:text-sm rounded"
                        value={row.stock_id || ""}
                        onChange={(e) => handleBatchChange(i, e.target.value)}
                        disabled={!row.medicine_id || row.batches.length === 0}
                      >
                        <option value="">Select</option>
                        {row.batches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.batch_no} ({b.available_qty} available)
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-1">
                      <input
                        type="month"
                        className="border w-full px-1 py-1 text-xs sm:text-sm rounded"
                        value={row.expiry_date}
                        readOnly
                      />
                    </td>

                    <td className="p-1">
                      <input
                        type="number"
                        min="1"
                        max={row.available_qty}
                        className="border w-full px-1 py-1 text-xs sm:text-sm rounded"
                        value={row.quantity}
                        onChange={(e) => updateRow(i, "quantity", e.target.value)}
                        disabled={!row.stock_id}
                      />
                    </td>

                    <td className="p-1">
                      <input
                        type="number"
                        className="border w-full px-1 py-1 text-xs sm:text-sm rounded bg-gray-50"
                        value={row.available_qty}
                        readOnly
                      />
                    </td>

                    <td className="p-1">
                      <input
                        type="number"
                        step="0.01"
                        className="border w-full px-1 py-1 text-xs sm:text-sm rounded bg-gray-50"
                        value={row.sale_price}
                        readOnly
                      />
                    </td>

                    <td className="p-1">
                      <input
                        type="number"
                        step="0.01"
                        className="border w-full px-1 py-1 text-xs sm:text-sm rounded bg-gray-50"
                        value={row.tax_percentage}
                        readOnly
                      />
                    </td>

                    <td className="p-1">
                      <input
                        type="text"
                        className="border w-full px-1 py-1 text-xs sm:text-sm rounded"
                        value={row.discount_percentage}
                        onChange={(e) => updateRow(i, "discount_percentage", e.target.value)}
                        disabled={!row.stock_id}
                      />
                    </td>

                    <td className="p-1">
                      <input
                        type="number"
                        step="0.01"
                        className="border w-full px-1 py-1 text-xs sm:text-sm rounded bg-gray-50 font-semibold"
                        value={row.amount}
                        readOnly
                      />
                    </td>

                    <td className="p-1 text-center">
                      <Trash2
                        size={16}
                        className="text-red-500 cursor-pointer mx-auto hover:text-red-700"
                        onClick={() => removeRow(i)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= BOTTOM SECTION ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 px-2">
            {/* LEFT */}
            <div>
              <label className="font-medium block mb-1 text-sm sm:text-base">
                Hospital Doctor (Optional)
              </label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="border w-full p-2 rounded text-sm sm:text-base"
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.full_name || d.username || `Doctor #${d.id}`}
                  </option>
                ))}
              </select>

              <label className="font-medium block mb-1 text-sm sm:text-base pt-4">
                Note
              </label>
              <textarea
                className="border w-full p-2 h-24 rounded text-sm sm:text-base"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Additional notes..."
              />
            </div>

            {/* RIGHT */}
            <div className="space-y-3 text-xs sm:text-sm">
              <InputRow label="Subtotal ($)" value={baseTotal.toFixed(2)} readOnly />
              <InputRow
                label="Discount Amount ($)"
                value={discountAmount.toFixed(2)}
                readOnly
              />
              <InputRow label="Tax Amount ($)" value={taxAmount.toFixed(2)} readOnly />
              <InputRow
                label="Net Amount ($)"
                value={totalAmount.toFixed(2)}
                readOnly
                bold
              />
              <InputRow
                label="Payment Amount ($)"
                value={paymentAmount}
                onChange={setPaymentAmount}
              />

              <div>
                <label className="block font-medium pb-1 text-sm sm:text-base">
                  Payment Mode
                </label>
                <select
                  className="border w-full px-2 py-1 rounded text-sm sm:text-base"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Online">Online</option>
                  <option value="Transfer To Bank Account">
                    Transfer To Bank Account
                  </option>
                </select>
              </div>

              {balance > 0 && (
                <div className="text-red-600 font-semibold text-sm">
                  Balance: ${balance.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-3 sm:px-4 py-3 border-t flex justify-end bg-gray-50">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 sm:px-6 py-2 rounded text-sm sm:text-base w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          >
            {loading ? "Saving..." : "Save Bill"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= REUSABLE ================= */
const InputRow = ({ label, value, onChange, readOnly, bold }) => (
  <div className="flex justify-between items-center gap-2">
    <span className={bold ? "font-semibold" : ""}>{label}</span>
    <input
      type="number"
      step="0.01"
      className={`border px-2 py-1 w-24 sm:w-28 rounded text-xs sm:text-sm ${bold ? "font-semibold" : ""
        } ${readOnly ? "bg-gray-50" : ""}`}
      value={value}
      readOnly={readOnly}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
    />
  </div>
);
