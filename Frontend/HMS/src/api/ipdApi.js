import api from "./axiosInstance";

export const createIpdPatient = (data) => {
  return api.post("ipd/create/", data);
};

export const getIpdPatientList = (params = {}) => {
  return api.get("ipd/", { params });
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





export const getPrescriptions = (params) => {
  return api.get("ipd/prescriptions/", { params });
};

export const createPrescription = (data) => {
  return api.post("ipd/prescriptions/create/", data);
};

export const updatePrescription = (id, data) => {
  return api.patch(`ipd/prescriptions/${id}/`, data);
};

export const deletePrescription = (id) => {
  return api.delete(`ipd/prescriptions/${id}/`);
};





export const getNurseNotes = (params) => {
  return api.get("ipd/nurse-note/", { params });
};

export const createNurseNote = (data) => {
  return api.post("ipd/nurse-note/create/", data);
};

export const updateNurseNote = (id, data) => {
  return api.patch(`ipd/nurse-note/${id}/`, data);
};

export const deleteNurseNote = (id) => {
  return api.delete(`ipd/nurse-note/${id}/`);
};
