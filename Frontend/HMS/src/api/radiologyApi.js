import api from "./axiosInstance";


// ***************************************************************************** //
//                             RADILOGY CATEGORY API                             //
// ******************************************************************************//

export const getRadiologyCategory = () => {
  return api.get("/radiology/radiology-category/");
};

export const createRadiologyCategory = (data) => {
  return api.post("/radiology/radiology-category/create/", data);
};

export const updateRadiologyCategory = (id, payload) => {
  return api.put(`/radiology/radiology-category/${id}/update/`, payload);
};

export const deleteRadiologyCategory = (id) => {
  return api.delete(`/radiology/radiology-category/${id}/delete/`);
};





// ***************************************************************************** //
//                             RADILOGY PARAMETER API                                 //
// ******************************************************************************//

export const getRadiologyParameters = () => {
  return api.get("/radiology/radiology-parameter/");
};

export const createRadiologyParameter = (data) => {
  return api.post("/radiology/radiology-parameter/create/", data);
};

export const updateRadiologyParameter = (id, payload) => {
  return api.put(`/radiology/radiology-parameter/${id}/update/`, payload);
};

export const deleteRadiologyParameter = (id) => {
  return api.delete(`/radiology/radiology-parameter/${id}/delete/`);
};





// ***************************************************************************** //
//                             RADILOGY TEST API                                 //
// ******************************************************************************//

export const createRadiologyTest = (data) => {
  return api.post("/radiology/radiology-test/create/", data);
};

export const getRadiologyTests = () => {
  return api.get("/radiology/radiology-test/");
};

export const deleteRadiologyTest = (id) => {
  return api.delete(`/radiology/radiology-test/${id}/delete/`);
};

export const updateRadiologyTest = (id, payload) => {
  return api.put(`/radiology/radiology-test/${id}/update/`, payload);
};






// ***************************************************************************** //
//                             RADILOGY BILL API                                 //
// ******************************************************************************//

export const createRadiologyBill = async (payload) => {
  return api.post("/radiology/radiology-bill/create/", payload);
};

export const getRadiologyBills = async (search = "", patientId = "") => {
  const params = {};
  if (search) params.search = search;
  if (patientId) params.patient_id = patientId;
  return api.get("/radiology/radiology-bill/", { params });
};

export const getRadiologyBillDetail = async (id) => {
  return api.get(`/radiology/radiology-bill/${id}/`);
};

export const updateRadiologyBill = (id, payload) => {
  return api.put(`/radiology/radiology-bill/${id}/update/`, payload);
};

export const deleteRadiologyBill = (id) => {
  return api.delete(`/radiology/radiology-bill/${id}/delete/`);
};



export const searchPrescription = async (prescriptionId) => {
  return api.get("/radiology/prescription/search/", { params: { id: prescriptionId } });
};
