import api from "./axiosInstance"

export const getHospitalCharges = () => {
  return api.get("setup/charges/");
};
