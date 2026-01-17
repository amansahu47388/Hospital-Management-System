import api from "./axiosInstance";

/* ================= Ambulance CRUD ================= */

export const createAmbulance = (data) => {
  return api.post("/ambulance/create/", data);
};

export const getAmbulances = () => {
  return api.get("/ambulance/");
};

export const updateAmbulance = (id, payload) => {
  return api.put(`/ambulance/${id}/update/`, payload);
};

export const deleteAmbulance = (id) => {
  return api.delete(`/ambulance/${id}/delete/`);
};

// Ambulance Charge Categories
export const getAmbulanceChargeCategories = () => {
  return api.get("/charge-category/");
};

export const createAmbulanceChargeCategory = (data) => {
  return api.post("/charge-category/create/", data);
};

// Ambulance Charges
export const getAmbulanceCharges = () => {
  return api.get("/charge/");
};

export const createAmbulanceCharge = (data) => {
  return api.post("/charge/create/", data);
};

export const updateAmbulanceCharge = (id, payload) => {
  return api.put(`/charge/${id}/update/`, payload);
};

export const deleteAmbulanceCharge = (id) => {
  return api.delete(`/charge/${id}/delete/`);
};

/* ================= Ambulance Bills ================= */

export const createAmbulanceBill = (payload) => {
  return api.post("/ambulance-bill/create/", payload);
};

export const getAmbulanceBills = (search = "") => {
  const params = search ? { search } : {};
  return api.get("/ambulance-bill/", { params });
};

export const getAmbulanceBillDetail = (id) => {
  return api.get(`/ambulance-bill/${id}/`);
};

// 🔥 USE PATCH (works now)
export const updateAmbulanceBill = (id, payload) => {
  return api.patch(`/ambulance-bill/${id}/update/`, payload);
};

export const deleteAmbulanceBill = (id) => {
  return api.delete(`/ambulance-bill/${id}/delete/`);
};