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

