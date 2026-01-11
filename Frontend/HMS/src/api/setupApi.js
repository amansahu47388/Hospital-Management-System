import api from "./axiosInstance"

export const getHospitalCharges = () => {
  return api.get("setup/charges/");
};

export const getSymptoms = () => {
  return api.get("setup/symptoms/");
};

export const getBeds = () => {
  return api.get("setup/beds/");
};

export const getChargeCategories = () => {
  return api.get("setup/charge-categories/");
};