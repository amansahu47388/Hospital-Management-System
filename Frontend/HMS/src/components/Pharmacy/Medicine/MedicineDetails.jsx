import { X, Pencil, Trash2, FileText, Printer, Download } from "lucide-react";
import { useState } from "react";



export default function MedicineDetails({ open, onClose, medicine, stockList }) {
    if (!open || !medicine) return null;

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const today = new Date();
    const isExpired = (date) => new Date(date) < today;

  
    const [activeTab, setActiveTab] = useState("stock");

    

  const stockData = stockList.filter(
    (b) => !isExpired(b.expiry_date) && b.available_qty > 0
  );

  const badStockData = stockList.filter(
    (b) => isExpired(b.expiry_date) || b.available_qty === 0
  );

    const tableData = activeTab === "stock" ? stockData : badStockData;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex flex-col">

      {/* HEADER */}
      <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-3 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Medicine Details</h2>
        <div className="flex gap-4">
          <X size={20} className="cursor-pointer" onClick={onClose} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-6">

       {/* TOP SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* IMAGE */}
            <div className="md:col-span-2 flex justify-center items-start">
            {medicine.image ? (
              <img
                src={getImageUrl(medicine.image)}
                alt={medicine.name}
                className="w-32 h-32 object-cover rounded "
              />
            ) : (
              <div className="border rounded w-32 h-32 flex items-center justify-center text-gray-400 text-xs">
                NO IMAGE
              </div>
            )}
          </div>


            {/* DETAILS */}
            <div className="md:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-sm">

              {/* LEFT COLUMN */}
              <div className="space-y-2">
                  <DetailRow label="Medicine Name" value={medicine.name} />
                  <DetailRow label="Medicine Company" value={medicine.company_name || "-"} />
                  <DetailRow label="Medicine Group" value={medicine.group_name || "-"} />
                  <DetailRow label="Min Level" value={medicine.min_level} />
                  <DetailRow label="Tax (%)" value={medicine.tax} />
                  <DetailRow label="VAT A/C" value={medicine.vat_account || "-"} />
                  <DetailRow label="Rack Number" value={medicine.rack_number || "-"} />
                  <DetailRow label="Note" value={medicine.note || "-"} />
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-2">
                 <DetailRow label="Medicine Category" value={medicine.category_name} />
                <DetailRow label="Medicine Composition" value={medicine.composition || "-"} />
                <DetailRow label="Unit" value={medicine.unit_name} />
                <DetailRow label="Re-Order Level" value={medicine.reorder_level} />
                <DetailRow label="Box / Packing" value={medicine.box_packing} />
              </div>

            </div>
          </div>

        {/* TABS */}
        <div className="border-b border-gray-300 mt-8 flex gap-8 text-sm">
        <button
            onClick={() => setActiveTab("stock")}
            className={`pb-2 ${
            activeTab === "stock"
                ? "border-b-3 border-purple-600 text-purple-600"
                : "text-gray-600"
            }`}
        >
            Stock ({stockData.length})
        </button>

        <button
            onClick={() => setActiveTab("bad")}
            className={`pb-2 ${
            activeTab === "bad"
                ? "border-b-3 border-purple-600 text-purple-600"
                : "text-gray-600"
            }`}
        >
            Bad Stock ({badStockData.length})
        </button>
        </div>

        {/* SEARCH & ACTIONS */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 py-4">
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-1 rounded w-full md:w-64"
          />
          <div className="flex gap-4 text-gray-600">
            <FileText size={18} />
            <Download size={18} />
            <Printer size={18} />
          </div>
        </div>

        <div className="overflow-x-auto">
  
            {/* ===== STOCK TABLE ===== */}
            {activeTab === "stock" && (
              <table className="min-w-[1200px] w-full text-sm border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2  text-left">Inward Date</th>
                    <th className="p-2  text-left">Batch No</th>
                    <th className="p-2  text-left">Expiry Date</th>
                    <th className="p-2  text-left">Packing Qty</th>
                    <th className="p-2  text-left">Purchase Price</th>
                    <th className="p-2  text-left">Available Qty</th>
                    <th className="p-2  text-left">MRP</th>
                    <th className="p-2  text-left">Sale Price</th>
                    <th className="p-2  text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {stockData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="p-2 ">{new Date(row.created_at).toLocaleDateString()}</td>
                      <td className="p-2 ">{row.batch_no}</td>
                      <td className="p-2 ">{new Date(row.expiry_date).toLocaleDateString()}</td>
                      <td className="p-2  text-left">{row.total_qty}</td>
                      <td className="p-2  text-left">{row.purchase_price}</td>
                      <td className="p-2  text-left">{row.available_qty}</td>
                      <td className="p-2  text-left">{row.mrp}</td>
                      <td className="p-2  text-left">{row.sale_price}</td>
                      <td className="p-2  text-left">
                        <Trash2 size={16} className="text-red-500 cursor-pointer"/>
                      </td>
                    </tr>
                  ))}

                  {stockData.length === 0 && (
                    <tr>
                      <td colSpan="9" className="p-4 text-center text-gray-500">
                        No stock available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

                {/* ===== BAD STOCK TABLE ===== */}
                {activeTab === "bad" && (
                  <table className="min-w-[800px] w-full text-sm border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Batch No</th>
                        <th className="p-2 text-left">Expiry Date</th>
                        <th className="p-2 text-right">Available Qty</th>
                        <th className="p-2 text-center">Status</th>
                        <th className="p-2 text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {badStockData.map((row) => (
                        <tr key={row.id} className="hover:bg-red-50">
                          <td className="p-2">{row.batch_no}</td>
                          <td className="p-2 text-red-600">{new Date(row.expiry_date).toLocaleDateString()}</td>
                          <td className="p-2 text-right">{row.available_qty}</td>
                          <td className="p-2 text-center">
                            {isExpired(row.expiry_date) ? (
                              <span className="text-red-600 font-semibold">Expired</span>
                            ) : (
                              <span className="text-orange-500 font-semibold">Out of Stock</span>
                            )}
                          </td>
                          <td className="p-2 border text-center">
                            <Trash2 size={16} className="text-red-500 cursor-pointer"/>
                          </td>
                        </tr>
                      ))}

                      {badStockData.length === 0 && (
                        <tr>
                          <td colSpan="5" className="p-4 text-center text-gray-500">
                            No bad stock
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}

              </div>


      </div>
    </div>
  );
}



const DetailRow = ({ label, value }) => (
  <div className="grid grid-cols-12 gap-2">
    <div className="col-span-5 text-gray-700 font-medium">{label}</div>
    <div className="col-span-1 text-start">:</div>
    <div className="col-span-6 text-gray-900">{value}</div>
  </div>
);

function getImageUrl(photoPath) {
  if (!photoPath) return null;
  
  // If it's already a full URL
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }
  
  const apiUrl = import.meta.env.VITE_API_URL;
  const baseUrl = apiUrl.replace('/api', ''); 
  
  // Ensure path starts with /
  const path = photoPath.startsWith('/') ? photoPath : '/' + photoPath;
  
  const fullUrl = `${baseUrl}${path}`;
  console.log('Generated image URL:', fullUrl);
  return fullUrl;
}