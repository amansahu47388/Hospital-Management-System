import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../../layout/AdminLayout";
import IPDTabsNavbar from "../../components/ipd/IPDNavbar";
import { Pencil, Trash2, Loader2, CheckCircle } from "lucide-react";
import {
  getPatientConsultants,
  createPatientConsultant,
  updatePatientConsultant,
  deletePatientConsultant
} from "../../api/patientApi";
import { getIpdPatientDetail } from "../../api/ipdApi";
import { getDoctors } from "../../api/appointmentApi";
import { useNotify } from "../../context/NotificationContext";

export default function ConsultantRegister() {
  const { ipdId } = useParams();
  const notify = useNotify();
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [consultants, setConsultants] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    consultant_date: new Date().toISOString().slice(0, 10),
    doctor: "",
    instruction: "",
    remark: ""
  });

  useEffect(() => {
    const init = async () => {
      if (ipdId) {
        setLoading(true);
        try {
          const [ipdRes, docRes] = await Promise.all([
            getIpdPatientDetail(ipdId),
            getDoctors()
          ]);
          setPatientId(ipdRes.data.patient);
          setDoctors(docRes.data || []);
          fetchConsultants(ipdRes.data.patient);
        } catch (error) {
          console.error("Error initializing consultant register:", error);
          notify("error", "Failed to load records");
        } finally {
          setLoading(false);
        }
      }
    };
    init();
  }, [ipdId]);

  const fetchConsultants = async (pid = patientId) => {
    if (!pid) return;
    setLoading(true);
    try {
      const response = await getPatientConsultants(pid);
      setConsultants(response.data);
    } catch (error) {
      console.error("Error fetching consultants:", error);
      notify("error", "Failed to fetch consultant records");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.doctor || !formData.instruction) {
      notify("warning", "Please fill required fields");
      return;
    }
    setLoading(true);
    try {
      await createPatientConsultant(patientId, formData);
      notify("success", "Consultant record added successfully");
      fetchConsultants(patientId);
      setShowAdd(false);
      setFormData({
        consultant_date: new Date().toISOString().slice(0, 10),
        doctor: "",
        instruction: "",
        remark: ""
      });
    } catch (error) {
      notify("error", "Failed to add consultant record");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selected.doctor || !selected.instruction) {
      notify("warning", "Please fill required fields");
      return;
    }
    setLoading(true);
    try {
      await updatePatientConsultant(patientId, selected.id, selected);
      notify("success", "Consultant record updated successfully");
      fetchConsultants(patientId);
      setShowEdit(false);
    } catch (error) {
      notify("error", "Failed to update consultant record");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await deletePatientConsultant(patientId, id);
        notify("success", "Record deleted successfully");
        fetchConsultants(patientId);
      } catch (error) {
        notify("error", "Failed to delete record");
      }
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100">

        {/* IPD NAVBAR */}
        <IPDTabsNavbar />

        {/* LIST */}
        <div className="p-4 md:p-6">
          <div className="bg-white rounded shadow p-4">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Consultant Register</h2>
              <button
                onClick={() => setShowAdd(true)}
                className="bg-[#6046B5] text-white px-4 py-2 rounded"
              >
                + Consultant Register
              </button>
            </div>

            <table className="w-full  text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Applied Date</th>
                  <th className="p-2 text-left">Consultant Doctor</th>
                  <th className="p-2 text-left">Instruction</th>
                  <th className="p-2 text-left">Consultant Date</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && consultants.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        <span>Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : consultants.length > 0 ? (
                  consultants.map((row) => (
                    <tr key={row.id} className="border-t border-gray-200">
                      <td className="p-2 text-left">
                        {new Date(row.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2 text-left">{row.doctor_name}</td>
                      <td className="p-2 text-left">{row.instruction}</td>
                      <td className="p-2 text-left">{row.consultant_date}</td>
                      <td className="p-2 text-left flex gap-2">
                        <button
                          onClick={() => {
                            setSelected(row);
                            setShowEdit(true);
                          }}
                          className="text-purple-600 hover:bg-purple-50 p-1 rounded"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          className="text-red-600 hover:bg-red-50 p-1 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      {patientId ? "No records found" : "Resolving Patient..."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

          </div>
        </div>

        {/* ADD MODAL */}
        {showAdd && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="w-full max-w-xl rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">

              <div className="flex justify-between p-4 text-white">
                <h3>Add Consultant Register</h3>
                <button onClick={() => setShowAdd(false)}>✕</button>
              </div>

              <div className="bg-white p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Consultant Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    className="border p-2 w-full rounded focus:ring-1 focus:ring-purple-500 outline-none"
                    value={formData.consultant_date}
                    onChange={(e) => setFormData({ ...formData, consultant_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Select Consultant <span className="text-red-500">*</span></label>
                  <select
                    className="border p-2 w-full rounded focus:ring-1 focus:ring-purple-500 outline-none"
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                  >
                    <option value="">Select Consultant</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Instruction <span className="text-red-500">*</span></label>
                  <textarea
                    className="border p-2 w-full rounded focus:ring-1 focus:ring-purple-500 outline-none min-h-[100px]"
                    placeholder="Enter instructions"
                    value={formData.instruction}
                    onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
                  />
                </div>
                <div className="text-right">
                  <button
                    onClick={handleAdd}
                    disabled={loading}
                    className="bg-[#6046B5] text-white px-6 py-2 rounded flex items-center justify-center gap-2 ml-auto disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                    <span>Save</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* EDIT MODAL */}
        {showEdit && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
            <div className="w-full max-w-xl rounded bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">

              <div className="flex justify-between p-4 text-white">
                <h3>Edit Consultant Register</h3>
                <button onClick={() => setShowEdit(false)}>✕</button>
              </div>

              <div className="bg-white p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Consultant Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    className="border p-2 w-full rounded focus:ring-1 focus:ring-purple-500 outline-none"
                    value={selected?.consultant_date}
                    onChange={(e) => setSelected({ ...selected, consultant_date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Select Consultant <span className="text-red-500">*</span></label>
                  <select
                    className="border p-2 w-full rounded focus:ring-1 focus:ring-purple-500 outline-none"
                    value={selected?.doctor}
                    onChange={(e) => setSelected({ ...selected, doctor: e.target.value })}
                  >
                    <option value="">Select Consultant</option>
                    {doctors.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.full_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Instruction <span className="text-red-500">*</span></label>
                  <textarea
                    className="border p-2 w-full rounded focus:ring-1 focus:ring-purple-500 outline-none min-h-[100px]"
                    value={selected?.instruction}
                    onChange={(e) => setSelected({ ...selected, instruction: e.target.value })}
                  />
                </div>
                <div className="text-right">
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="bg-[#6046B5] text-white px-6 py-2 rounded flex items-center justify-center gap-2 ml-auto disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                    <span>Update</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
