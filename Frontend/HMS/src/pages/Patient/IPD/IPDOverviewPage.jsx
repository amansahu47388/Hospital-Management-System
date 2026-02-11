import React, { useState, useEffect } from "react";
import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";
import { useAuth } from "../../../context/AuthContext";
import { getIpdPatientList, getPrescriptions, getNurseNotes } from "../../../api/ipdApi";
import { getPatientVitals, getPatientOperations } from "../../../api/patientApi";
import { getPathologyBills } from "../../../api/pathologyApi";
import { getRadiologyBills } from "../../../api/radiologyApi";
import {
  Heart,
  FileText,
  Activity,
  Beaker,
  Scissors,
} from "lucide-react";

export default function IPDCombinedPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [ipdData, setIpdData] = useState(null);
  const [vitals, setVitals] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [nurseNotes, setNurseNotes] = useState([]);
  const [labInvestigations, setLabInvestigations] = useState([]);
  const [operations, setOperations] = useState([]);

  useEffect(() => {
    if (user?.patient_id) {
      fetchOverviewData();
    }
  }, [user]);

  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      // 1. Get IPD Admission Info
      const ipdRes = await getIpdPatientList({ patient_id: user.patient_id });
      if (ipdRes.data && ipdRes.data.length > 0) {
        const activeIpd = ipdRes.data[0]; // Fetching most recent admission
        setIpdData(activeIpd);

        // 2. Fetch all other data using active IPD information
        const [vitalsRes, prescriptionsRes, nurseNotesRes, pathologyRes, radiologyRes, operationsRes] = await Promise.all([
          getPatientVitals(user.patient_id),
          getPrescriptions({ ipd_patient: activeIpd.ipd_id }),
          getNurseNotes({ ipd_patient: activeIpd.ipd_id }),
          getPathologyBills("", user.patient_id),
          getRadiologyBills("", user.patient_id),
          getPatientOperations(user.patient_id)
        ]);

        if (vitalsRes.data && vitalsRes.data.length > 0) {
          setVitals(vitalsRes.data[0]);
        }

        setPrescriptions(prescriptionsRes.data || []);
        setNurseNotes(nurseNotesRes.data || []);
        setOperations(operationsRes.data || []);

        // Combine Pathology and Radiology for Lab Investigations
        const labs = [
          ...(pathologyRes.data || []).map(bill => (bill.items || []).map(item => ({
            testName: item.test_name || "N/A",
            lab: "Pathology",
            sample: bill.doctor_name || "N/A",
            expectedDate: item.report_date || "N/A",
            approvedBy: bill.created_by_name || "N/A"
          }))).flat(),
          ...(radiologyRes.data || []).map(bill => (bill.items || []).map(item => ({
            testName: item.test_name || "N/A",
            lab: "Radiology",
            sample: bill.doctor_name || "N/A",
            expectedDate: item.report_date || "N/A",
            approvedBy: bill.created_by_name || "N/A"
          }))).flat()
        ];
        setLabInvestigations(labs);
      }
    } catch (error) {
      console.error("Error fetching IPD overview data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PatientLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6046B5]"></div>
        </div>
      </PatientLayout>
    );
  }

  if (!ipdData) {
    return (
      <PatientLayout>
        <div className="min-h-screen">
          <IPDHeaderNavbar />
          <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold text-gray-800">No active IPD admission found.</h2>
            <p className="text-gray-600 mt-2">You don't have any current IPD records.</p>
          </div>
        </div>
      </PatientLayout>
    );
  }


  // ---------------------------------------------------------------------------
  return (
    <PatientLayout>
      {/* PAGE BACKGROUND THEME */}
      <div className="min-h-screen ">
        <IPDHeaderNavbar />

        <div className="max-w-7xl mx-auto px-2 md:px-0 py-6 space-y-6">

          {/* CURRENT VITALS + PRESCRIPTION */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* VITALS LEFT */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg border-b pb-2">
                <Heart size={20} className="text-rose-500" />
                Current Vitals
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Height</span>
                  <span className="font-semibold">{vitals?.height || "N/A"} cm</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-lg border border-gray-100">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-semibold">{vitals?.weight || "N/A"} kg</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Pulse</span>
                  <span className="font-semibold">{vitals?.pulse || "N/A"} bpm</span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded-lg border border-gray-100">
                  <span className="text-gray-600">Temperature</span>
                  <span className="font-semibold">{vitals?.temperature || "N/A"} °F</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">BP</span>
                  <span className="font-semibold">{vitals?.bp || "N/A"}</span>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                  Known Allergies
                </h4>
                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg border border-red-100 text-sm">
                  {ipdData.allergies || "None"}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2 text-sm uppercase tracking-wide">
                  Symptoms
                </h4>
                <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-lg border border-blue-100 text-sm leading-relaxed">
                  {ipdData.symptom_name || "N/A"}
                </div>
              </div>
            </div>

            {/* PRESCRIPTION RIGHT */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300 flex flex-col">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg border-b pb-2">
                <FileText size={20} className="text-blue-600" />
                Prescription
              </h3>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 font-medium">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">ID</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 rounded-r-lg">Findings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {prescriptions.map((p, idx) => (
                      <tr
                        key={p.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-indigo-600">PRES{p.id}</td>
                        <td className="px-4 py-3">{new Date(p.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={p.finding_description || p.finding_name}>{p.finding_description || p.finding_name}</td>
                      </tr>
                    ))}
                    {prescriptions.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-4 py-8 text-center text-gray-500">No prescriptions found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* NURSE NOTES + LAB INVESTIGATIONS */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nurse Notes */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg border-b pb-2">
                <Activity size={20} className="text-indigo-500" />
                Nurse Notes
              </h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {nurseNotes.map((n, i) => (
                  <div
                    key={n.id}
                    className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-2 uppercase tracking-wide font-semibold">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">{n.nurse_name}</span>
                      <span>{n.formatted_date}</span>
                    </div>
                    <p className="text-gray-800 text-sm mb-2">
                      <span className="font-semibold text-gray-900">Note: </span>
                      {n.note}
                    </p>
                    {n.comment && (
                      <p className="text-gray-600 text-sm italic border-t pt-2 mt-2">
                        <span className="font-medium not-italic">Comment: </span>
                        {n.comment}
                      </p>
                    )}
                  </div>
                ))}
                {nurseNotes.length === 0 && <p className="text-center text-gray-500 py-4">No nurse notes found.</p>}
              </div>
            </div>

            {/* Lab Investigations */}
            <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg border-b pb-2">
                <Beaker size={20} className="text-green-600" />
                Lab Investigations
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 text-gray-600 font-medium">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Test Name</th>
                      <th className="px-4 py-3">Lab</th>
                      <th className="px-4 py-3">Expected</th>
                      <th className="px-4 py-3 rounded-r-lg">Approved By</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {labInvestigations.map((l, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">{l.testName}</td>
                        <td className="px-4 py-3 text-gray-600">{l.lab}</td>
                        <td className="px-4 py-3 text-gray-600">{l.expectedDate}</td>
                        <td className="px-4 py-3 text-gray-600">{l.approvedBy}</td>
                      </tr>
                    ))}
                    {labInvestigations.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">No lab investigations found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* OPERATIONS */}
          <section className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-lg border-b pb-2">
              <Scissors size={20} className="text-rose-600" />
              Operation
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 font-medium">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Operation Name</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3 rounded-r-lg">Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {operations.map((o, idx) => (
                    <tr
                      key={o.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-indigo-600">{o.operation_name}</td>
                      <td className="px-4 py-3 text-gray-600">{o.operation_date}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{o.doctor_name}</td>
                      <td className="px-4 py-3 text-gray-600">{o.remark || "N/A"}</td>
                    </tr>
                  ))}
                  {operations.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-gray-500">No operations found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </PatientLayout>
  );
}