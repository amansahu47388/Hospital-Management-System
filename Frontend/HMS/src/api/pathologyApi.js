import api from "./axiosInstance"

export const createPathologyTest = (data) => {
  return api.post("/pathology/pathology-test/create/", data);
};

export const getPathologyParameters = () => {
  return api.get("pathology/parameter");
};

export const getPathologyCategory = () => {
  return api.get("pathology/category");
};

export const getPathologyTests = () => {
  return api.get("pathology/pathology-test");
};

export const deletePathologyTest = (id) =>{
  return api.delete(`pathology/pathology-test/${id}/delete/`);
};

export const updatePathologyTest = (id, payload) => {
  return api.put(`pathology/pathology-test/${id}/update/`, payload);
};

export const createPathologyBill = async (payload) => {
  return api.post("/pathology/pathology-bill/create/", payload);
};

export const getPathologyBills = async (search = "") => {
  const params = search ? { search } : {};
  return api.get("/pathology/pathology-bill/", { params });
};

export const getPathologyBillDetail = async (id) => {
  return api.get(`/pathology/pathology-bill/${id}/`);
};

export const searchPrescription = async (prescriptionId) => {
  return api.get("/pathology/prescription/search/", { params: { id: prescriptionId } });
};