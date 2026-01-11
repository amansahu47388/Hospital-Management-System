import axios from "axios";

// Get API URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Validate API URL
if (!API_BASE_URL) {
  console.error("⚠️ VITE_API_URL is not set. Please create a .env file with VITE_API_URL=http://localhost:8000/api");
}

const api = axios.create({
  baseURL: `${API_BASE_URL}/admin/`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= REQUEST INTERCEPTOR =================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

      // redirect to login
      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default api;
