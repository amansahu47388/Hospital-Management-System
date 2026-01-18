import api from "./axiosInstance"

export const getIncomeHeads = () => {
  return api.get("/finance/incomehead/");
};

export const getExpenseHeads = () => {
  return  api.get("/finance/expensehead/");
}



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



export const createExpense = (data) =>{
  return api.post("/finance/expense/", data);
}

export const getExpenses = () =>{
  return  api.get("/finance/expense/");
}

export const updateExpense = (id, data) =>{
  return api.put(`/finance/expense/${id}/update/`, data);
}

export const getExpenseDetail = (id) =>{
  return  api.get(`/finance/expense/${id}/details/`);
}

export const deleteExpense = (id) =>{
  return api.delete(`/finance/expense/${id}/delete/`);
}