import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const patientAPI = axios.create({
  baseURL: `${API_BASE_URL}/patients`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
patientAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle responses
patientAPI.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export const getPatientList = async () => {
  try {
    const response = await patientAPI.get('/');
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPatientDetail = async (patientId) => {
  try {
    const response = await patientAPI.get(`/${patientId}/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const createPatient = async (patientData) => {
  try {
    const response = await patientAPI.post('/create/', patientData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePatient = async (patientId, patientData) => {
  try {
    const response = await patientAPI.patch(`/${patientId}/update/`, patientData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deletePatient = async (patientId) => {
  try {
    const response = await patientAPI.delete(`/${patientId}/delete/`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const searchPatient = async (query) => {
  try {
    const response = await patientAPI.get('/search/', {
      params: { q: query },
    });
    return response;
  } catch (error) {
    throw error;
  }
};