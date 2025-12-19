import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const doctorAPI = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
});

// Add token to requests
doctorAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    console.log('📤 Doctor API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Handle responses
doctorAPI.interceptors.response.use(
  (response) => {
    console.log('📥 Doctor API Response:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Doctor API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export const getDoctorList = async () => {
  const response = await doctorAPI.get('/doctors/');
  return response;
};

export const getDoctorDetail = async (doctorId) => {
  if (!doctorId) throw new Error('Doctor ID is required');
  const response = await doctorAPI.get(`/doctors/${doctorId}/`);
  return response;
};