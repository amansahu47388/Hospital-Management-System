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

export const createIpdPatient = (data) => {
  return opdAPI.post("ipd/create/", data);
};

export const getIpdPatientList = () => {
  return opdAPI.get("ipd/");
};

export const getIpdPatientDetail = (ipdId) => {
  return opdAPI.get(`ipd/${ipdId}/`);
};

export const updateIpdPatient = (ipdId, data) => {
  return opdAPI.patch(`ipd/${ipdId}/update/`, data);
};

export const searchPatients = (q) => {
  return opdAPI.get("patients/search/", { params: { q } });
};

export const getSymptoms = () => {
  return setupAPI.get("symptoms/");
};

export const getBeds = () => {
  return setupAPI.get("beds/");
};
