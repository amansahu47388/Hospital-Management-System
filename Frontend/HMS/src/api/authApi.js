import axios from "axios";

const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
// Auth endpoints live at /auth/* (no /api prefix). Strip trailing "/api" if present.
const AUTH_BASE_URL = RAW_API_URL.replace(/\/api\/?$/, "");

const API = axios.create({
  baseURL: `${AUTH_BASE_URL}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token refresh on 401
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(
          `${AUTH_BASE_URL}/auth/refresh/`,
          { refresh: refreshToken },
          { withCredentials: true }
        );
        const { access } = response.data;
        localStorage.setItem("access_token", access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const userRegister = (data) =>
  API.post("/auth/register/", data);

export const adminRegister = (data) =>
  API.post("/auth/register/admin/", data);

export const userLogin = (data) =>
  API.post("/auth/login/", data);

export const userLogout = () =>
  API.post("/auth/logout/");

export const refreshToken = () =>
  API.post("/auth/refresh/");
