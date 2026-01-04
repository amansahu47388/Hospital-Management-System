import api from "./axiosInstance";

export const createIpdPatient = (data) => {
  return api.post("ipd/create/", data);
};

export const getIpdPatientList = () => {
  return api.get("ipd/");
};

export const getIpdPatientDetail = (ipdId) => {
  return api.get(`ipd/${ipdId}/`);
};

export const updateIpdPatient = (ipdId, data) => {
  return api.patch(`ipd/${ipdId}/update/`, data);
};

export const searchPatients = (q) => {
  return api.get("patients/search/", { params: { q } });
};

export const getSymptoms = () => {
  return api.get("setup/symptoms/");
};

export const getBeds = () => {
  return api.get("setup/beds/");
};

export const deleteIpdPatient = (id) => {
  return api.delete(`ipd/${id}/delete/`);
};

export const dischargeIpdPatient = (ipdId, data) => {
  return api.post(`ipd/${ipdId}/discharge/`, data);
};

export const getDischargedIpdPatients = () => {
  return api.get("ipd/discharged/");
};

export const revertIpdDischarge = (ipdId) => {
  return api.post(`ipd/${ipdId}/discharge/revert/`);
};
