import api from "./axiosInstance";

export const createOpdPatient = (data) => {
  return api.post("opd/create/", data);
};

export const getOpdPatientList = (params = {}) => {
  return api.get("opd/", { params });
};

export const getOpdPatientDetail = (opdId) => {
  return api.get(`opd/${opdId}/`);
};

export const updateOpdPatient = (opdId, data) => {
  return api.patch(`opd/${opdId}/update/`, data);
};

export const searchPatients = (q) => {
  return api.get("patients/search/", { params: { q } });
};

export const getSymptoms = () => {
  return api.get("setup/symptoms/");
};

export const getHospitalCharges = () => {
  return api.get("setup/charges/");
};



export const deleteOpdPatient = (id) => {
  return api.delete(`opd/${id}/delete/`);
};
