import axios from "axios";

// Get API URL from environment variable or use default
const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE_URL = RAW_API_URL.endsWith('/') ? RAW_API_URL : RAW_API_URL + '/';

const api = axios.create({
  baseURL: `${API_BASE_URL}admin/`,
  // Don't set Content-Type here - let axios handle it automatically
  // This allows FormData to set multipart/form-data automatically
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // If data is FormData, remove Content-Type to let browser set it with boundary
    if (config.data instanceof FormData) {
      // Delete Content-Type to allow browser to set multipart/form-data with boundary
      delete config.headers['Content-Type'];
    } else {
      // For non-FormData requests, set JSON content type
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= RESPONSE INTERCEPTOR =================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // clear auth
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      // redirect based on current context
      if (window.location.pathname.includes("patient") || window.location.pathname.includes("patient-portal")) {
        window.location.href = "/login";
      } else {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
