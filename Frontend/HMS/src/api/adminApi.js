import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const adminAPI = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
});

// Add token to requests
adminAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    console.log('📤 Admin API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Handle responses
adminAPI.interceptors.response.use(
  (response) => {
    console.log('📥 Admin API Response:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Admin API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const getDoctors = async () => {
  const response = await adminAPI.get('/doctors/');
  return response;
};

export const getAdminProfiles = async () => {
  const response = await adminAPI.get('/admin-profiles/');
  return response;
};

export const updateAdminProfile = async (id, data) => {
  const response = await adminAPI.put(`/admin-profiles/${id}/`, data);
  return response;
};