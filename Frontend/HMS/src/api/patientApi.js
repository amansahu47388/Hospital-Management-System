import api from "./authApi";

export const getPatients = () => api.get("/api/patients/");
export const createPatient = (payload) => api.post("/api/patients/", payload);
export const getPatient = (id) => api.get(`/api/patients/${id}/`);
export const updatePatient = (id, payload) => api.put(`/api/patients/${id}/`, payload);
export const partialUpdatePatient = (id, payload) => api.patch(`/api/patients/${id}/`, payload);
export const deletePatient = (id) => api.delete(`/api/patients/${id}/`);