import { X, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotify } from "../../../context/NotificationContext";
import {
  getMedicineCategories,
  getMedicines,
  getSuppliers,
  createPurchase,
} from "../../../api/pharmacyApi";

/* ================= ROW STRUCTURE ================= */
const emptyRow = {
  medicine_category_id: "",
  medicine_id: "",
  batch_no: "",
  expiry_month: "",
  mrp: "",
  batch_amount: "",
  sale_price: "",
  packing_qty: "",
  quantity: "",
  purchase_price: "",
  tax_percentage: "",
  amount: "0.00",
};


export default function PurchaseMedicine({ open, onClose, onSaved }) {
  const notify = useNotify();
  const [rows, setRows] = useState([{ ...emptyRow }]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [medicines, setMedicines] = useState([]);

  const [supplierId, setSupplierId] = useState("");
  const [billNo, setBillNo] = useState("");
  const [purchaseDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [attachment, setAttachment] = useState(null);

  const [discountAmount, setDiscountAmount] = useState("");

  const [paymentMode, setPaymentMode] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");

  const [loading, setLoading] = useState(false);



  const resetForm = () => {
    setRows([{ ...emptyRow }]);
    setSupplierId("");
    setBillNo("");
    setNote("");
    setAttachment(null);
    setDiscountAmount("");
    setPaymentAmount("");
    setPaymentNote("");
    setPaymentMode("Cash");
  };

  /* ================= LOAD DROPDOWNS ================= */
  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        const [sup, cat, med] = await Promise.all([
          getSuppliers(),
          getMedicineCategories(),
          getMedicines(),
        ]);
        setSuppliers(sup.data || []);
        setCategories(cat.data || []);
        setMedicines(med.data || []);
      } catch {
        notify("error", "Failed to load dropdown data");
      }
    })();
  }, [open]);

  if (!open) return null;

  const isEmpty = (v) => v === "" || v === null || v === undefined;

  const validateRows = (rows) => {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];

      if (isEmpty(r.medicine_category_id))
        return `Row ${i + 1}: Medicine Category is required`;
      if (isEmpty(r.medicine_id))
        return `Row ${i + 1}: Medicine Name is required`;
      if (isEmpty(r.batch_no))
        return `Row ${i + 1}: Batch No is required`;
      if (isEmpty(r.expiry_month))
        return `Row ${i + 1}: Expiry Month is required`;
      if (!r.quantity || Number(r.quantity) <= 0)
        return `Row ${i + 1}: Quantity must be greater than 0`;
      if (!r.purchase_price || Number(r.purchase_price) <= 0)
        return `Row ${i + 1}: Purchase Price must be greater than 0`;
    }
    return null;
  };


  /* ================= CALCULATIONS ================= */

  const calculateRowAmount = (row) => {
    const qty = Number(row.quantity || 0);
    const price = Number(row.purchase_price || 0);

    return (qty * price).toFixed(2); // ❗ NO TAX HERE
  };


  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    updated[index].amount = calculateRowAmount(updated[index]);
    setRows(updated);
  };


  // ✅ TOTAL (without tax)
  const totalAmount = rows.reduce(
    (sum, r) => sum + Number(r.amount || 0),
    0
  );

  // ✅ TOTAL TAX (calculated from rows)
  const totalTaxAmount = rows.reduce((sum, r) => {
    const rowAmount = Number(r.amount || 0);
    const taxPercent = Number(r.tax_percentage || 0);
    return sum + (rowAmount * taxPercent) / 100;
  }, 0);

  // ✅ DISCOUNT (%)
  const discountPercent = Number(discountAmount || 0);
  const discountValue = (totalAmount * discountPercent) / 100;

  // ✅ NET AMOUNT
  const netAmount = totalAmount + totalTaxAmount - discountValue;



  const addRow = () => setRows((p) => [...p, { ...emptyRow }]);

  const removeRow = (index) => {
    if (rows.length === 1) return;
    setRows((p) => p.filter((_, i) => i !== index));
  };




  /* ================= SUBMIT ================= */
  const handleSave = async () => {
    if (loading) return;

    if (!supplierId  || !billNo) {
      notify("warning", "fill all required fields");
      return;
    }

    const rowError = validateRows(rows);
    if (rowError) {
      notify("error", rowError);
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("supplier", supplierId);
      if (billNo) formData.append("bill_no", billNo);
      formData.append("purchase_date", purchaseDate.toISOString());

      formData.append("total_amount", totalAmount.toFixed(2));
      formData.append("tax_amount", totalTaxAmount.toFixed(2));
      formData.append("discount_amount", discountValue.toFixed(2));
      formData.append("net_amount", netAmount.toFixed(2));
      formData.append("payment_mode", paymentMode);
      formData.append("payment_amount", paymentAmount || netAmount.toFixed(2));

      if (note) formData.append("note", note);
      if (attachment) formData.append("attachment", attachment);

      const itemsPayload = rows.map((row) => ({
        medicine: row.medicine_id,
        batch_no: row.batch_no,
        expiry_date: row.expiry_month ? `${row.expiry_month}-01` : null,
        mrp: row.mrp || 0,
        purchase_price: row.purchase_price,
        sale_price: row.sale_price || row.purchase_price,
        tax_percentage: row.tax_percentage || 0,
        quantity: row.quantity,
        amount: row.amount,
      }));

      formData.append("items_json", JSON.stringify(itemsPayload));

      await createPurchase(formData);

      notify("success", "Purchase saved successfully");

      onSaved?.();      // refresh list
      resetForm();      // clear form
      onClose();        // close modal
    } catch (err) {
      notify(
        "error",
        err?.response?.data?.items ||
        err?.response?.data?.detail ||
        "Failed to save purchase"
      );
    } finally {
      setLoading(false);
    }
  };



  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-[999] bg-black/40 p-2 sm:p-4 md:p-0">
      <div className="w-full h-full bg-white flex flex-col overflow-hidden rounded-lg md:rounded-none">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 px-3 sm:px-4 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white">
          <select
            className="bg-white text-black px-3 py-1 rounded w-full sm:w-80 text-sm sm:text-base"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.supplier_name}
              </option>
            ))}
          </select>

          <button onClick={() => !loading && onClose()} className="self-end sm:self-auto">
            <X size={22} />
          </button>
        </div>

        {/* ================= BILL INFO ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 px-3 sm:px-4 py-2 bg-gray-100 border-b text-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="font-medium whitespace-nowrap">Bill No</label>
            <input
              className="border px-2 py-1 rounded w-full sm:w-40 text-sm sm:text-base"
              value={billNo}
              onChange={(e) => setBillNo(e.target.value)}
            />
          </div>

          <div className="font-medium text-xs sm:text-sm">
            Purchase Date&nbsp;
            <span className="font-semibold">
              {purchaseDate.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="flex-1 overflow-auto px-2 py-3">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-200">
                <tr>
                  {[
                    "Medicine Category *",
                    "Medicine Name *",
                    "Batch No *",
                    "Expiry Month *",
                    "MRP ($) *",
                    "Batch Amount ($)",
                    "Sale Price ($) *",
                    "Packing Qty",
                    "Quantity *",
                    "Purchase Price ($) *",
                    "Tax % *",
                    "Amount ($) *",
                  ].map((h) => (
                    <th key={h} className="px-1 sm:px-2 py-1 text-left whitespace-nowrap text-xs sm:text-sm">
                      {h}
                    </th>
                  ))}
                  <th className="px-1 sm:px-2 py-1 text-center">
                    <Plus onClick={addRow} className="cursor-pointer text-purple-600" size={16} />
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <select
                        className="border w-full px-1 py-1"
                        value={row.medicine_category_id}
                        onChange={(e) =>
                          updateRow(i, "medicine_category_id", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.category_name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className=" p-1">
                      <select
                        className="border w-full px-1 py-1"
                        value={row.medicine_id}
                        onChange={(e) =>
                          updateRow(i, "medicine_id", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {medicines
                          .filter(
                            (m) =>
                              String(m.category) ===
                              String(row.medicine_category_id)
                          )
                          .map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name}
                            </option>
                          ))}
                      </select>
                    </td>

                    <td className=" p-1">
                      <input
                        className="border w-full px-1 py-1"
                        value={row.batch_no}
                        onChange={(e) =>
                          updateRow(i, "batch_no", e.target.value)
                        }
                      />
                    </td>

                    <td className=" p-1">
                      <input
                        type="month"
                        className="border w-full px-1 py-1"
                        value={row.expiry_month}
                        onChange={(e) =>
                          updateRow(i, "expiry_month", e.target.value)
                        }
                      />
                    </td>

                    <td className=" p-1">
                      <input
                        className="border w-full px-1 py-1"
                        value={row.mrp}
                        onChange={(e) => updateRow(i, "mrp", e.target.value)}
                      />
                    </td>

                    <td className=" p-1">
                      <input
                        className="border w-full px-1 py-1"
                        value={row.batch_amount}
                        onChange={(e) =>
                          updateRow(i, "batch_amount", e.target.value)
                        }
                      />
                    </td>

                    <td className=" p-1">
                      <input
                        className="border w-full px-1 py-1"
                        value={row.sale_price}
                        onChange={(e) =>
                          updateRow(i, "sale_price", e.target.value)
                        }
                      />
                    </td>

                    <td className=" p-1">
                      <input
                        className="border w-full px-1 py-1"
                        value={row.packing_qty}
                        onChange={(e) =>
                          updateRow(i, "packing_qty", e.target.value)
                        }
                      />
                    </td>

                    <td className=" p-1">
                      <input
                        type="number"
                        className="border w-full px-1 py-1"
                        value={row.quantity}
                        onChange={(e) =>
                          updateRow(i, "quantity", e.target.value)
                        }
                      />
                    </td>

                    <td className=" p-1">
                      <input
                        type="number"
                        className="border w-full px-1 py-1"
                        value={row.purchase_price}
                        onChange={(e) =>
                          updateRow(i, "purchase_price", e.target.value)
                        }
                      />
                    </td>

                    <td className=" p-1">
                      <input
                        type="number"
                        className="border w-full px-1 py-1"
                        value={row.tax_percentage}
                        onChange={(e) =>
                          updateRow(i, "tax_percentage", e.target.value)
                        }
                      />
                    </td>

                    <td className=" p-1 bg-gray-100 font-semibold">
                      {row.amount}
                    </td>

                    <td className="text-center">
                      <Trash2
                        size={16}
                        className="text-red-500 cursor-pointer mx-auto"
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
              <label className="font-medium block mb-1 text-sm sm:text-base">Note</label>
              <textarea
                className="border w-full p-2 h-24 rounded text-sm sm:text-base"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <label className="font-medium block mt-4 text-sm sm:text-base">Attach Document</label>
              <input
                type="file"
                className="border w-full p-2 rounded text-sm sm:text-base"
                onChange={(e) =>
                  setAttachment(e.target.files?.[0] || null)
                }
              />
            </div>

            {/* RIGHT */}
            <div className="space-y-3 text-xs sm:text-sm">
              <InputRow label="Total ($)" value={totalAmount.toFixed(2)} />
              <InputRow label="Discount (%)" value={discountAmount} onChange={setDiscountAmount} />
              <InputRow label="Tax Amount ($)" value={totalTaxAmount.toFixed(2)} readOnly />
              <InputRow label="Net Amount ($)" value={netAmount.toFixed(2)} bold />
              <InputRow label="Payment Amount ($)" value={paymentAmount} onChange={setPaymentAmount} />

              <div>
                <label className="block font-medium text-sm sm:text-base">Payment Mode</label>
                <select
                  className="border w-full px-2 py-1 rounded text-sm sm:text-base"
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-sm sm:text-base">Payment Note</label>
                <textarea
                  className="border w-full p-2 rounded text-sm sm:text-base"
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="px-3 sm:px-4 py-3 border-t flex justify-end bg-gray-50">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 sm:px-6 py-2 rounded text-sm sm:text-base w-full sm:w-auto"
          >
            {loading ? "Saving..." : "Save"}
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
      className={`border px-2 py-1 w-20 sm:w-24 rounded text-xs sm:text-sm ${bold ? "font-semibold" : ""}`}
      value={value}
      readOnly={readOnly}
      onChange={onChange ? (e) => onChange(e.target.value) : undefined}
    />
  </div>
);


