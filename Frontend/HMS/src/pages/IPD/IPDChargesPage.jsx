import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDTabsNavbar";
import IPDChargesModal from "../../components/ipd/IPDChargesModal";
import { Edit2, Trash2 } from "lucide-react";

export default function IPDChargesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [charges, setCharges] = useState([
    {
      id: 1,
      chargeType: "IPD",
      chargeCategory: "Intensive Care Units",
      chargeName: "ICU",
      standardCharge: "515.00",
      tpaCharge: "340.00",
      qty: "1",
      date: "01/14/2026",
      total: 515.0,
      discount: 0.0,
      tax: 92.7,
      netAmount: 607.7,
    },
  ]);

  const handleAddCharge = (newCharges) => {
    setCharges([...charges, ...newCharges]);
    setShowAddModal(false);
  };

  const handleEditCharge = (updatedCharges) => {
    const chargeId = selectedCharge?.id;
    const updatedList = charges.map((charge) =>
      charge.id === chargeId ? { ...updatedCharges[0], id: chargeId } : charge
    );
    setCharges(updatedList);
    setShowEditModal(false);
    setSelectedCharge(null);
  };

  const handleDeleteCharge = (id) => {
    if (window.confirm("Are you sure you want to delete this charge?")) {
      setCharges(charges.filter((charge) => charge.id !== id));
    }
  };

  const openEditModal = (charge) => {
    setSelectedCharge(charge);
    setShowEditModal(true);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 pt-1 md:pt-6 pb-6">
        <IPDTabsNavbar activeTab="charges" onTabChange={() => {}} />

        <div className="mx-4 md:mx-6 mt-6">
          <div className="bg-white rounded-lg shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Charges</h2>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:shadow-lg transition font-medium flex items-center gap-2"
              >
                <span>+</span>
                Add Charges
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white">
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Charge Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Charge Name</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Standard ($)</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">TPA ($)</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Total ($)</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Discount ($)</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Tax ($)</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Net ($)</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {charges.length > 0 ? (
                    charges.map((charge) => (
                      <tr key={charge.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{charge.date}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{charge.chargeType}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{charge.chargeCategory}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{charge.chargeName}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900">{charge.qty}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">${parseFloat(charge.standardCharge).toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">${parseFloat(charge.tpaCharge || 0).toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">${charge.total.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">${charge.discount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">${charge.tax.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right text-sm font-bold text-[#6046B5]">${charge.netAmount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(charge)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteCharge(charge.id)}
                              className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="px-4 py-8 text-center text-gray-500">
                        No charges added yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Charges Modal */}
        <IPDChargesModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddCharge}
          mode="add"
        />

        {/* Edit Charges Modal */}
        {selectedCharge && (
          <IPDChargesModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedCharge(null);
            }}
            onSave={handleEditCharge}
            mode="edit"
            initialData={selectedCharge}
          />
        )}
      </div>
    </AdminLayout>
  );
}
