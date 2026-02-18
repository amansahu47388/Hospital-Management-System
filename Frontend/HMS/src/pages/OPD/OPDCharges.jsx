import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import OPDNavbar from "../../components/OPDComponent/OPDNavbar";
import { Plus, Trash2, FileIcon as FilePdf, X, CheckCircle, Pencil, Loader2 } from "lucide-react";
import {
  getPatientCharges,
  createPatientCharge,
  updatePatientCharge,
  deletePatientCharge
} from "../../api/patientApi";
import { getOpdPatientDetail } from "../../api/opdApi";
import { getHospitalCharges } from "../../api/setupApi";
import { useNotify } from "../../context/NotificationContext";

export default function OPDCharges() {
  const { opdId } = useParams();
  const notify = useNotify();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState(null);
  const [loading, setLoading] = useState(false);
  const [charges, setCharges] = useState([]);
  const [patientId, setPatientId] = useState(null);

  const [chargeTypes, setChargeTypes] = useState([]);
  const [chargeCategories, setChargeCategories] = useState([]);
  const [hospitalCharges, setHospitalCharges] = useState([]);
  const [pendingCharges, setPendingCharges] = useState([]);

  const [formData, setFormData] = useState({
    charge_date: new Date().toISOString().slice(0, 10),
    charge_type: "",
    charge_category: "",
    charge_name: "",
    standard_charge: 0,
    discount_percent: 0,
    tax_percent: 0,
    tax: 0,
    charge_note: "",
    amount: 0
  });

  useEffect(() => {
    const init = async () => {
      if (opdId) {
        setLoading(true);
        try {
          const [opdRes, chargeRes] = await Promise.all([
            getOpdPatientDetail(opdId),
            getHospitalCharges()
          ]);

          const masterCharges = chargeRes.data || [];
          setPatientId(opdRes.data.patient);
          setHospitalCharges(masterCharges);

          // Extract unique charge types
          const uniqueTypes = [...new Set(masterCharges.map(item => item.charge_type))].map((type, idx) => ({
            id: idx,
            charge_type: type
          }));
          setChargeTypes(uniqueTypes);

          // Extract unique categories (mapping them to their types)
          const uniqueCategories = [];
          const seenCategories = new Set();

          masterCharges.forEach(item => {
            const key = `${item.charge_type}-${item.charge_category}`;
            if (!seenCategories.has(key)) {
              seenCategories.add(key);
              uniqueCategories.push({
                id: uniqueCategories.length,
                category_name: item.charge_category,
                charge_type_name: item.charge_type
              });
            }
          });
          setChargeCategories(uniqueCategories);

          fetchCharges(opdRes.data.patient);
        } catch (error) {
          console.error("Error initializing charges:", error);
          notify("error", "Failed to load records");
        } finally {
          setLoading(false);
        }
      }
    };
    init();
  }, [opdId]);

  const fetchCharges = async (pid = patientId) => {
    if (!pid) return;
    setLoading(true);
    try {
      const response = await getPatientCharges(pid);
      setCharges(response.data);
    } catch (error) {
      console.error("Error fetching charges:", error);
      notify("error", "Failed to fetch charge records");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    if (pendingCharges.length === 0) {
      notify("warning", "No charges added to the list");
      return;
    }
    setLoading(true);
    try {
      // Save all pending charges
      await Promise.all(pendingCharges.map(c => createPatientCharge(patientId, c)));
      notify("success", "All charges saved successfully");
      fetchCharges(patientId);
      setShowAddModal(false);
      setPendingCharges([]);
      // Reset form
      setFormData({
        charge_date: new Date().toISOString().slice(0, 10),
        charge_type: "",
        charge_category: "",
        charge_name: "",
        standard_charge: 0,
        discount_percent: 0,
        tax_percent: 0,
        tax: 0,
        amount: 0,
        charge_note: ""
      });
    } catch (error) {
      console.error("Error saving charges:", error);
      notify("error", error.response?.data?.detail || "Failed to save charges");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCharge) return;

    setLoading(true);
    try {
      // Prepare update data
      const updateData = {
        charge_date: selectedCharge.charge_date,
        charge_type: selectedCharge.charge_type,
        charge_category: selectedCharge.charge_category,
        charge_name: selectedCharge.charge_name,
        standard_charge: parseFloat(selectedCharge.standard_charge) || 0,
        tax: parseFloat(selectedCharge.tax) || 0,
        discount: parseFloat(selectedCharge.discount) || 0,
        amount: parseFloat(selectedCharge.amount) || 0,
        charge_note: selectedCharge.charge_note || ""
      };

      await updatePatientCharge(patientId, selectedCharge.id, updateData);
      notify("success", "Charge updated successfully");
      fetchCharges(patientId);
      setShowEditModal(false);
      setSelectedCharge(null);
    } catch (error) {
      console.error("Error updating charge:", error);
      notify("error", error.response?.data?.detail || "Failed to update charge");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this charge?")) {
      try {
        await deletePatientCharge(patientId, id);
        notify("success", "Charge deleted successfully");
        fetchCharges(patientId);
      } catch (error) {
        console.error("Error deleting charge:", error);
        notify("error", error.response?.data?.detail || "Failed to delete charge");
      }
    }
  };

  const calculateFinancials = (data) => {
    const basePrice = data.apply_tpa ? (data.tpa_charge || 0) : (data.standard_charge || 0);
    const total = basePrice * (data.qty || 1);
    const discountVal = (total * (data.discount_percent || 0)) / 100;
    const subtotal = total - discountVal;
    const taxVal = (subtotal * (data.tax_percent || 0)) / 100;
    const netAmount = subtotal + taxVal;

    return { total, discountVal, subtotal, taxVal, netAmount };
  };

  const addToPending = () => {
    if (!formData.charge_name || !formData.charge_date) {
      notify("error", "Please select charge name and date");
      return;
    }
    if (!formData.charge_type || !formData.charge_category) {
      notify("error", "Please select charge type and category");
      return;
    }

    const fin = calculateFinancials(formData);

    // Prepare data for backend - convert percentages to actual values
    const newEntry = {
      charge_date: formData.charge_date,
      charge_type: formData.charge_type,
      charge_category: formData.charge_category,
      charge_name: formData.charge_name,
      standard_charge: parseFloat(formData.standard_charge) || 0,
      tax: parseFloat(fin.taxVal.toFixed(2)),
      discount: parseFloat(fin.discountVal.toFixed(2)),
      amount: parseFloat(fin.netAmount.toFixed(2)),
      charge_note: formData.charge_note || "",
      discount_percent: formData.discount_percent,
      tax_percent: formData.tax_percent
    };

    setPendingCharges([...pendingCharges, newEntry]);

    // Reset only the charge-specific fields
    setFormData({
      ...formData,
      charge_name: "",
      standard_charge: 0,
      discount_percent: 0,
      tax_percent: 0,
      charge_note: ""
    });
  };

  const handleOpenEdit = (charge) => {
    // Calculate percentage values from stored amounts for display
    const total = charge.standard_charge || 0;
    const discountPercent = total > 0 ? ((charge.discount || 0) / total) * 100 : 0;

    const discountVal = charge.discount || 0;
    const subtotal = total - discountVal;
    const taxPercent = subtotal > 0 ? ((charge.tax || 0) / subtotal) * 100 : 0;

    setSelectedCharge({
      ...charge,
      discount_percent: discountPercent,
      tax_percent: taxPercent
    });
    setShowEditModal(true);
  };

  const currentFin = calculateFinancials(formData);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 pb-10">
        <OPDNavbar />

        <div className="p-4 md:p-6">
          <div className="bg-white rounded shadow p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Charges</h2>
            </div>
            <button
              onClick={() => {
                setFormData({
                  charge_date: new Date().toISOString().slice(0, 10),
                  charge_type: "",
                  charge_category: "",
                  charge_name: "",
                  standard_charge: 0,
                  discount_percent: 0,
                  tax_percent: 0,
                  charge_note: "",
                });
                setPendingCharges([]);
                setShowAddModal(true);
              }}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:opacity-90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-semibold"
            >
              <Plus size={18} />
              Add Charges
            </button>
          </div>

          <div className="overflow-x-auto mt-6 bg-white rounded shadow overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold">Date</th>
                  <th className="px-6 py-4 text-sm font-bold">Charge Name</th>
                  <th className="px-6 py-4 text-sm font-bold">Charge Type</th>
                  <th className="px-6 py-4 text-sm font-bold">Charge Category</th>
                  <th className="px-6 py-4 text-sm font-bold">Standard Charge($)</th>
                  <th className="px-6 py-4 text-sm font-bold">Discount($)</th>
                  <th className="px-6 py-4 text-sm font-bold">Tax($)</th>
                  <th className="px-6 py-4 text-sm font-bold">Amount($)</th>
                  <th className="px-6 py-4 text-sm font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white border-b border-gray-200 divide-y divide-gray-100 font-outfit font-medium">
                {loading && charges.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-10 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="animate-spin text-purple-600" size={20} />
                        <span>Loading records...</span>
                      </div>
                    </td>
                  </tr>
                ) : charges.length > 0 ? (
                  charges.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm ">{row.charge_date}</td>
                      <td className="px-6 py-4 text-sm ">{row.charge_name}</td>
                      <td className="px-6 py-4 text-sm ">{row.charge_type}</td>
                      <td className="px-6 py-4 text-sm ">{row.charge_category}</td>
                      <td className="px-6 py-4 text-sm ">${Number(row.standard_charge).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm ">${Number(row.discount).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm ">${Number(row.tax).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">${Number(row.amount).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm ">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEdit(row)}
                            className="hover:bg-purple-100 text-[#6046B5] p-1 rounded transition "
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="hover:bg-red-100 text-red-600 p-1 rounded transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="px-6 py-10 text-center text-gray-500 italic">
                      {patientId ? "No records found" : "Resolving Patient..."}
                    </td>
                  </tr>
                )}
                {charges.length > 0 && (
                  <tr className="bg-gray-50 font-bold">
                    <td colSpan="7" className="px-6 py-4 text-right text-sm">Grand Total:</td>
                    <td className="px-6 py-4 text-gray-900 text-lg">
                      ${charges.reduce((sum, c) => sum + Number(c.amount), 0).toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* REDESIGNED ADD CHARGES MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[70] bg-white animate-in fade-in transition-all flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center text-white shrink-0">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Plus size={24} />
              Add Charges
            </h3>
            <button
              onClick={() => setShowAddModal(false)}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-grow overflow-y-auto p-6 md:p-10">
            <div className="max-w-7xl mx-auto space-y-10">
              {/* Inputs Section */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Charge Type <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border border-gray-300 px-2 py-2 rounded focus:ring-1 focus:ring-[#6046B5] outline-none transition-all shadow"
                    value={formData.charge_type}
                    onChange={(e) => setFormData({
                      ...formData,
                      charge_type: e.target.value,
                      charge_category: "",
                      charge_name: "",
                      standard_charge: 0,
                      tax_percent: 0
                    })}
                  >
                    <option value="">Select Type</option>
                    {chargeTypes.map(t => <option key={t.id} value={t.charge_type}>{t.charge_type}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700  tracking-wide">Charge Category <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border border-gray-300 px-2 py-2 rounded focus:ring-1 focus:ring-[#6046B5] outline-none transition-all text-sm bg-white shadow-sm disabled:bg-gray-50"
                    value={formData.charge_category}
                    onChange={(e) => setFormData({
                      ...formData,
                      charge_category: e.target.value,
                      charge_name: "",
                      standard_charge: 0,
                      tax_percent: 0
                    })}
                    disabled={!formData.charge_type}
                  >
                    <option value="">Select Category</option>
                    {chargeCategories
                      .filter(c => c.charge_type_name === formData.charge_type)
                      .map(c => <option key={c.id} value={c.category_name}>{c.category_name}</option>)
                    }
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Charge Name <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border border-gray-300 px-2 py-2 rounded focus:ring-1 focus:ring-[#6046B5] outline-none transition-all text-sm bg-white shadow-sm disabled:bg-gray-50"
                    value={formData.charge_name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const c = hospitalCharges.find(h => h.charge_name === name);
                      setFormData({
                        ...formData,
                        charge_name: name,
                        standard_charge: c?.charge_amount || 0,
                        tax_percent: c?.tax || 0
                      });
                    }}
                    disabled={!formData.charge_category}
                  >
                    <option value="">Select Charge</option>
                    {hospitalCharges
                      .filter(h => h.charge_category === formData.charge_category)
                      .map(c => <option key={c.id} value={c.charge_name}>{c.charge_name}</option>)
                    }
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Standard Charge ($)</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full border border-gray-300 px-2 py-2 rounded focus:ring-1 focus:ring-[#6046B5] outline-none transition-all text-sm bg-white shadow-sm disabled:bg-gray-50"
                    value={formData.standard_charge}
                  />
                </div>
              </div>

              {/* Summary and Entry Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Left: Financial Summary */}
                <div className="space-y-4 bg-gray-50/50 p-6 rounded-2xl border border-gray-300">
                  <h4 className="text-sm font-bold text-gray-400 mb-4">Financial Summary</h4>
                  <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span className="text-base font-bold text-gray-600">Total Basis ($)</span>
                    <span className="text-xl font-bold font-outfit text-gray-900">{currentFin.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-300">
                    <span className="text-base font-bold text-gray-600">Discount (%)</span>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1 bg-white border border-gray-300 focus:ring-1 focus:ring-[#6046B5] rounded px-2">
                        <input
                          type="number"
                          className="w-16 outline-none text-right text-sm py-1 font-bold"
                          value={formData.discount_percent}
                          onChange={(e) => setFormData({ ...formData, discount_percent: Number(e.target.value) })}
                        />
                        <span className="text-xs text-gray-400 font-bold">%</span>
                      </div>
                      <span className="font-bold text-base text-gray-900 w-24 text-right">{currentFin.discountVal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-300"  >
                    <span className="text-base font-bold text-gray-600">Tax (%)</span>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1 bg-white border border-gray-300 focus:ring-1 focus:ring-[#6046B5] rounded px-2 font-bold">
                        <input
                          type="number"
                          className="w-16 outline-none text-right text-sm py-1 font-bold"
                          value={formData.tax_percent}
                          onChange={(e) => setFormData({ ...formData, tax_percent: Number(e.target.value) })}
                        />
                        <span className="text-xs text-gray-400 font-bold">%</span>
                      </div>
                      <span className="font-bold text-base text-gray-900 w-24 text-right">{currentFin.taxVal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-5 bg-purple-50 px-6 rounded-xl border border-purple-100 mt-6">
                    <span className="text-xl font-bold text-[#6046B5]">Net Amount</span>
                    <span className="text-xl font-bold text-[#6046B5] font-outfit">
                      {currentFin.netAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Right: Notes and Date */}
                <div className="flex flex-col h-full">
                  <div className="flex-grow space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Charge Note</label>
                      <textarea
                        className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-1 focus:ring-[#6046B5] h-32 resize-none text-sm transition-all shadow-sm"
                        placeholder="Add operation/service notes..."
                        value={formData.charge_note}
                        onChange={(e) => setFormData({ ...formData, charge_note: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Date <span className="text-red-500">*</span></label>
                        <input
                          type="date"
                          className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:ring-1 focus:ring-[#6046B5] text-sm bg-white shadow-sm"
                          value={formData.charge_date}
                          onChange={(e) => setFormData({ ...formData, charge_date: e.target.value })}
                        />
                      </div>
                      <div className="flex items-end pb-1">
                        <button
                          onClick={addToPending}
                          className=" bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-3 py-2 rounded flex items-center justify-center"
                        >
                          <Plus size={20} /> ADD TO LIST
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* List Section */}
              <div className="mt-4 rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white">
                <div className="bg-gray-100/80 px-6 py-4 flex justify-between items-center">
                  <h4 className="font-bold text-gray-700 flex items-center gap-2">
                    Pending Charges Queue
                    <span className="bg-[#6046B5] text-white text-[10px] px-2 py-0.5 rounded-full">{pendingCharges.length}</span>
                  </h4>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 text-gray-500 font-bold sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left">Date</th>
                        <th className="px-3 py-2 text-left">Type</th>
                        <th className="px-3 py-2 text-left">Category</th>
                        <th className="px-3 py-2 text-left">Name</th>
                        <th className="px-3 py-2 text-left">Standard</th>
                        <th className="px-3 py-2 text-left">Net Amount</th>
                        <th className="px-3 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pendingCharges.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-20 text-center text-gray-400 italic">
                            <Plus className="mx-auto mb-4 opacity-10" size={48} />
                            No charges added to the list yet.
                          </td>
                        </tr>
                      ) : (
                        pendingCharges.map((c, i) => {
                          const f = calculateFinancials(c);
                          return (
                            <tr key={i} className="hover:bg-purple-50/30 transition-colors bg-white border-b border-gray-100">
                              <td className="px-3 py-2">{c.charge_date}</td>
                              <td className="px-3 py-2">{c.charge_type}</td>
                              <td className="px-3 py-2">{c.charge_category}</td>
                              <td className="px-3 py-2">{c.charge_name}</td>
                              <td className="px-3 py-2 text-left">{c.standard_charge.toFixed(2)}</td>
                              <td className="px-3 py-2 text-left">{f.netAmount.toFixed(2)}</td>
                              <td className="px-3 py-2 text-left">
                                <button
                                  onClick={() => setPendingCharges(pendingCharges.filter((_, idx) => idx !== i))}
                                  className="text-red-600  p-1 hover:bg-red-100 rounded"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-10 py-6 flex justify-end gap-4 border-t border-gray-300">
            <button
              onClick={handleSaveAll}
              disabled={loading || pendingCharges.length === 0}
              className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-5 py-2 rounded flex items-center justify-center gap-2 shadow-xl hover:opacity-90 disabled:opacity-50 transition-all font-bold"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
              SAVE ALL CHARGES
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL - Redesigned to match Add Modal */}
      {showEditModal && selectedCharge && (
        <div className="fixed inset-0 z-[70] bg-white animate-in fade-in transition-all flex flex-col">
          <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center text-white shrink-0">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Pencil size={24} />
              Edit Charge Record
            </h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X size={28} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-10 bg-white">
            <div className="max-w-7xl mx-auto space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Charge Type <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition-all text-sm bg-white shadow-sm"
                    value={selectedCharge.charge_type}
                    onChange={(e) => setSelectedCharge({
                      ...selectedCharge,
                      charge_type: e.target.value,
                      charge_category: "",
                      charge_name: "",
                      standard_charge: 0,
                      tax_percent: 0,
                      discount: 0,
                      discount_percent: 0,
                      tax: 0,
                      amount: 0
                    })}
                  >
                    <option value="">Select Type</option>
                    {chargeTypes.map(t => <option key={t.id} value={t.charge_type}>{t.charge_type}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Charge Category <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition-all text-sm bg-white shadow-sm disabled:bg-gray-50"
                    value={selectedCharge.charge_category}
                    onChange={(e) => setSelectedCharge({
                      ...selectedCharge,
                      charge_category: e.target.value,
                      charge_name: "",
                      standard_charge: 0,
                      tax_percent: 0,
                      discount: 0,
                      discount_percent: 0,
                      tax: 0,
                      amount: 0
                    })}
                    disabled={!selectedCharge.charge_type}
                  >
                    <option value="">Select Category</option>
                    {chargeCategories
                      .filter(c => c.charge_type_name === selectedCharge.charge_type)
                      .map(c => <option key={c.id} value={c.category_name}>{c.category_name}</option>)
                    }
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Charge Name <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition-all text-sm bg-white shadow-sm disabled:bg-gray-50"
                    value={selectedCharge.charge_name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const c = hospitalCharges.find(h => h.charge_name === name);
                      setSelectedCharge({
                        ...selectedCharge,
                        charge_name: name,
                        standard_charge: c?.charge_amount || selectedCharge.standard_charge,
                        tax_percent: c?.tax || selectedCharge.tax_percent || 0
                      });
                    }}
                    disabled={!selectedCharge.charge_category}
                  >
                    <option value="">Select Charge</option>
                    {hospitalCharges
                      .filter(h => h.charge_category === selectedCharge.charge_category)
                      .map(c => <option key={c.id} value={c.charge_name}>{c.charge_name}</option>)
                    }
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Standard Charge ($)</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 outline-none text-sm font-bold text-purple-600 shadow-sm"
                    value={selectedCharge.standard_charge}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 ">
                <div className="space-y-4 bg-gray-50/50 p-8 rounded-2xl border border-gray-100">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Financial Summary</h4>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-base font-bold text-gray-600">Total Basis ($)</span>
                    <span className="text-xl font-bold font-outfit text-gray-900 pr-4">
                      ${Number(selectedCharge.standard_charge || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-base font-bold text-gray-600">Discount (%)</span>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2">
                        <input
                          type="number"
                          className="w-16 outline-none text-right text-sm py-1 font-bold"
                          value={selectedCharge.discount_percent || 0}
                          onChange={(e) => {
                            const discountPercent = Number(e.target.value);
                            const total = selectedCharge.standard_charge || 0;
                            const discountVal = (total * discountPercent) / 100;
                            setSelectedCharge({
                              ...selectedCharge,
                              discount_percent: discountPercent,
                              discount: discountVal
                            });
                          }}
                        />
                        <span className="text-xs text-gray-400 font-bold">%</span>
                      </div>
                      <span className="font-bold text-base text-gray-900 w-24 text-right">
                        -${(Number(selectedCharge.standard_charge || 0) * Number(selectedCharge.discount_percent || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-base font-bold text-gray-600">Tax (%)</span>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded px-2">
                        <input
                          type="number"
                          className="w-16 outline-none text-right text-sm py-1 font-bold"
                          value={selectedCharge.tax_percent || 0}
                          onChange={(e) => {
                            const taxPercent = Number(e.target.value);
                            const total = selectedCharge.standard_charge || 0;
                            const discountVal = (total * (selectedCharge.discount_percent || 0)) / 100;
                            const subtotal = total - discountVal;
                            const taxVal = (subtotal * taxPercent) / 100;
                            setSelectedCharge({
                              ...selectedCharge,
                              tax_percent: taxPercent,
                              tax: taxVal
                            });
                          }}
                        />
                        <span className="text-xs text-gray-400 font-bold font-bold">%</span>
                      </div>
                      <span className="font-bold text-base text-gray-900 w-24 text-right">
                        +${(() => {
                          const total = Number(selectedCharge.standard_charge || 0);
                          const discountVal = (total * Number(selectedCharge.discount_percent || 0)) / 100;
                          const subtotal = total - discountVal;
                          const taxVal = (subtotal * Number(selectedCharge.tax_percent || 0)) / 100;
                          return taxVal.toFixed(2);
                        })()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-5 bg-purple-50 px-6 rounded-xl border border-purple-100 mt-6">
                    <span className="text-xl font-bold text-[#6046B5]">Net Amount ($)</span>
                    <span className="text-3xl font-bold text-[#6046B5] font-outfit">
                      ${(() => {
                        const total = Number(selectedCharge.standard_charge || 0);
                        const discountVal = (total * Number(selectedCharge.discount_percent || 0)) / 100;
                        const subtotal = total - discountVal;
                        const taxVal = (subtotal * Number(selectedCharge.tax_percent || 0)) / 100;
                        const netAmount = subtotal + taxVal;
                        // Note: we'll update the final amount in selectedCharge upon Save
                        return netAmount.toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>

                <div className="space-y-6 flex flex-col">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Change Date <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:ring-2 focus:ring-purple-400 text-sm bg-white shadow-sm"
                      value={selectedCharge.charge_date}
                      onChange={(e) => setSelectedCharge({ ...selectedCharge, charge_date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Charge Note</label>
                    <textarea
                      className="w-full border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 h-32 resize-none text-sm shadow-sm"
                      placeholder="Update charge notes..."
                      value={selectedCharge.charge_note}
                      onChange={(e) => setSelectedCharge({ ...selectedCharge, charge_note: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-10 py-6 border-t flex justify-end gap-4 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-10 py-3 rounded-xl border border-gray-300 text-gray-600 font-bold text-sm hover:bg-white active:bg-gray-100 transition shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                const total = Number(selectedCharge.standard_charge || 0);
                const discountVal = (total * Number(selectedCharge.discount_percent || 0)) / 100;
                const subtotal = total - discountVal;
                const taxVal = (subtotal * Number(selectedCharge.tax_percent || 0)) / 100;
                const netAmount = subtotal + taxVal;
                setSelectedCharge({ ...selectedCharge, amount: netAmount });
                handleUpdate();
              }}
              disabled={loading}
              className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-16 py-3 rounded-xl flex items-center justify-center gap-2 shadow-xl hover:opacity-90 transition-all transform active:scale-95 font-bold"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
              UPDATE CHARGE RECORD
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
