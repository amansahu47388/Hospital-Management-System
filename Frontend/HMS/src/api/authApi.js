import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
        const response = await axios.post(
          "http://localhost:8000/auth/refresh/",
          {},
          { withCredentials: true }
        );
        const { access } = response.data;
        localStorage.setItem("token", access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return API(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const userRegister = (data) =>
  API.post("/auth/register/user/", data);

export const adminRegister = (data) =>
  API.post("/auth/register/admin/", data);

export const userLogin = (data) =>
  API.post("/auth/login/", data);

export const userLogout = () =>
  API.post("/auth/logout/");

export const refreshToken = () =>
  API.post("/auth/refresh/");
