import api from "./axiosInstance"

export const getHospitalCharges = () => {
  return api.get("setup/charges/");
};

export const getChargeCategories = () => {
  return api.get("setup/charge-categories/");
};