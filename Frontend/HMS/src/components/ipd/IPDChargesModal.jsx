import React, { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

export default function IPDChargesModal({ isOpen, onClose, onSave, mode = "add", initialData = null }) {
  
  const [formData, setFormData] = useState(
    initialData || {
      chargeType: "",
      chargeCategory: "",
      chargeName: "",
      standardCharge: "",
      tpaCharge: "",
      qty: "",
      date: new Date().toISOString().slice(0, 16),
      chargeNote: "",
    }
  );

  const [chargesList, setChargesList] = useState(initialData ? [initialData] : []);

  // Calculate totals
  const totalCharge = parseFloat(formData.standardCharge || 0) * parseFloat(formData.qty || 1);
  const taxPercentage = 18; // Default tax percentage
  const taxAmount = totalCharge * (taxPercentage / 100);
  const discountPercentage = 0; // Can be made dynamic
  const discountAmount = totalCharge * (discountPercentage / 100);
  const netAmount = totalCharge - discountAmount + taxAmount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCharge = () => {
    if (!formData.chargeType || !formData.chargeCategory || !formData.chargeName) {
      alert("Please fill all required fields");
      return;
    }

    const newCharge = {
      ...formData,
      total: totalCharge,
      discount: discountAmount,
      tax: taxAmount,
      netAmount: netAmount,
      id: Date.now(),
    };

    setChargesList([...chargesList, newCharge]);
    setFormData({
      chargeType: "",
      chargeCategory: "",
      chargeName: "",
      standardCharge: "",
      tpaCharge: "",
      qty: "",
      date: new Date().toISOString().slice(0, 16),
      chargeNote: "",
    });
  };

  const handleRemoveCharge = (id) => {
    setChargesList(chargesList.filter((charge) => charge.id !== id));
  };

  const handleSave = () => {
    if (chargesList.length === 0 && mode === "add") {
      alert("Please add at least one charge");
      return;
    }
    onSave(chargesList);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-2xl font-bold">{mode === "add" ? "Add Charges" : "Edit Charges"}</h2>
          <div className="flex items-center gap-4">
            
            <button
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Main Form Section */}
          <div className="space-y-4">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Charge Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="chargeType"
                  value={formData.chargeType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                >
                  <option value="">Select</option>
                  <option value="IPD">IPD</option>
                  <option value="OPD">OPD</option>
                  <option value="Lab">Lab</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Charge Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="chargeCategory"
                  value={formData.chargeCategory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                >
                  <option value="">Select</option>
                  <option value="Intensive Care Units">Intensive Care Units</option>
                  <option value="General Ward">General Ward</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Charge Name <span className="text-red-500">*</span>
                </label>
                <select
                  name="chargeName"
                  value={formData.chargeName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                >
                  <option value="">Select</option>
                  <option value="ICU">ICU</option>
                  <option value="Room Charges">Room Charges</option>
                  <option value="Surgery">Surgery</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Standard Charge ($)
                </label>
                <input
                  type="number"
                  name="standardCharge"
                  value={formData.standardCharge}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                />
              </div>

              <div>
                
                <input
                  type="number"
                  name="tpaCharge"
                  value={formData.tpaCharge}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Qty <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="qty"
                  value={formData.qty}
                  onChange={handleInputChange}
                  placeholder="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                />
              </div>
            </div>

            {/* Second Row - Summary and Charge Note */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left Column - Summary */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-semibold text-gray-700">Total ($)</span>
                  <span className="text-lg font-bold text-gray-900">{totalCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Discount Percentage ($)</span>
                    <span className="text-sm text-gray-600">0 %</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">Tax ($)</span>
                    <span className="text-sm text-gray-600">{taxPercentage.toFixed(2)} %</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] rounded-lg text-white">
                  <span className="text-sm font-semibold">Net Amount ($)</span>
                  <span className="text-lg font-bold">{netAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Middle Column - Charge Note */}
              <div className="lg:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Charge Note</label>
                <textarea
                  name="chargeNote"
                  value={formData.chargeNote}
                  onChange={handleInputChange}
                  placeholder="Enter charge note..."
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                />
              </div>

              {/* Right Column - Date and Add Button */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5]"
                  />
                </div>

                {mode === "add" && (
                  <button
                    onClick={handleAddCharge}
                    className="w-full bg-gradient-to-r from-[#6046B5] to-[#8A63D2] hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2 mt-auto"
                  >
                    <Plus size={20} />
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          {mode === "add" && chargesList.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white">
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Date</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Charge Type</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Category</th>
                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Charge Name</th>
                    <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">Qty</th>
                    <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Standard ($)</th>
                    <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">TPA ($)</th>
                    <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Total ($)</th>
                    <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Discount ($)</th>
                    <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Tax ($)</th>
                    <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Net ($)</th>
                    <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {chargesList.map((charge) => (
                    <tr key={charge.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-sm">
                        {new Date(charge.date).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{charge.chargeType}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{charge.chargeCategory}</td>
                      <td className="border border-gray-300 px-3 py-2 text-sm">{charge.chargeName}</td>
                      <td className="border border-gray-300 px-3 py-2 text-center text-sm">{charge.qty}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right text-sm">{parseFloat(charge.standardCharge).toFixed(2)}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right text-sm">{parseFloat(charge.tpaCharge || 0).toFixed(2)}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">{charge.total.toFixed(2)}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right text-sm">{charge.discount.toFixed(2)}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right text-sm">{charge.tax.toFixed(2)}</td>
                      <td className="border border-gray-300 px-3 py-2 text-right text-sm font-bold text-[#6046B5]">
                        {charge.netAmount.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <button
                          onClick={() => handleRemoveCharge(charge.id)}
                          className="p-1 hover:bg-red-100 rounded transition text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] hover:bg-blue-600 text-white rounded-lg transition font-medium flex items-center gap-2"
          >
            <span>✓</span>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
