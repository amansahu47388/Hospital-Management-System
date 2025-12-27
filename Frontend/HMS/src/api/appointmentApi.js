// import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL;

// const appointmentAPI = axios.create({
//   baseURL: `${API_BASE_URL.replace('/api', '')}/appointments`,
// });

// // Add token to requests
// appointmentAPI.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     // Don't set Content-Type for FormData
//     if (!(config.data instanceof FormData)) {
//       config.headers['Content-Type'] = 'application/json';
//     }

//     console.log('📤 Appointment API Request:', config.method.toUpperCase(), config.url);
//     return config;
//   },
//   (error) => {
//     console.error('❌ Request error:', error);
//     return Promise.reject(error);
//   }
// );

// // Handle responses
// appointmentAPI.interceptors.response.use(
//   (response) => {
//     console.log('📥 Appointment API Response:', response.status);
//     return response;
//   },
//   (error) => {
//     console.error('❌ Appointment API Error:', error.response?.status, error.response?.data);
//     if (error.response?.status === 401) {
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       window.location.href = '/admin/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export const getAppointmentList = async (params = {}) => {
//   const response = await appointmentAPI.get('/', { params });
//   return response;
// };

// export const getAppointmentDetail = async (appointmentId) => {
//   if (!appointmentId) throw new Error('Appointment ID is required');
//   const response = await appointmentAPI.get(`/${appointmentId}/`);
//   return response;
// };

// export const createAppointment = async (appointmentData) => {
//   const response = await appointmentAPI.post('/create/', appointmentData);
//   return response;
// };

// export const updateAppointment = async (appointmentId, appointmentData) => {
//   if (!appointmentId) throw new Error('Appointment ID is required');
//   const response = await appointmentAPI.patch(`/${appointmentId}/`, appointmentData);
//   return response;
// };

// export const deleteAppointment = async (appointmentId) => {
//   if (!appointmentId) throw new Error('Appointment ID is required');
//   const response = await appointmentAPI.delete(`/${appointmentId}/`);
//   return response;
// };

// export const getTodayAppointments = async () => {
//   const response = await appointmentAPI.get('/today/');
//   return response;
// };

// export const getUpcomingAppointments = async () => {
//   const response = await appointmentAPI.get('/upcoming/');
//   return response;
// };

// export const getPastAppointments = async () => {
//   const response = await appointmentAPI.get('/past/');
//   return response;
// };

// export const getDoctorWiseAppointments = async (doctorId, date) => {
//   const response = await appointmentAPI.get('/doctor-wise/', { params: { doctor: doctorId, date } });
//   return response;
// };

// export const getPatientQueue = async (doctorId, date, shift = '', slot = '') => {
//   const params = { doctor: doctorId, date };
//   if (shift) params.shift = shift;
//   if (slot) params.slot = slot;
//   const response = await appointmentAPI.get('/patient-queue/', { params });
//   return response;
// };

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// ✅ CORRECT BASE URL
// Django URL: /api/admin/appointments/
const appointmentAPI = axios.create({
  baseURL: `${API_BASE_URL}/admin/appointments/`,
});

// =======================
// REQUEST INTERCEPTOR
// =======================
appointmentAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    console.log(
      '📤 Appointment API Request:',
      config.method?.toUpperCase(),
      config.url
    );

    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// =======================
// RESPONSE INTERCEPTOR
// =======================
appointmentAPI.interceptors.response.use(
  (response) => {
    console.log('📥 Appointment API Response:', response.status);
    return response;
  },
  (error) => {
    console.error(
      '❌ Appointment API Error:',
      error.response?.status,
      error.response?.data
    );

    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/admin/login';
    }

    return Promise.reject(error);
  }
);

export const getDoctorWiseAppointments = async (doctorId, date) => {
  const response = await appointmentAPI.get('/doctor-wise/', { params: { doctor: doctorId, date } });
  return response;
};

export const getPatientQueue = async (doctorId, date, shift = '', slot = '') => {
  const params = { doctor: doctorId, date };
  if (shift) params.shift = shift;
  if (slot) params.slot = slot;
  const response = await appointmentAPI.get('/patient-queue/', { params });
  return response;
};

// =======================
// API FUNCTIONS
// =======================

export const getAppointmentList = async (params = {}) => {
  return await appointmentAPI.get('', { params });
};

export const getAppointmentDetail = async (appointmentId) => {
  if (!appointmentId) throw new Error('Appointment ID is required');
  return await appointmentAPI.get(`${appointmentId}/`);
};

export const createAppointment = async (appointmentData) => {
  // ✅ APIView uses POST on same URL
  return await appointmentAPI.post('create/', appointmentData);
};

export const updateAppointment = async (appointmentId, appointmentData) => {
  if (!appointmentId) throw new Error('Appointment ID is required');
  return await appointmentAPI.patch(`${appointmentId}/`, appointmentData);
};

export const rescheduleAppointment = async (appointmentId, appointmentData) => {
  if (!appointmentId) throw new Error('Appointment ID is required');
  return await appointmentAPI.patch(`${appointmentId}/reschedule/`, appointmentData);
};

export const deleteAppointment = async (appointmentId) => {
  if (!appointmentId) throw new Error('Appointment ID is required');
  return await appointmentAPI.delete(`${appointmentId}/delete/`);
};

export const getDoctors = async () => {
  return await appointmentAPI.get("doctors/");
};


// =======================
// FILTERED ENDPOINTS
// =======================

export const getTodayAppointments = async () => {
  return await appointmentAPI.get('today/');
};

export const getUpcomingAppointments = async () => {
  return await appointmentAPI.get('upcoming/');
};

export const getPastAppointments = async () => {
  return await appointmentAPI.get('past/');
};

