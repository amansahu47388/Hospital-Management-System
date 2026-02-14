import axios from 'axios';

// Get API URL from environment variable or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// Create axios instance for auth endpoints (no /admin/ prefix)
const authApi = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
authApi.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            window.location.href = "/admin/login";
        }
        return Promise.reject(error);
    }
);

// Get all staff members
export const getStaffList = async () => {
    const response = await authApi.get('/auth/staff-management/');
    return response.data;
};

// Create new staff member
export const createStaff = async (staffData) => {
    const response = await authApi.post('/auth/staff-management/', staffData);
    return response.data;
};

// Get staff details
export const getStaffDetails = async (staffId) => {
    const response = await authApi.get(`/auth/staff-management/${staffId}/`);
    return response.data;
};

// Update staff member
export const updateStaff = async (staffId, staffData) => {
    const response = await authApi.put(`/auth/staff-management/${staffId}/`, staffData);
    return response.data;
};

// Delete staff member
export const deleteStaff = async (staffId) => {
    const response = await authApi.delete(`/auth/staff-management/${staffId}/`);
    return response.data;
};

// Toggle staff active status
export const toggleStaffActive = async (staffId) => {
    const response = await authApi.patch(`/auth/staff-management/${staffId}/toggle-active/`);
    return response.data;
};

// Resend invitation email
export const resendInvitation = async (staffId) => {
    const response = await authApi.post(`/auth/staff-management/${staffId}/resend-invitation/`);
    return response.data;
};

// First login password change
export const firstLoginPasswordChange = async (passwordData) => {
    const response = await authApi.post('/auth/first-login-password-change/', passwordData);
    return response.data;
};
