import api from "./axiosInstance"

// ***************************************************************************** //
//                             CHARGES SETUP API                                 //
// ******************************************************************************//  
export const getChargeUnits = () => {
  return api.get("/setup/charge-units/");
};

export const createChargeUnit = (data) => {
  return api.post("/setup/charge-units/create/", data);
};

export const updateChargeUnit = (id, data) => {
  return api.put(`/setup/charge-units/${id}/update/`, data);
};

export const deleteChargeUnit = (id) => {
  return api.delete(`/setup/charge-units/${id}/delete/`);
};

// Tax Category APIs
export const getTaxCategories = () => {
  return api.get("/setup/charge-tax/");
};
export const createTaxCategory = (data) => {
  return api.post("/setup/charge-tax/create/", data);
};
export const updateTaxCategory = (id, data) => {
  return api.put(`/setup/charge-tax/${id}/update/`, data);
};
export const deleteTaxCategory = (id) => {
  return api.delete(`/setup/charge-tax/${id}/delete/`);
};

// Charge Type APIs
export const getChargeTypes = () => {
  return api.get("/setup/charge-type/");
};

export const createChargeType = (data) => {
  return api.post("/setup/charge-type/create/", data);
};

export const updateChargeType = (id, data) => {
  return api.put(`/setup/charge-type/${id}/update/`, data);
};

export const deleteChargeType = (id) => {
  return api.delete(`/setup/charge-type/${id}/delete/`);
};

// Charge Category APIs
export const getChargeCategories = () => {
  return api.get("/setup/charge-categories/");
};

export const createChargeCategory = (data) => {
  return api.post("/setup/charge-category/create/", data);
};

export const updateChargeCategory = (id, data) => {
  return api.put(`/setup/charge-category/${id}/update/`, data);
};

export const deleteChargeCategory = (id) => {
  return api.delete(`/setup/charge-category/${id}/delete/`);
};

// Hospital Charges APIs
export const getHospitalCharges = () => {
  return api.get("setup/charges/");
};

export const createHospitalCharge = (data) => {
  return api.post("/setup/charges/create/", data);
};

export const updateHospitalCharge = (id, data) => {
  return api.put(`/setup/charges/${id}/update/`, data);
};

export const deleteHospitalCharge = (id) => {
  return api.delete(`/setup/charges/${id}/delete/`);
};







// ***************************************************************************** //
//                             BAD SETUP API                                     //
// ******************************************************************************//
// Floor APIs
export const getFloors = () => {
  return api.get("/setup/floors/");
}

export const createFloor = (data) => {
  return api.post("/setup/floors/create/", data);
};

export const updateFloor = (id, data) => {
  return api.put(`/setup/floors/${id}/update/`, data);
};

export const deleteFloor = (id) => {
  return api.delete(`/setup/floors/${id}/delete/`);
};

// Bed Type APIs
/* -------- BED TYPE -------- */
export const getBedTypes = () => {
  return api.get("/setup/bed-types/");
};

export const createBedType = (data) => {
  return api.post("/setup/bed-type/create/", data);
};

export const updateBedType = (id, data) => {
  return api.put(`/setup/bed-type/${id}/update/`, data);
};

export const deleteBedType = (id) => {
  return api.delete(`/setup/bed-type/${id}/delete/`);
};

/* -------- BED GROUP -------- */
export const getBedGroups = () => {
  return api.get("/setup/bed-groups/");
};

export const createBedGroup = (data) => {
  api.post("/setup/bed-groups/create/", data);
}

export const updateBedGroup = (id, data) => {
  api.put(`/setup/bed-groups/${id}/update/`, data);
};

export const deleteBedGroup = (id) => {
  api.delete(`/setup/bed-groups/${id}/delete/`);
};

/* -------- BED -------- */
export const getBeds = () => {
  return api.get("/setup/beds/");
};

export const createBed = (data) => {
  return api.post("/setup/bed/create/", data);
};

export const updateBed = (id, data) => {
  return api.put(`/setup/bed/${id}/update/`, data);
};

export const deleteBed = (id) => {
  return api.delete(`/setup/bed/${id}/delete/`);
};





// ***************************************************************************** //
//                             OPERATIONS SETUP API                                     //
// ******************************************************************************//

export const getOperationSetups = () => {
  return api.get("setup/operation-setup/");
};

export const createOperationSetup = (data) => {
  return api.post("setup/operation-setup/create/", data);
};

export const updateOperationSetup = (id, data) => {
  return api.put(`/setup/operation-setup/${id}/update/`, data);
};

export const deleteOperationSetup = (id) => {
  return api.delete(`/setup/operation-setup/${id}/delete/`);
};










// ***************************************************************************** //
//                             SYMPTOMS SETUP API                                       //
// ******************************************************************************//

export const getSymptoms = () => {
  return api.get("setup/symptoms-setup/");
};

export const createSymptom = (data) => {
  return api.post("setup/symptoms-setup/create/", data);
};

export const updateSymptom = (id, data) => {
  return api.put(`/setup/symptoms-setup/${id}/update/`, data);
};

export const deleteSymptom = (id) => {
  return api.delete(`/setup/symptoms-setup/${id}/delete/`);
};

export const getSymptomTypes = () => {
  return api.get("setup/symptoms-types/");
};

