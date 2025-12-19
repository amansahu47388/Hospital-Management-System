import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const appointmentAPI = axios.create({
  baseURL: `${API_BASE_URL}/appointments`,
});

// Add token to requests
appointmentAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    console.log('📤 Appointment API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Handle responses
appointmentAPI.interceptors.response.use(
  (response) => {
    console.log('📥 Appointment API Response:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Appointment API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const getAppointmentList = async (params = {}) => {
  const response = await appointmentAPI.get('/', { params });
  return response;
};

export const getAppointmentDetail = async (appointmentId) => {
  if (!appointmentId) throw new Error('Appointment ID is required');
  const response = await appointmentAPI.get(`/${appointmentId}/`);
  return response;
};

export const createAppointment = async (appointmentData) => {
  const response = await appointmentAPI.post('/', appointmentData);
  return response;
};

export const updateAppointment = async (appointmentId, appointmentData) => {
  if (!appointmentId) throw new Error('Appointment ID is required');
  const response = await appointmentAPI.patch(`/${appointmentId}/`, appointmentData);
  return response;
};

export const deleteAppointment = async (appointmentId) => {
  if (!appointmentId) throw new Error('Appointment ID is required');
  const response = await appointmentAPI.delete(`/${appointmentId}/`);
  return response;
};

export const getTodayAppointments = async () => {
  const response = await appointmentAPI.get('/today/');
  return response;
};

export const getUpcomingAppointments = async () => {
  const response = await appointmentAPI.get('/upcoming/');
  return response;
};

export const getPastAppointments = async () => {
  const response = await appointmentAPI.get('/past/');
  return response;
};