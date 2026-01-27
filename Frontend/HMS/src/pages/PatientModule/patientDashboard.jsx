import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPatientList, deletePatient, searchPatient } from "../../api/patientApi";
import { useNotify } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/CommonComponent/Sidebar";
import Navbar from "../../components/AdminComponent/Navbar";
import AddPatient from "../../components/PatientComponent/AddPatient";
import { Eye, Pencil, Trash2 } from "lucide-react";
import UpdatePatient from "../../components/PatientComponent/UpdatePatient";

function PatientDashboard() {
  const [openAdd, setOpenAdd] = useState(false);
  const navigate = useNavigate();
  const notify = useNotify();
  const { user } = useAuth();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openUpdate, setOpenUpdate] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  // selection
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const isAdmin = user?.is_staff || user?.role === "admin" || user?.is_superuser;

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await getPatientList();
      setPatients(Array.isArray(response.data) ? response.data : []);
    } catch {
      notify("error", "Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      fetchPatients();
      return;
    }

    try {
      const response = await searchPatient(value);
      setPatients(Array.isArray(response.data) ? response.data : []);
    } catch {
      notify("error", "Search failed");
    }
  };

  // checkbox handlers
  const toggleSelectPatient = (id) => {
    setSelectedPatients((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedPatients.length === patients.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(patients.map((p) => p.id));
    }
  };

  // bulk delete (unchanged)
  const handleDeleteSelected = async () => {
    if (selectedPatients.length === 0) {
      notify("error", "No patients selected");
      return;
    }

    if (
      !window.confirm(
        `Delete ${selectedPatients.length} selected patients?`
      )
    ) {
      return;
    }

    setBulkDeleteLoading(true);
    try {
      for (const id of selectedPatients) {
        await deletePatient(id);
      }

      notify("success", "Selected patients deleted");
      setPatients((prev) =>
        prev.filter((p) => !selectedPatients.includes(p.id))
      );
      setSelectedPatients([]);
    } catch {
      notify("error", "Bulk delete failed");
      fetchPatients();
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  const handleDeleteSingle = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      setDeleteLoading(id);
      await deletePatient(id);
      setPatients((prev) => prev.filter((p) => p.id !== id));
      setSelectedPatients((prev) => prev.filter((pId) => pId !== id));
      notify("success", "Patient deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      const msg = err.response?.data?.detail || "Failed to delete patient";
      notify("error", msg);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <div className="h-screen w-screen flex bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full">
            {/* HEADER */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                Patients List ({patients.length})
              </h2>

              <div className="flex gap-3">
                {isAdmin && (
                  <button
                    onClick={handleDeleteSelected}
                    className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                               text-white text-sm px-4 py-2 rounded
                               hover:shadow-lg transition disabled:opacity-60"
                    disabled={selectedPatients.length === 0 || bulkDeleteLoading}
                  >
                    {bulkDeleteLoading
                      ? "Deleting..."
                      : `Delete Selected (${selectedPatients.length})`}
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => setOpenAdd(true)}
                    className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                               text-white text-sm px-4 py-2 rounded
                               hover:shadow-lg transition"
                  >
                    + Add Patient
                  </button>
                )}
              </div>
            </div>

            {/* SEARCH */}
            <div className="px-6 py-4">
  <div
    className="flex items-center gap-2
               bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
               p-[2px] rounded-lg
               w-full md:w-72"
  >
    <input
      type="text"
      placeholder="Search by patient name"
      value={searchTerm}
      onChange={handleSearch}
      className="w-full px-4 py-2 text-sm
                 rounded-md
                 bg-white
                 text-gray-800
                 placeholder-gray-400
                 outline-none
                 focus:ring-2 focus:ring-white
                 transition"
    />
  </div>
</div>


            <AddPatient
              open={openAdd}
              onClose={() => {
                setOpenAdd(false);
                fetchPatients();
              }}
            />

            {/* TABLE */}
            <div className="overflow-x-auto thin-scrollbar">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={
                          patients.length > 0 &&
                          selectedPatients.length === patients.length
                        }
                        onChange={toggleSelectAll}
                        className="accent-[#6046B5]"
                      />
                    </th>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Gender</th>
                    <th className="px-6 py-4">Phone</th>
                    <th className="px-6 py-4">DOB</th>
                    <th className="px-6 py-4">Age(Years)</th>
                    <th className="px-6 py-4">Blood Group</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedPatients.includes(patient.id)}
                          onChange={() => toggleSelectPatient(patient.id)}
                          className="accent-[#6046B5]"
                        />
                      </td>
                      <td className="px-6 py-4">{patient.id}</td>
                      <td
                        className="px-6 py-4 text-blue-600 cursor-pointer hover:underline"
                        onClick={() => navigate(`/admin/patients/${patient.id}`)}
                      >
                        {patient.full_name}
                      </td>
                      <td className="px-6 py-4">{patient.email}</td>
                      <td className="px-6 py-4">{patient.gender}</td>
                      <td className="px-6 py-4">{patient.phone}</td>
                      <td className="px-6 py-4">
                        {new Date(
                          patient.date_of_birth
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {patient.age || "N/A"}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {patient.blood_group}
                      </td>

                      {/* ACTIONS → DIRECT NAVIGATION */}
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/patients/${patient.id}`)
                          }
                          className="text-xl text-gray-600 hover:text-gray-900"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPatientId(patient.id);
                            setOpenUpdate(true);
                          }}
                          className="text-xl text-gray-600 hover:text-gray-900"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => handleDeleteSingle(patient.id)}
                            className={`text-xl text-gray-600 hover:text-red-600 ${deleteLoading === patient.id ? 'opacity-50 pointer-events-none' : ''}`}
                            title="Delete"
                            disabled={deleteLoading === patient.id}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div >
      {/* UPDATE PATIENT MODAL - Only opens when edit button is clicked */}
      {
        openUpdate && selectedPatientId && (
          <UpdatePatient
            open={openUpdate}
            patientId={selectedPatientId}
            onClose={() => {
              setOpenUpdate(false);
              setSelectedPatientId(null);
              fetchPatients(); // Refresh patient data after update
            }}
          />
        )
      }
    </div >
  );
}

export default PatientDashboard;
