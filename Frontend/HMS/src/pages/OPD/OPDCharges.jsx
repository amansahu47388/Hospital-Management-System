import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import OPDNavbar from "../../components/OPDComponent/OPDNavbar";
import { Plus, Trash2, FileIcon as FilePdf, X, CheckCircle,Pencil, Loader2} from "lucide-react";
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

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-800">
                <tr>
                  <th className="px-4 py-3 text-sm">Date</th>
                  <th className="px-4 py-3 text-sm">Charge Name</th>
                  <th className="px-4 py-3 text-sm">Charge Type</th>
                  <th className="px-4 py-3 text-sm">Charge Category</th>
                  <th className="px-4 py-3 text-sm">Standard Charge($)</th>
                  <th className="px-4 py-3 text-sm">Discount($)</th>
                  <th className="px-4 py-3 text-sm">Tax($)</th>
                  <th className="px-4 py-3 text-sm">Amount($)</th>
                  <th className="px-4 py-3 text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white border-b border-gray-200 divide-y divide-gray-100">
                {loading && charges.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-10 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        <span>Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : charges.length > 0 ? (
                  charges.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors font-medium font-outfit">
                      <td className="px-4 py-4 text-sm ">{row.charge_date}</td>
                      <td className="px-4 py-4 text-sm ">{row.charge_name}</td>
                      <td className="px-4 py-4 text-sm ">{row.charge_type}</td>
                      <td className="px-4 py-4 text-sm ">{row.charge_category}</td>
                      <td className="px-4 py-4 text-sm ">${Number(row.standard_charge).toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm ">${Number(row.discount).toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm ">${Number(row.tax).toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm font-bold text-gray-900">${Number(row.amount).toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm ">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenEdit(row)}
                            className="hover:bg-purple-200 text-purple-600 p-1.5 rounded transition shadow-sm"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="hover:bg-red-200 text-red-600 p-1.5 rounded transition shadow-sm"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-10 text-center text-gray-500">
                      {patientId ? "No records found" : "Resolving Patient..."}
                    </td>
                  </tr>
                )}
                {charges.length > 0 && (
                  <tr className="bg-gray-50 font-bold">
                    <td colSpan="7" className="px-4 py-4 text-right">Grand Total:</td>
                    <td className="px-4 py-4 text-gray-900">
                      ${charges.reduce((sum, c) => sum + Number(c.amount), 0).toFixed(2)}
                    </td>
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
          {/* Header - Solid Blue as per image */}
          <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] px-4 py-3 flex justify-between items-center text-white shrink-0">
            <h3 className="text-lg font-bold ">Add Charges</h3>
            <div className="flex items-center gap-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Body - Flex Grow to take available space */}
          <div className="flex-grow overflow-y-auto p-6">
            <div className="max-w-8xl mx-auto space-y-8">
              {/* Row 1: Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="space-y-1.5 font-outfit">
                  <label className="block text-sm font-bold text-gray-500">Charge Type <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
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
                <div className="space-y-1.5 font-outfit">
                  <label className="block text-sm  font-bold text-gray-500 ">Charge Category <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
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
                <div className="space-y-1.5 font-outfit">
                  <label className="block text-sm font-bold text-gray-500 ">Charge Name <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
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
                <div className="space-y-1.5 font-outfit">
                  <label className="block text-sm font-bold text-gray-500 ">Standard Charge ($)</label>
                  <input
                    type="number"
                    readOnly
                    className="w-full border p-2 rounded bg-gray-50 outline-none text-sm font-bold text-blue-600"
                    value={formData.standard_charge}
                  />
                </div>
              </div>

              {/* Row 2: Summary and Note */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-3 pr-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-bold text-gray-600">Total ($)</span>
                    <span className="text-lg font-bold underline font-outfit text-gray-900 pr-4">{currentFin.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b gap-4">
                    <span className="text-sm font-bold text-gray-600">Discount (%)</span>
                    <div className="flex items-center gap-4 w-1/2 justify-end">
                      <div className="flex items-center gap-1 border-b">
                        <input
                          type="number"
                          className="w-16 outline-none text-right text-sm py-1"
                          value={formData.discount_percent}
                          onChange={(e) => setFormData({ ...formData, discount_percent: Number(e.target.value) })}
                        />
                        <span className="text-[10px] text-gray-400 font-bold">%</span>
                      </div>
                      <span className="font-bold text-sm w-20 text-right">${currentFin.discountVal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b gap-4">
                    <span className="text-sm font-bold text-gray-600">Tax (%)</span>
                    <div className="flex items-center gap-4 w-1/2 justify-end">
                      <div className="flex items-center gap-1 border-b">
                        <input
                          type="number"
                          className="w-16 outline-none text-right text-sm py-1"
                          value={formData.tax_percent}
                          onChange={(e) => setFormData({ ...formData, tax_percent: Number(e.target.value) })}
                        />
                        <span className="text-[10px] text-gray-400 font-bold">%</span>
                      </div>
                      <span className="font-bold text-sm w-20 text-right">${currentFin.taxVal.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-4 bg-blue-50/50 px-4 rounded-lg">
                    <span className="text-lg font-bold text-purple-600">Net Amount ($)</span>
                    <span className="text-2xl font-bold text-purple-600 font-outfit">
                      ${currentFin.netAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 relative flex flex-col">
                  <div className="flex-grow space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-500  mb-2">Charge Note</label>
                      <textarea
                        className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 h-32 resize-none text-sm placeholder:italic"
                        placeholder="Add some notes about this charge..."
                        value={formData.charge_note}
                        onChange={(e) => setFormData({ ...formData, charge_note: e.target.value })}
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-bold text-gray-500  mb-2">Date <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
                        value={formData.charge_date}
                        onChange={(e) => setFormData({ ...formData, charge_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={addToPending}
                      className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-8 py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:opacity-90 transition font-bold text-sm"
                    >
                      <Plus size={18} /> ADD TO LIST
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 3: Table for pending charges */}
              <div className="mt-8  rounded-xl overflow-hidden shadow-sm bg-white">
                <div className="bg-gray-50/80 px-4 py-3">
                  <h4 className="font-bold text-gray-70 ">Charges List ({pendingCharges.length})</h4>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-200 font-bold  sticky top-0">
                      <tr>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Type</th>
                        <th className="p-3 text-left">Category</th>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Standard Charge</th>
                        <th className="p-3 text-left">Net Amount</th>
                        <th className="p-3 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody className="border-b border-gray-200">
                      {pendingCharges.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-12 text-center text-gray-400 italic text-sm">
                            <Plus className="mx-auto mb-2 opacity-20" size={32} />
                            No charges added to the list. Use the form above to add charges.
                          </td>
                        </tr>
                      ) : (
                        pendingCharges.map((c, i) => {
                          const f = calculateFinancials(c);
                          return (
                            <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                              <td className="p-3 font-medium">{c.charge_date}</td>
                              <td className="p-3 ">{c.charge_type}</td>
                              <td className="p-3 ">{c.charge_category}</td>
                              <td className="p-3">{c.charge_name}</td>
                              <td className="p-3">${c.standard_charge.toFixed(2)} </td>
                              <td className="p-3">${f.netAmount.toFixed(2)} </td>
                              <td className="p-3">
                                <button
                                  onClick={() => setPendingCharges(pendingCharges.filter((_, idx) => idx !== i))}
                                  className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-lg transition-all"
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
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-8 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-sm hover:bg-white active:bg-gray-100 transition shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              disabled={loading || pendingCharges.length === 0}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-12 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
              Save charges
            </button>
          </div>
        </div>
      )}

      {/* EDIT MODAL - Full Screen (Same design as Add Modal) */}
      {showEditModal && selectedCharge && (
        <div className="fixed inset-0 z-[70] bg-white animate-in fade-in transition-all flex flex-col">
          {/* Header - Same as Add Modal */}
          <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] px-4 py-3 flex justify-between items-center text-white shrink-0">
            <h3 className="text-lg font-bold">Edit Charge</h3>
            <button
              onClick={() => setShowEditModal(false)}
              className="hover:bg-white/20 p-1 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body - Scrollable */}
          <div className="flex-grow overflow-y-auto p-6">
            <div className="max-w-8xl mx-auto space-y-8">
              {/* Row 1: Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="space-y-1.5 font-outfit">
                  <label className="block text-sm font-bold text-gray-500">Charge Type <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
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
                <div className="space-y-1.5 font-outfit">
                  <label className="block text-sm font-bold text-gray-500">Charge Category <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
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
                <div className="space-y-1.5 font-outfit">
                  <label className="block text-sm font-bold text-gray-500">Charge Name <span className="text-red-500">*</span></label>
                  <select
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
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
                <div className="space-y-1.5 font-outfit">
                  <label className="block text-sm font-bold text-gray-500">Standard Charge ($)</label>
                  <input
                    type="number"
                    className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400 text-sm font-bold text-blue-600"
                    value={selectedCharge.standard_charge}
                    onChange={(e) => setSelectedCharge({ ...selectedCharge, standard_charge: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Row 2: Financial Summary and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left: Financial Summary */}
                <div className="space-y-3 pr-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm font-bold text-gray-600">Total ($)</span>
                    <span className="text-lg font-bold underline font-outfit text-gray-900 pr-4">
                      {Number(selectedCharge.standard_charge || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b gap-4">
                    <span className="text-sm font-bold text-gray-600">Discount (%)</span>
                    <div className="flex items-center gap-4 w-1/2 justify-end">
                      <div className="flex items-center gap-1 border-b">
                        <input
                          type="number"
                          className="w-16 outline-none text-right text-sm py-1"
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
                        <span className="text-[10px] text-gray-400 font-bold">%</span>
                      </div>
                      <span className="font-bold text-sm w-20 text-right">
                        ${(Number(selectedCharge.standard_charge || 0) * Number(selectedCharge.discount_percent || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b gap-4">
                    <span className="text-sm font-bold text-gray-600">Tax (%)</span>
                    <div className="flex items-center gap-4 w-1/2 justify-end">
                      <div className="flex items-center gap-1 border-b">
                        <input
                          type="number"
                          className="w-16 outline-none text-right text-sm py-1"
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
                        <span className="text-[10px] text-gray-400 font-bold">%</span>
                      </div>
                      <span className="font-bold text-sm w-20 text-right">
                        ${(() => {
                          const total = Number(selectedCharge.standard_charge || 0);
                          const discountVal = (total * Number(selectedCharge.discount_percent || 0)) / 100;
                          const subtotal = total - discountVal;
                          const taxVal = (subtotal * Number(selectedCharge.tax_percent || 0)) / 100;
                          return taxVal.toFixed(2);
                        })()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-4 bg-blue-50/50 px-4 rounded-lg">
                    <span className="text-lg font-bold text-purple-600">Net Amount ($)</span>
                    <span className="text-2xl font-bold text-purple-600 font-outfit">
                      ${(() => {
                        const total = Number(selectedCharge.standard_charge || 0);
                        const discountVal = (total * Number(selectedCharge.discount_percent || 0)) / 100;
                        const subtotal = total - discountVal;
                        const taxVal = (subtotal * Number(selectedCharge.tax_percent || 0)) / 100;
                        const netAmount = subtotal + taxVal;
                        // Update amount in selectedCharge
                        if (Number(selectedCharge.amount) !== netAmount) {
                          setTimeout(() => setSelectedCharge({ ...selectedCharge, amount: netAmount }), 0);
                        }
                        return netAmount.toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>

                {/* Right: Notes and Date */}
                <div className="space-y-4 relative flex flex-col">
                  <div className="flex-grow space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">Charge Note</label>
                      <textarea
                        className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 h-32 resize-none text-sm placeholder:italic"
                        placeholder="Add some notes about this charge..."
                        value={selectedCharge.charge_note || ''}
                        onChange={(e) => setSelectedCharge({ ...selectedCharge, charge_note: e.target.value })}
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-bold text-gray-500 mb-2">Date <span className="text-red-500">*</span></label>
                      <input
                        type="date"
                        className="w-full border p-2 rounded outline-none focus:ring-2 focus:ring-blue-400 text-sm bg-white"
                        value={selectedCharge.charge_date}
                        onChange={(e) => setSelectedCharge({ ...selectedCharge, charge_date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t shrink-0">
            <button
              onClick={() => setShowEditModal(false)}
              className="px-8 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold text-sm hover:bg-white active:bg-gray-100 transition shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-8 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
              SAVE UPDATED CHANGES
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
