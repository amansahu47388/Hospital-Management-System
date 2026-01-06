import api from "./axiosInstance";

export const createRadiologyTest = (data) => {
  return api.post("/radiology/test/create/", data);
};

export const getRadiologyTests = () => {
  return api.get("/radiology/test/");
};

export const getRadiologyCategory = () => {
  return api.get("/radiology/category/");
};

export const getRadiologyParameters = () => {
  return api.get("/radiology/parameter/");
};

export const deleteRadiologyTest = (id) => {
  return api.delete(`/radiology/test/${id}/delete/`);
};

export const updateRadiologyTest = (id, payload) => {
  return api.put(`/radiology/test/${id}/update/`, payload);
};

export const createRadiologyBill = async (payload) => {
  return api.post("/radiology/radiology-bill/create/", payload);
};

export const getRadiologyBills = async (search = "") => {
  const params = search ? { search } : {};
  return api.get("/radiology/radiology-bill/", { params });
};

export const getRadiologyBillDetail = async (id) => {
  return api.get(`/radiology/radiology-bill/${id}/`);
};

export const searchPrescription = async (prescriptionId) => {
  return api.get("/radiology/prescription/search/", { params: { id: prescriptionId } });
};

export const updateRadiologyBill = (id, payload) => {
  return api.put(`/radiology/radiology-bill/${id}/update/`, payload);
};

export const deleteRadiologyBill = (id) => {
  return api.delete(`/radiology/radiology-bill/${id}/delete/`);
};
