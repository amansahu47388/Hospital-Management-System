import api from "./axiosInstance"

// Income Head APIs
export const getIncomeHeads = () => {
  return api.get("/finance/incomehead/");
};

export const createIncomeHead = (data) => {
  return api.post("/finance/incomehead/create/", data);
};

export const updateIncomeHead = (id, data) => {
  return api.put(`/finance/incomehead/${id}/update/`, data);
}; 

export const deleteIncomeHead = (id) => {
  return api.delete(`/finance/incomehead/${id}/delete/`);
};



// Expense Head APIs
export const getExpenseHeads = () => {
  return  api.get("/finance/expensehead/");
};

export const createExpenseHead = (data) => {
  return api.post("/finance/expensehead/create/", data);
};

export const updateExpenseHead = (id, data) => {
  return api.put(`/finance/expensehead/${id}/update/`, data);
};

export const deleteExpenseHead = (id) => {
  return api.delete(`/finance/expensehead/${id}/delete/`);
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



export const createExpense = (data) =>{
  return api.post("/finance/expense/", data);
};

export const getExpenses = () =>{
  return  api.get("/finance/expense/");
};

export const updateExpense = (id, data) =>{
  return api.put(`/finance/expense/${id}/update/`, data);
};

export const getExpenseDetail = (id) =>{
  return  api.get(`/finance/expense/${id}/details/`);
};

export const deleteExpense = (id) =>{
  return api.delete(`/finance/expense/${id}/delete/`);
};