import { X } from "lucide-react";

export default function PurchaseDetails({ data, onClose }) {
  if (!data) return null;

  const {
    supplier_name,
    bill_no,
    purchase_date,
    supplier,
    items,
    total_amount,
    discount_amount,
    tax_amount,
    net_amount,
    payment_mode,
  } = data;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex">
      <div className="bg-white w-full h-full flex flex-col">

        {/* HEADER */}
        <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-3 py-2 flex justify-between items-center">
          <span className="font-semibold text-sm">Purchase Details</span>
          <X size={18} className="cursor-pointer" onClick={onClose} />
        </div>

        {/* INFO BAR */}
        <div className="border-b px-4 py-2 text-xs flex flex-col md:flex-row md:justify-between gap-2">
          <div>
            <span className="font-medium">Pharmacy Purchase No</span>{" "}
            <span className="ml-1">PCHN{data.id}</span>
          </div>
          <div>
            <span className="font-medium">Bill No</span> {bill_no}
          </div>
          <div>
            <span className="font-medium">Purchase Date</span>{" "}
            {new Date(purchase_date).toLocaleString()}
          </div>
        </div>

        {/* SUPPLIER INFO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4 text-sm px-4 py-3 border-b">
          <div><b>Supplier Name</b></div><div>{supplier_name}</div>
          <div><b>Supplier Contact</b></div><div>{data.supplier_contact}</div>
          <div><b>Contact Person</b></div><div>{data.contact_person_name}</div>
          <div><b>Contact Person Phone</b></div><div>{data.contact_person_phone}</div>
          <div><b>Drug License Number</b></div><div>{data.drug_license_number}</div>
          <div><b>Address</b></div><div>{data.address}</div>
        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-auto">
          <div className="w-full overflow-x-auto">
            <table className="min-w-[1100px] w-full  text-xs">
              <thead className="bg-gray-100">
                <tr className="border-b">
                  {[
                    "Medicine Category",
                    "Medicine Name",
                    "Batch No",
                    "Expiry Month",
                    "MRP ($)",
                    "Batch Amount ($)",
                    "Sale Price ($)",
                    "Packing Qty",
                    "Quantity",
                    "Tax (%)",
                    "Purchase Price ($)",
                    "Amount ($)",
                  ].map(h => (
                    <th key={h} className="px-2 py-2 text-left whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {items.map((row, i) => (
                  <tr key={i} className="border-b">
                    <td className="px-2 py-1">{row.category_name}</td>
                    <td className="px-2 py-1">{row.medicine_name}</td>
                    <td className="px-2 py-1">{row.batch_no}</td>
                    <td className="px-2 py-1">{row.expiry_date}</td>
                    <td className="px-2 py-1">{row.mrp}</td>
                    <td className="px-2 py-1">{(row.mrp || 0) * row.quantity}</td>
                    <td className="px-2 py-1">{row.sale_price}</td>
                    <td className="px-2 py-1">{row.box_packing}</td>
                    <td className="px-2 py-1">{row.quantity}</td>
                    <td className="px-2 py-1">{row.tax_percentage}</td>
                    <td className="px-2 py-1">{row.purchase_price}</td>
                    <td className="px-2 py-1 font-semibold">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TOTALS */}
        <div className="border-t px-4 py-3 flex flex-col md:flex-row md:justify-between gap-4 text-sm">
          <div>
            <b>Payment Mode :</b> {payment_mode}
          </div>

          <div className="w-full md:w-64 space-y-1">
            <div className="flex justify-between">
              <span>Total ($)</span>
              <span>{Number(total_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>{Number(discount_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax ($)</span>
              <span>{Number(tax_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Net Amount ($)</span>
              <span>{Number(net_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t p-3 flex justify-center md:justify-end">
          <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded text-sm">
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
