import { useState, useEffect } from "react";
import { getAppointmentList, getTodayAppointments, getUpcomingAppointments, getPastAppointments } from "../api/appointmentApi";

export function useAppointments() {
  const [activeTab, setActiveTab] = useState("today");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(100);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      const params = { search, limit };

      switch (activeTab) {
        case "today":
          response = await getTodayAppointments();
          break;
        case "upcoming":
          response = await getUpcomingAppointments();
          break;
        case "old":
          response = await getPastAppointments();
          break;
        default:
          response = await getAppointmentList(params);
      }

      // Transform the data to match the table format
      const transformedData = response.data.map(appointment => ({
        id: appointment.id,
        patient_name: appointment.patient_details?.full_name || appointment.patient?.full_name || 'N/A',
        appointment_no: appointment.appointment_no,
        created_by: appointment.created_by_name || 'N/A',
        appointment_date: appointment.appointment_date ? `${new Date(appointment.appointment_date).toLocaleDateString()} ${new Date(appointment.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'N/A',
        phone: appointment.patient_details?.phone || appointment.phone || 'N/A',
        gender: appointment.patient_details?.gender || 'N/A',
        // Provide both a normalized doctor_name and the full doctor_details object
        doctor_name: appointment.doctor_name || appointment.doctor_details?.full_name || 'N/A',
        doctor_details: appointment.doctor_details || null,
        source: appointment.source || 'N/A',
        priority: appointment.priority_details?.priority || appointment.appontmet_priority || 'N/A',
        shift: appointment.shift_details?.shift || appointment.shift?.shift || 'N/A',
        live_consultant: appointment.live_consultation ? 'Yes' : 'No',
        alternate_address: appointment.patient_details?.address || 'N/A',
        fees: appointment.fees,
        discount: 0, // You might want to add discount field to model
        paid: appointment.fees, // You might want to add payment tracking
        status: appointment.status,
        department: appointment.doctor_details?.department || 'N/A',
        reason: appointment.reason,
        payment_mode: appointment.payment_modee,
        // Keep original data as well for detail modals
        ...appointment
      }));

      setAppointments(transformedData);
    } catch (err) {
      setError(err.message || 'Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [activeTab, search, limit]);

  return {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    limit,
    setLimit,
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
  };
}
