import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const patientAPI = axios.create({
  baseURL: `${API_BASE_URL}/patients`,
});

// Add token to requests
patientAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    console.log('📤 API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Handle responses
patientAPI.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const getPatientList = async () => {
  const response = await patientAPI.get('/');
  return response;
};

export const getPatientDetail = async (patientId) => {
  if (!patientId) throw new Error('Patient ID is required');
  const response = await patientAPI.get(`/${patientId}/`);
  console.log('Patient data:', response.data);
  if (response.data.photo) {
    console.log('Raw photo path:', response.data.photo);
  }
  return response;
};

export const createPatient = async (patientData) => {
  const response = await patientAPI.post('/create/', patientData);
  return response;
};

export const updatePatient = async (patientId, patientData) => {
  if (!patientId) throw new Error('Patient ID is required');
  const response = await patientAPI.patch(`/${patientId}/update/`, patientData);
  return response;
};

export const deletePatient = async (patientId) => {
  const response = await patientAPI.delete(`/${patientId}/delete/`);
  return response;
};

export const searchPatient = async (query) => {
  const response = await patientAPI.get('/search/', {
    params: { q: query },
  });
  return response;
};