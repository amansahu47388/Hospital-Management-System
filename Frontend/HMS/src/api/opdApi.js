import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const opdAPI = axios.create({
  baseURL: `${API_BASE_URL}/admin/`,
});

opdAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

// new setup API (adds auth header like opdAPI)
const setupAPI = axios.create({
  baseURL: `${API_BASE_URL}/admin/setup/`,
});

setupAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

// ==========================
// OPD APIs
// ==========================

export const createOpdPatient = (data) => {
  return opdAPI.post("opd/create/", data);
};

export const getOpdPatientList = (tab) => {
  return opdAPI.get("opd/", {
    params: { tab },
  });
};

export const getOpdPatientDetail = (opdId) => {
  return opdAPI.get(`opd/${opdId}/`);
};

export const updateOpdPatient = (opdId, data) => {
  return opdAPI.patch(`opd/${opdId}/`, data);
};

export const searchPatients = (q) => {
  return opdAPI.get("patients/search/", { params: { q } });
};

// fetch from setup endpoints (use setupAPI so token is sent)
export const getSymptoms = () => {
  return setupAPI.get("symptoms/");
};

export const getHospitalCharges = () => {
  return setupAPI.get("charges/");
};

