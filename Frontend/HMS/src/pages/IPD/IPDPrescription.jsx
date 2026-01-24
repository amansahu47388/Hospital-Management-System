import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import { Pencil, Trash2, Plus, X, Save, Eye, ClipboardList, Stethoscope, Loader2 } from "lucide-react";
import { getPrescriptions, createPrescription, updatePrescription, deletePrescription, } from "../../api/ipdApi";
import { getMedicineCategories, getMedicines, getMedicineDosages, getDosages } from "../../api/pharmacyApi";
import { getDoctors } from "../../api/appointmentApi";
import { getFindings, getFindingCategories } from "../../api/setupApi";
import { getPathologyTests } from "../../api/pathologyApi";
import { getRadiologyTests } from "../../api/radiologyApi";
import { useNotify } from "../../context/NotificationContext";

export default function IPDPrescription() {
  const { ipdId } = useParams();
  const notify = useNotify();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showView, setShowView] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewPrescription, setViewPrescription] = useState(null);

  // Dropdown Data
  const [dropdowns, setDropdowns] = useState({
    doctors: [],
    categories: [],
    medicines: [],
    dosages: [],
    intervals: [],
    findings: [],
    findingCategories: [],
    pathology: [],
    radiology: [],
  });

  // Form State
  const [medicines, setMedicines] = useState([
    { medicine_category: "", medicine: "", medicine_dosage: "", dosage: "", instruction: "" }
  ]);
  const [formData, setFormData] = useState({
    prescribed_by: "",
    pathology: [],
    radiology: [],
    findings: "",
    findingCategory: "",
    finding_description: "",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        prescRes,
        docRes,
        catRes,
        medRes,
        doseRes,
        intervalRes,
        findingRes,
        findingCatRes,
        pathRes,
        radRes
      ] = await Promise.all([
        getPrescriptions({ ipd_patient: ipdId }),
        getDoctors(),
        getMedicineCategories(),
        getMedicines(),
        getMedicineDosages(),
        getDosages(),
        getFindings(),
        getFindingCategories(),
        getPathologyTests(),
        getRadiologyTests()
      ]);

      setPrescriptions(prescRes.data);
      setDropdowns({
        doctors: docRes.data,
        categories: catRes.data,
        medicines: medRes.data,
        dosages: doseRes.data,
        intervals: intervalRes.data,
        findings: findingRes.data,
        findingCategories: findingCatRes.data,
        pathology: pathRes.data,
        radiology: radRes.data,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      notify("error", "Failed to load prescription data");
    } finally {
      setIsLoading(false);
    }
  }, [ipdId, notify]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addMedicineRow = () => {
    setMedicines([...medicines, { medicine_category: "", medicine: "", medicine_dosage: "", dosage: "", instruction: "" }]);
  };

  const removeMedicineRow = (index) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const resetForm = () => {
    setMedicines([{ medicine_category: "", medicine: "", medicine_dosage: "", dosage: "", instruction: "" }]);
    setFormData({
      prescribed_by: "",
      pathology: [],
      radiology: [],
      findings: "",
      findingCategory: "",
      finding_description: "",
    });
    setEditId(null);
  };

  const toggleMultiSelect = (field, id) => {
    setFormData(prev => {
      const current = prev[field] || [];
      const updated = current.includes(id)
        ? current.filter(item => item !== id)
        : [...current, id];
      return { ...prev, [field]: updated };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.prescribed_by) {
      notify("error", "Please select a doctor");
      setIsSubmitting(false);
      return;
    }
    if (!formData.findings) {
      notify("error", "Please select a finding");
      setIsSubmitting(false);
      return;
    }
    if (!formData.findingCategory) {
      notify("error", "Please select a finding category");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        ipd_patient: ipdId,
        prescribed_by: formData.prescribed_by || null,
        findings: formData.findings || null,
        medicines: medicines.map(m => ({
          ...m,
          medicine_category: m.medicine_category || null,
          medicine: m.medicine || null,
          medicine_dosage: m.medicine_dosage || null,
          dosage: m.dosage || null,
        }))
      };

      if (editId) {
        await updatePrescription(editId, payload);
        notify("success", "Prescription updated successfully");
      } else {
        await createPrescription(payload);
        notify("success", "Prescription added successfully");
      }
      setShowAdd(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Save error:", error);
      notify("error", "Failed to save prescription");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (presc) => {
    setEditId(presc.id);
    setFormData({
      prescribed_by: presc.prescribed_by || "",
      pathology: presc.pathology || [],
      radiology: presc.radiology || [],
      findings: presc.findings || "",
      findingCategory: "",
      finding_description: presc.finding_description || "",
    });
    setMedicines(presc.medicines.map(m => ({
      id: m.id,
      medicine_category: m.medicine_category || "",
      medicine: m.medicine || "",
      medicine_dosage: m.medicine_dosage || "",
      dosage: m.dosage || "",
      instruction: m.instruction || ""
    })));
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      try {
        await deletePrescription(id);
        notify("success", "Prescription deleted successfully");
        fetchData();
      } catch (error) {
        notify("error", "Failed to delete prescription");
      }
    }
  };

  const handleView = (presc) => {
    setViewPrescription(presc);
    setShowView(true);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-blue-600" size={40} />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50/50">
        <IPDTabsNavbar />

        {/* LIST PAGE */}
        <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ClipboardList size={20} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Prescription</h2>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowAdd(true);
                }}
                className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-[#1976D2] text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-sm font-semibold text-sm"
              >
                <Plus size={18} /> Add Prescription
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="p-4 text-left">Prescription No</th>
                    <th className="p-4 text-left">Date</th>
                    <th className="p-4 text-left">Finding</th>
                    <th className="p-4 text-left">Prescribed By</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {prescriptions.map((presc) => (
                    <tr key={presc.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-medium text-blue-600">PRE-{presc.id}</td>
                      <td className="p-4 text-gray-600">{new Date(presc.created_at).toLocaleDateString()}</td>
                      <td className="p-4 text-gray-600">
                        {presc.finding_name || "N/A"}
                      </td>
                      <td className="p-4 text-gray-600">
                        {presc.prescribed_by_details?.name || "N/A"}
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button
                          onClick={() => handleView(presc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(presc)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(presc.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {prescriptions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="p-8 text-center text-gray-400">
                        No prescriptions found for this patient.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ADD/EDIT PRESCRIPTION MODAL */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-start overflow-y-auto pt-10 pb-10 px-4 backdrop-blur-sm">
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <form onSubmit={handleSave}>
                <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] px-6 py-4 flex justify-between items-center text-white shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white/20 rounded-lg">
                      <Stethoscope size={20} />
                    </div>
                    <h3 className="text-lg font-bold">{editId ? "Edit Prescription" : "Add Prescription"}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="hover:bg-white/20 p-1.5 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    {/* MAIN FORM - LEFT SIDE */}
                    <div className="flex-grow space-y-8">
                      {/* FINDINGS SECTION */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        <div className="space-y-1.5">
                          <label className="text-[12px] font-bold text-gray-500 uppercase">Finding Category</label>
                          <select
                            className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            value={formData.findingCategory}
                            onChange={(e) => setFormData({ ...formData, findingCategory: e.target.value, findings: "", finding_description: "" })}
                          >
                            <option value="">Select Category</option>
                            {dropdowns.findingCategories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[12px] font-bold text-gray-500 uppercase">Findings</label>
                          <select
                            className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            value={formData.findings}
                            onChange={(e) => {
                              const findingId = parseInt(e.target.value);
                              const selectedFinding = dropdowns.findings.find(f => f.id === findingId);
                              setFormData({
                                ...formData,
                                findings: e.target.value,
                                finding_description: selectedFinding ? (selectedFinding.description || selectedFinding.finding_description || "") : ""
                              });
                            }}
                          >
                            <option value="">Select Finding</option>
                            {dropdowns.findings
                              .filter(f => {
                                if (!formData.findingCategory) return true;
                                const selectedCat = dropdowns.findingCategories.find(c => String(c.id) === String(formData.findingCategory));
                                return String(f.finding_category) === String(formData.findingCategory) ||
                                  (selectedCat && (f.finding_category === selectedCat.category_name));
                              })
                              .map(f => (
                                <option key={f.id} value={f.id}>{f.finding_name || f.name || "Unnamed Finding"}</option>
                              ))}
                          </select>
                        </div>
                        <div className="space-y-1.5 md:col-span-1">
                          <label className="text-[12px] font-bold text-gray-500 uppercase">Finding Description</label>
                          <textarea
                            className="w-full border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all h-[38px] resize-none"
                            placeholder="Description"
                            value={formData.finding_description}
                            onChange={(e) => setFormData({ ...formData, finding_description: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* MEDICINE DYNAMIC SECTION */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-gray-700 flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded-full"></div>
                            Medicines
                          </h4>
                        </div>
                        <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                  <th className="p-3 text-left font-bold text-gray-600">Medicine Category</th>
                                  <th className="p-3 text-left font-bold text-gray-600">Medicine</th>
                                  <th className="p-3 text-left font-bold text-gray-600">Dose</th>
                                  <th className="p-3 text-left font-bold text-gray-600">Interval / Duration</th>
                                  <th className="p-3 text-left font-bold text-gray-600">Instruction</th>
                                  <th className="p-3 text-center font-bold text-gray-600 w-12">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {medicines.map((med, index) => (
                                  <tr key={index} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="p-2">
                                      <select
                                        className="w-full border-gray-200 border rounded-lg p-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                        value={med.medicine_category}
                                        onChange={(e) => handleMedicineChange(index, "medicine_category", e.target.value)}
                                      >
                                        <option value="">Select</option>
                                        {dropdowns.categories.map(c => (
                                          <option key={c.id} value={c.id}>{c.category_name}</option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="p-2">
                                      <select
                                        className="w-full border-gray-200 border rounded-lg p-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                        value={med.medicine}
                                        onChange={(e) => handleMedicineChange(index, "medicine", e.target.value)}
                                      >
                                        <option value="">Select</option>
                                        {dropdowns.medicines
                                          .filter(m => !med.medicine_category || String(m.category) === String(med.medicine_category))
                                          .map(m => (
                                            <option key={m.id} value={m.id}>{m.name}</option>
                                          ))}
                                      </select>
                                    </td>
                                    <td className="p-2">
                                      <select
                                        className="w-full border-gray-200 border rounded-lg p-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                        value={med.medicine_dosage}
                                        onChange={(e) => handleMedicineChange(index, "medicine_dosage", e.target.value)}
                                      >
                                        <option value="">Select</option>
                                        {dropdowns.dosages
                                          .filter(d => !med.medicine_category || String(d.category_name) === String(med.medicine_category))
                                          .map(d => (
                                            <option key={d.id} value={d.id}>{d.dosage} {d.unit_name}</option>
                                          ))}
                                      </select>
                                    </td>
                                    <td className="p-2">
                                      <select
                                        className="w-full border-gray-200 border rounded-lg p-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                        value={med.dosage}
                                        onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                                      >
                                        <option value="">Select</option>
                                        {dropdowns.intervals.map(i => (
                                          <option key={i.id} value={i.id}>{i.dosage_interval} / {i.dosage_duration}</option>
                                        ))}
                                      </select>
                                    </td>
                                    <td className="p-2">
                                      <input
                                        className="w-full border-gray-200 border rounded-lg p-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                                        placeholder="Instruction"
                                        value={med.instruction}
                                        onChange={(e) => handleMedicineChange(index, "instruction", e.target.value)}
                                      />
                                    </td>
                                    <td className="p-2 text-center">
                                      <button
                                        type="button"
                                        onClick={() => removeMedicineRow(index)}
                                        className={`p-1.5 transition-colors rounded-lg ${medicines.length > 1 ? "text-red-400 hover:text-red-600 hover:bg-red-50" : "text-gray-200 cursor-not-allowed"}`}
                                        disabled={medicines.length <= 1}
                                      >
                                        <X size={16} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={addMedicineRow}
                          className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-[#1976D2] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm mt-4"
                        >
                          <Plus size={14} /> Add Medicine
                        </button>
                      </div>
                    </div>


                    {/* SIDEBAR - RIGHT SIDE */}
                    <div className="w-full lg:w-80 shrink-0 space-y-6">
                      <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 shadow-inner">
                        <div className="space-y-1.5">
                          <label className="text-[12px] font-bold text-gray-500 uppercase">Prescribe By <span className="text-red-500">*</span></label>
                          <select
                            className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white shadow-sm"
                            required
                            value={formData.prescribed_by}
                            onChange={(e) => setFormData({ ...formData, prescribed_by: e.target.value })}
                          >
                            <option value="">Select Doctor</option>
                            {dropdowns.doctors.map(doc => (
                              <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[12px] font-bold text-gray-500 uppercase">Pathology</label>
                          <div className="relative">
                            <select
                              className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white shadow-sm"
                              value=""
                              onChange={(e) => toggleMultiSelect("pathology", parseInt(e.target.value))}
                            >
                              <option value="">Select Tests</option>
                              {dropdowns.pathology.map(t => (
                                <option key={t.id} value={t.id}>{t.test_name}</option>
                              ))}
                            </select>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {formData.pathology.map(id => {
                                const test = dropdowns.pathology.find(t => t.id === id);
                                return (
                                  <span key={id} className="bg-blue-100 text-[#6046B5] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-blue-200">
                                    {test?.test_name}
                                    <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => toggleMultiSelect("pathology", id)} />
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[12px] font-bold text-gray-500 uppercase">Radiology</label>
                          <div className="relative">
                            <select
                              className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-white shadow-sm"
                              value=""
                              onChange={(e) => toggleMultiSelect("radiology", parseInt(e.target.value))}
                            >
                              <option value="">Select Tests</option>
                              {dropdowns.radiology.map(t => (
                                <option key={t.id} value={t.id}>{t.test_name}</option>
                              ))}
                            </select>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {formData.radiology.map(id => {
                                const test = dropdowns.radiology.find(t => t.id === id);
                                return (
                                  <span key={id} className="bg-purple-100 text-[#6046B5] px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-purple-200">
                                    {test?.test_name}
                                    <X size={10} className="cursor-pointer hover:text-red-500" onClick={() => toggleMultiSelect("radiology", id)} />
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FOOTER ACTIONS */}
                <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAdd(false)}
                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold text-sm hover:bg-white transition-all shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-[#1976D2] text-white px-8 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md font-bold text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* VIEW PRESCRIPTION MODAL - REDESIGNED */}
        {showView && viewPrescription && (
          <div className="fixed inset-0 bg-black/60 z-[100] flex justify-center items-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-5xl bg-white shadow-2xl overflow-hidden border border-gray-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh]">
              {/* Blue Header Bar */}
              <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] px-4 py-2 flex justify-between items-center text-white shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm">Prescription</h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowView(false)}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Modal Content - Scrollable Part */}
              <div className="flex-grow overflow-y-auto bg-white p-6 printable-area">
                {/* Hospital Header Section
                <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-2">
                  <div className="flex gap-4">
                    <div className="bg-[#FF0000] p-1 rounded flex items-center justify-center w-12 h-12">
                      <div className="text-white font-bold text-2xl">+</div>
                    </div>
                    <div>
                      <div className="bg-[#FFC600] px-2 py-0.5 inline-block rounded-sm mb-1">
                        <span className="text-black font-black text-xs uppercase italic">SMART HOSPITAL</span>
                      </div>
                      <h1 className="text-4xl font-black text-gray-900 leading-none">Smart Hospital & Research Center</h1>
                    </div>
                  </div>
                  <div className="text-right text-sm leading-tight space-y-0.5 font-medium text-gray-800">
                    <p><span className="font-bold">Address:</span> 25 Kings Street, CA</p>
                    <p><span className="font-bold">Phone No.:</span> 89562423934</p>
                    <p><span className="font-bold">Email:</span> smarthospitalrc@gmail.com</p>
                    <p><span className="font-bold">Website:</span> www.smart-hospital.in</p>
                  </div>
                </div> */}

                {/* Sub Header */}
                {/* <div className="bg-black text-white text-center py-1 font-bold text-sm uppercase tracking-widest mb-4">
                  IPD Prescription
                </div> */}

                {/* Prescription ID & Date */}
                <div className="flex justify-between text-sm font-bold border-b border-gray-200 pb-2 mb-4">
                  <div>Prescription: IPDP{viewPrescription.id}</div>
                  <div>Date: {viewPrescription.created_at ? new Date(viewPrescription.created_at).toLocaleDateString('en-GB') : "N/A"}</div>
                </div>

                {/* Patient Information Grid */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-6 text-sm">
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-28 text-gray-700 font-bold shrink-0">Patient Name</span>
                      <span className="text-gray-900">: {viewPrescription.patient_details?.name || "N/A"} ({viewPrescription.patient_details?.id || ""})</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-gray-700 font-bold shrink-0">Gender</span>
                      <span className="text-gray-900">: {viewPrescription.patient_details?.gender || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-gray-700 font-bold shrink-0">Phone</span>
                      <span className="text-gray-900">: {viewPrescription.patient_details?.phone || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-gray-700 font-bold shrink-0">Email</span>
                      <span className="text-gray-900">: {viewPrescription.patient_details?.email || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-gray-700 font-bold shrink-0">Generated By</span>
                      <span className="text-gray-900">: {viewPrescription.generated_by_details?.name || "N/A"} ({viewPrescription.generated_by_details?.id || ""})</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex">
                      <span className="w-28 text-gray-700 font-bold shrink-0">Age</span>
                      <span className="text-gray-900">: {viewPrescription.patient_details?.age || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-gray-700 font-bold shrink-0">Blood Group</span>
                      <span className="text-gray-900">: {viewPrescription.patient_details?.blood_group || "N/A"}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-gray-700 font-bold shrink-0">Prescribe By</span>
                      <span className="text-gray-900">: {viewPrescription.prescribed_by_details?.name || "N/A"} ({viewPrescription.prescribed_by_details?.id || ""})</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 text-gray-700 font-bold shrink-0">Consultant Doctor</span>
                      <span className="text-gray-900">: {viewPrescription.consultant_doctor_details?.name || "N/A"} ({viewPrescription.consultant_doctor_details?.id || ""})</span>
                    </div>
                  </div>
                </div>

                {/* Symptoms & Findings */}
                <div className="grid grid-cols-2 gap-8 mb-6 border-t border-gray-200 pt-4">
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-gray-900">Symptoms</h4>
                    <p className="text-sm text-gray-700 leading-relaxed font-bold">{viewPrescription.symptoms_text || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-gray-900">Finding</h4>
                    <p className="text-sm text-gray-800 leading-relaxed font-bold mb-1">{viewPrescription.finding_name || "N/A"}</p>
                    <p className="text-[12px] text-gray-600 leading-relaxed italic">{viewPrescription.finding_description || ""}</p>
                  </div>
                </div>

                {/* Medicines Table */}
                <div className="mb-6">
                  <h4 className="font-bold text-sm mb-3 text-gray-900">Medicines</h4>
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-gray-300 bg-gray-50/50">
                      <tr>
                        <th className="py-2 pr-2 font-bold w-8">#</th>
                        <th className="py-2 pr-2 font-bold">Medicine Category</th>
                        <th className="py-2 pr-2 font-bold">Medicine</th>
                        <th className="py-2 pr-2 font-bold">Dosage</th>
                        <th className="py-2 pr-2 font-bold">Dose Interval</th>
                        <th className="py-2 pr-2 font-bold">Dose Duration</th>
                        <th className="py-2 font-bold">Instruction</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 italic">
                      {viewPrescription.medicines?.map((med, idx) => (
                        <tr key={idx}>
                          <td className="py-2 pr-2 text-gray-800">{idx + 1}</td>
                          <td className="py-2 pr-2 text-gray-800">{med.category_name || "N/A"}</td>
                          <td className="py-2 pr-2 text-gray-800 font-bold">{med.medicine_name || "N/A"}</td>
                          <td className="py-2 pr-2 text-gray-800">{med.dosage_name || "N/A"}</td>
                          <td className="py-2 pr-2 text-gray-800">{med.interval_name || "N/A"}</td>
                          <td className="py-2 pr-2 text-gray-800">{med.duration_name || "N/A"}</td>
                          <td className="py-2 text-gray-600">{med.instruction || ""}</td>
                        </tr>
                      ))}
                      {!viewPrescription.medicines?.length && (
                        <tr>
                          <td colSpan="7" className="py-4 text-center text-gray-400 italic">No medicines prescribed</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Tests Section */}
                <div className="grid grid-cols-2 gap-8 mb-10 border-t border-gray-200 pt-4">
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-gray-900">Pathology Test</h4>
                    <div className="space-y-1">
                      {viewPrescription.pathology_details?.map((test, idx) => (
                        <p key={idx} className="text-sm text-gray-700">{idx + 1}. {test.test_name}</p>
                      ))}
                      {!viewPrescription.pathology_details?.length && <p className="text-sm text-gray-400">None</p>}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-gray-900">Radiology Test</h4>
                    <div className="space-y-1">
                      {viewPrescription.radiology_details?.map((test, idx) => (
                        <p key={idx} className="text-sm text-gray-700">{idx + 1}. {test.test_name}</p>
                      ))}
                      {!viewPrescription.radiology_details?.length && <p className="text-sm text-gray-400">None</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
