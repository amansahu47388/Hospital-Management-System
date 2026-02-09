import api from "./axiosInstance";

/* ================= Ambulance CRUD ================= */

export const createAmbulance = (data) => {
  return api.post("ambulance/create/", data);
};

export const getAmbulances = () => {
  return api.get("ambulance/");
};

export const updateAmbulance = (id, payload) => {
  return api.put(`ambulance/${id}/update/`, payload);
};

export const deleteAmbulance = (id) => {
  return api.delete(`ambulance/${id}/delete/`);
};

export const getAmbulanceById = (id) => {
  return api.get(`ambulance/${id}/`);
};

// Ambulance Bills
export const createAmbulanceBill = async (payload) => {
  return api.post("ambulance-bill/create/", payload);
};

export const getAmbulanceBills = (search = "", patientId = "", caseId = "") => {
  const params = {};
  if (search) params.search = search;
  if (patientId) params.patient_id = patientId;
  if (caseId) params.case_id = caseId;
  return api.get("ambulance-bill/", { params });
};

export const getAmbulanceBillDetail = (id) => {
  return api.get(`ambulance-bill/${id}/`);
};

// 🔥 USE PATCH (works now)
export const updateAmbulanceBill = (id, payload) => {
  return api.patch(`ambulance-bill/${id}/update/`, payload);
};

export const deleteAmbulanceBill = (id) => {
  return api.delete(`ambulance-bill/${id}/delete/`);
};

// Ambulance Bill Transactions
export const getAmbulanceBillTransactions = (billId) => {
  return api.get(`ambulance-bill/${billId}/transactions/`);
};

export const createAmbulanceBillTransaction = (billId, data) => {
  return api.post(`ambulance-bill/${billId}/transactions/create/`, data);
};

export const deleteAmbulanceBillTransaction = (billId, transactionId) => {
  return api.delete(`ambulance-bill/${billId}/transactions/${transactionId}/delete/`);
};


