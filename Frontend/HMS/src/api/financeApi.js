import api from "./axiosInstance"

export const getIncomeHeads = () => {
  return api.get("/finance/incomehead/");
};



export const createIncome = (data) => {
  return api.post("/finance/income/create/", data);
};

export const getIncomes = () => {
  return api.get("/finance/income/");
};

export const deleteIncome = (id) => {
  return api.delete(`/finance/income/${id}/delete`);
};

export const updateIncome = (id, data) => {
  return api.put(`/finance/income/${id}/update/`, data);
};

export const getIncomeDetail = (id) => {
  return api.get(`/finance/income/${id}/details/`);
};

