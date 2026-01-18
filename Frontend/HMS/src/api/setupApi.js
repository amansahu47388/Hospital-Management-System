import api from "./axiosInstance"

// ***************************************************************************** //
//                           CHARGES SETUP API                                 //
// ******************************************************************************//  
export const getChargeUnits = () =>{
  return api.get("/setup/charge-units/");
};

export const createChargeUnit = (data) =>{
 return api.post("/setup/charge-units/create/", data);
};

export const updateChargeUnit = (id, data) =>{
  return api.put(`/setup/charge-units/${id}/update/`, data);
};

export const deleteChargeUnit = (id) =>{
  return api.delete(`/setup/charge-units/${id}/delete/`);
};

// Tax Category APIs
export const getTaxCategories = () =>{
  return api.get("/setup/charge-tax/");
};
export const createTaxCategory = (data) =>{
  return api.post("/setup/charge-tax/create/", data);
};
export const updateTaxCategory = (id, data) =>{
  return api.put(`/setup/charge-tax/${id}/update/`, data);
};
export const deleteTaxCategory = (id) =>{
  return api.delete(`/setup/charge-tax/${id}/delete/`);
};


// Charge Type APIs
export const getChargeTypes = () =>{
  return api.get("/setup/charge-type/");
};

export const createChargeType = (data) =>{
  return api.post("/setup/charge-type/create/", data);
};

export const updateChargeType = (id, data) =>{
  return api.put(`/setup/charge-type/${id}/update/`, data);
};

export const deleteChargeType = (id) =>{
  return api.delete(`/setup/charge-type/${id}/delete/`);
};

// Charge Category APIs
export const getChargeCategories = () => {
  return api.get("/setup/charge-categories/");
};

export const createChargeCategory = (data) =>{
  return api.post("/setup/charge-category/create/", data);
};

export const updateChargeCategory = (id, data) =>{
  return api.put(`/setup/charge-category/${id}/update/`, data);
};

export const deleteChargeCategory = (id) =>{
  return api.delete(`/setup/charge-category/${id}/delete/`);
};

// Hospital Charges APIs
export const getHospitalCharges = () => {
  return api.get("setup/charges/");
};

export const createHospitalCharge = (data) =>{
  return api.post("/setup/charges/create/", data);
};

export const updateHospitalCharge = (id, data) =>{
  return api.put(`/setup/charges/${id}/update/`, data);
};

export const deleteHospitalCharge = (id) =>{
  return api.delete(`/setup/charges/${id}/delete/`);
};





export const getSymptoms = () => {
  return api.get("setup/symptoms/");
};

export const getBeds = () => {
  return api.get("setup/beds/");
};

