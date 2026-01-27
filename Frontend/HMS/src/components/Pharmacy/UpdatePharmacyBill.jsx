import { X, Plus, Trash2, Search } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useNotify } from "../../context/NotificationContext";
import {
  getMedicineCategories,
  getBillingMedicines,
  getBillingBatches,
  updatePharmacyBill,
} from "../../api/pharmacyApi";
import { getPatientList, searchPatient } from "../../api/patientApi";
import { getDoctors } from "../../api/appointmentApi";

const emptyRow = {
  medicine_category_id: "",
  medicine_id: "",
  stock_id: "",
  batch_id: "",
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

export default function UpdatePharmacyBill({ bill, onClose, onUpdated }) {
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
  const [note, setNote] = useState("");
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState(0);

  /* ================= LOAD DROPDOWNS ================= */
  useEffect(() => {
    Promise.all([
      getMedicineCategories(),
      getBillingMedicines(),
      getDoctors(),
    ]).then(([c, m, d]) => {
      setCategories(c.data || []);
      setBillingMedicines(m.data || []);
      setDoctors(d.data || []);
    });
  }, []);

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

  /* ================= LOAD EXISTING BILL ================= */
  useEffect(() => {
    if (!bill) return;

    setPatientId(bill.patient);
    setPatientSearch(bill.patient_name || "");
    setIsSelectingPatient(true); // Don't trigger search on initial load
    setTimeout(() => setIsSelectingPatient(false), 500);

    setDoctorId(bill.doctor || "");
    setNote(bill.note || "");
    setPaymentMode(bill.payment_mode);
    setPaymentAmount(Number(bill.paid_amount));

    const load = async () => {
      const mapped = await Promise.all(
        bill.items.map(async (i) => {
          const batchRes = await getBillingBatches(i.medicine);
          const batches = batchRes.data || [];
          const stock = batches.find((b) => b.batch_id === i.batch);

          const base = i.quantity * i.sale_price;
          const tax = (base * i.tax_percentage) / 100;
          const disc = (base * i.discount_percentage) / 100;

          return {
            ...emptyRow,
            medicine_id: i.medicine,
            batch_id: i.batch,
            stock_id: stock?.id || "",
            batch_no: stock?.batch_no || "",
            expiry_date: stock?.expiry?.slice(0, 7) || "",
            available_qty: stock?.available_qty || 0,
            sale_price: Number(i.sale_price),
            tax_percentage: Number(i.tax_percentage),
            discount_percentage: Number(i.discount_percentage),
            quantity: Number(i.quantity),
            amount: (base + tax - disc).toFixed(2),
            batches,
          };
        })
      );

      setRows(mapped);
    };

    load();
  }, [bill]);

  /* ================= HELPERS ================= */
  const recalc = (row) => {
    const base = row.quantity * row.sale_price;
    const tax = (base * row.tax_percentage) / 100;
    const disc = (base * row.discount_percentage) / 100;
    return (base + tax - disc).toFixed(2);
  };

  const updateRow = (index, field, value) => {
    const copy = [...rows];
    copy[index][field] = Number(value);

    if (copy[index].quantity > copy[index].available_qty) {
      notify("error", "Quantity exceeds available stock");
      copy[index].quantity = copy[index].available_qty;
    }

    copy[index].amount = recalc(copy[index]);
    setRows(copy);
  };

  const handleCategoryChange = (index, catId) => {
    const copy = [...rows];
    copy[index] = { ...emptyRow, medicine_category_id: catId };
    setRows(copy);
  };

  const handleMedicineChange = async (index, medId) => {
    const res = await getBillingBatches(medId);
    const copy = [...rows];
    copy[index] = { ...copy[index], medicine_id: medId, batches: res.data || [] };
    setRows(copy);
  };

  const handleBatchChange = (index, stockId) => {
    const row = rows[index];
    const stock = row.batches.find((b) => String(b.id) === String(stockId));

    const copy = [...rows];
    copy[index] = {
      ...row,
      stock_id: stock.id,
      batch_id: stock.batch_id,
      batch_no: stock.batch_no,
      expiry_date: stock.expiry?.slice(0, 7),
      available_qty: stock.available_qty,
      sale_price: Number(stock.sale_price),
      tax_percentage: Number(stock.tax),
      quantity: 1,
    };

    copy[index].amount = recalc(copy[index]);
    setRows(copy);
  };

  const addRow = () => setRows([...rows, { ...emptyRow }]);
  const removeRow = (i) => rows.length > 1 && setRows(rows.filter((_, x) => x !== i));

  /* ================= TOTALS ================= */
  const baseTotal = rows.reduce((s, r) => s + r.quantity * r.sale_price, 0);
  const taxAmount = rows.reduce((s, r) => s + (r.quantity * r.sale_price * r.tax_percentage) / 100, 0);
  const discountAmount = rows.reduce((s, r) => s + (r.quantity * r.sale_price * r.discount_percentage) / 100, 0);
  const totalAmount = baseTotal + taxAmount - discountAmount;
  const balance = totalAmount - paymentAmount;

  /* ================= SAVE ================= */
  const handleSave = async () => {
    setLoading(true);
    try {
      await updatePharmacyBill(bill.id, {
        patient: patientId,
        doctor: doctorId || null,
        note,
        payment_mode: paymentMode,
        total_amount: baseTotal.toFixed(2),
        tax_amount: taxAmount.toFixed(2),
        discount_amount: discountAmount.toFixed(2),
        net_amount: totalAmount.toFixed(2),
        paid_amount: paymentAmount.toFixed(2),
        balance_amount: balance.toFixed(2),
        items: rows.map((r) => ({
          medicine: r.medicine_id,
          batch: r.batch_id,
          quantity: r.quantity,
          sale_price: r.sale_price,
          tax_percentage: r.tax_percentage,
          discount_percentage: r.discount_percentage,
          amount: r.amount,
        })),
      });

      notify("success", "Bill updated");
      onUpdated();
      onClose();
    } catch {
      notify("error", "Update failed");
    }
    setLoading(false);
  };

  if (!bill) return null;


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
