import api from "./axiosInstance"

// ***************************************************************************** //
//                            PATHOLOGY CATEGORY API                             //
// ******************************************************************************//

export const getPathologyCategory = () => {
  return api.get("pathology/category");
};

export const createPathologyCategory = (data) => {
  return api.post("pathology/category/create/", data);
};

export const updatePathologyCategory = (id, payload) => {
  return api.put(`pathology/category/${id}/update/`, payload);
};

export const deletePathologyCategory = (id) => {
  return api.delete(`pathology/category/${id}/delete/`);
};


// ***************************************************************************** //
//                            PATHOLOGY PARAMETER API                            //
// ******************************************************************************//

export const getPathologyParameters = () => {
  return api.get("pathology/parameter");
};

export const createPathologyParameter = (data) => {
  return api.post("pathology/parameter/create/", data);
};

export const updatePathologyParameter = (id, payload) => {
  return api.put(`pathology/parameter/${id}/update/`, payload);
};

export const deletePathologyParameter = (id) => {
  return api.delete(`pathology/parameter/${id}/delete/`);
};





// ***************************************************************************** //
//                            PATHOLOGY TEST API                                 //
// ******************************************************************************//

export const createPathologyTest = (data) => {
  return api.post("pathology/pathology-test/create/", data);
};

export const getPathologyTests = () => {
  return api.get("pathology/pathology-test");
};

export const deletePathologyTest = (id) => {
  return api.delete(`pathology/pathology-test/${id}/delete/`);
};

export const updatePathologyTest = (id, payload) => {
  return api.put(`pathology/pathology-test/${id}/update/`, payload);
};




// ***************************************************************************** //
//                            PATHOLOGY BILL API                                 //
// ******************************************************************************//

export const createPathologyBill = async (payload) => {
  return api.post("pathology/pathology-bill/create/", payload);
};

export const getPathologyBills = async (search = "", patientId = "") => {
  const params = {};
  if (search) params.search = search;
  if (patientId) params.patient_id = patientId;
  return api.get("pathology/pathology-bill/", { params });
};

export const getPathologyBillDetail = async (id) => {
  return api.get(`pathology/pathology-bill/${id}/`);
};

export const searchPrescription = async (prescriptionId) => {
  return api.get("pathology/prescription/search/", { params: { id: prescriptionId } });
};

export const updatePathologyBill = (id, payload) => {
  return api.put(`pathology/pathology-bill/${id}/update/`, payload);
};

export const deletePathologyBill = (id) => {
  return api.delete(`pathology/pathology-bill/${id}/delete/`);
};
