import api from './axiosInstance';



//******************************************************************************************//
//                                      Patient API                                         //
// *****************************************************************************************///
export const getPatientList = async () => {
  return api.get('patients/');
};

export const getPatientDetail = async (patientId) => {
  if (!patientId) throw new Error('Patient ID is required');
  return api.get(`patients/${patientId}/`);
};

export const createPatient = async (patientData) => {
  return api.post('patients/create/', patientData);
};

export const updatePatient = async (patientId, patientData) => {
  if (!patientId) throw new Error('Patient ID is required');
  return api.patch(`patients/${patientId}/update/`, patientData);
};

export const deletePatient = async (patientId) => {
  return api.delete(`patients/${patientId}/delete/`);
};

export const searchPatient = async (query) => {
  return api.get('patients/search/', {
    params: { q: query },
  });
};




//******************************************************************************************//
//                                      Patient Vital API                                   //
// *****************************************************************************************///

// 🔹 Get all vitals of a patient
export const getPatientVitals = (patientId) => {
  return api.get(`patients/${patientId}/vitals/`
  );
};

// 🔹 Create patient vital
export const createPatientVital = (patientId, data) => {
  return api.post(`patients/${patientId}/vitals/0/create/`,data);
};

// 🔹 Update patient vital
export const updatePatientVital = (patientId, vitalId, data) => {
  return api.put(`patients/${patientId}/vitals/${vitalId}/update/`,data);
};

// 🔹 Delete patient vital
export const deletePatientVital = (patientId, vitalId) => {
  return api.delete(`patients/${patientId}/vitals/${vitalId}/delete/`);
};




//******************************************************************************************//
//                                      Patient Operation API                                 //
// *****************************************************************************************///
// 🔹 Get all operations of a patient
export const getPatientOperations = (patientId) => {
  return api.get(`patients/${patientId}/operations/`);
};

// 🔹 Create patient operation
export const createPatientOperation = (patientId, data) => {
  return api.post(`patients/${patientId}/operations/0/create/`,data);
};

// 🔹 Update patient operation
export const updatePatientOperation = (patientId, operationId, data) => {
  return api.put(`patients/${patientId}/operations/${operationId}/update/`,data);
};

// 🔹 Delete patient operation
export const deletePatientOperation = (patientId, operationId) => {
  return api.delete(`patients/${patientId}/operations/${operationId}/delete/`);
};






//******************************************************************************************//
//                                      Patient Consultant API                                 //
// *****************************************************************************************///
// 🔹 Get all consultants of a patient
export const getPatientConsultants = (patientId) => {
  return api.get(`patients/${patientId}/consultants/`);
};

// 🔹 Create patient consultant
export const createPatientConsultant = (patientId, data) => {
  return api.post(`patients/${patientId}/consultants/0/create/`,data);
};

// 🔹 Update patient consultant
export const updatePatientConsultant = (patientId, consultantId, data) => {
  return api.put(`patients/${patientId}/consultants/${consultantId}/update/`,data);
};

// 🔹 Delete patient consultant
export const deletePatientConsultant = (patientId, consultantId) => {
  return api.delete(`patients/${patientId}/consultants/${consultantId}/delete/`);
};



//******************************************************************************************//
//                                      Patient Charges API                                 //
// *****************************************************************************************///
// 🔹 Get all charges of a patient
export const getPatientCharges = (patientId) => {
  return api.get(`patients/${patientId}/charges/`);
};

// 🔹 Create patient charge
export const createPatientCharge = (patientId, data) => {
  return api.post(`patients/${patientId}/charges/0/create/`,data);
};

// 🔹 Update patient charge
export const updatePatientCharge = (patientId, chargeId, data) => {
  return api.put(`patients/${patientId}/charges/${chargeId}/update/`,data);
};

// 🔹 Delete patient charge
export const deletePatientCharge = (patientId, chargeId) => {
  return api.delete(`patients/${patientId}/charges/${chargeId}/delete/`);
};


