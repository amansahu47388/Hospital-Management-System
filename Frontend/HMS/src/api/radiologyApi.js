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
