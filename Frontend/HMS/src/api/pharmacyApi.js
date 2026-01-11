import api from "./axiosInstance"


// dropdowns
export const getMedicineCategories = () =>{
    return api.get("/pharmacy/category/");
}

export const getCompanies = () =>{
    return api.get("/pharmacy/company/");
}

export const getMedicineGroups = () =>{
    return api.get("/pharmacy/groups/");
}
export const getUnits = () =>{
    return api.get("/pharmacy/units/");
}

export const getSuppliers = () =>{
    return api.get("/pharmacy/suppliers/");
}

export const addMedicine = (data) =>{
    return api.post("/pharmacy/medicines/create/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export const updateMedicine = (id, data) => {
  return api.patch(`/pharmacy/medicines/${id}/update/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


export const getMedicines = (params) =>{
    return api.get("/pharmacy/medicines/", { params });
}

export const deleteMedicine = (id) =>{
    return api.delete(`/pharmacy/medicines/${id}/delete/`);
}

export const getMedicineDetail = (id) =>{
  return api.get(`/pharmacy/medicines/${id}/`);
};

export const getMedicineStock = (id) =>{
  return api.get(`/pharmacy/medicines/${id}/stock/`);
};



// ---------------- Purchases ----------------
export const createPurchase = (data) =>{
    return api.post("/pharmacy/purchases/create/", data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}

export const getPurchases = (params) =>{
    return api.get("/pharmacy/purchases/", params ? { params } : undefined);
}

export const getPurchase = (id) =>{
    return api.get(`/pharmacy/purchases/${id}/`);
}

export const deletePurchase = (id) =>{
    return api.delete(`/pharmacy/purchases/${id}/delete/`);
}

// ---------------- Bills ----------------
export const generatePharmacyBill = (data) =>{
    return api.post("/pharmacy/bills/create/", data);
}

export const getPharmacyBills = () =>{
    return api.get("/pharmacy/bills/");
}

export const updatePharmacyBill = (id, data) => {
  return api.patch(`/pharmacy-bills/${id}/update/`, data);
};


export const deletePharmacyBill = (id) =>{
    return api.delete(`/pharmacy/bills/${id}/delete/`);
}

export const getBillingMedicines = () => {
  return api.get("/pharmacy/billing/medicines/");
};

export const getBillingBatches = (medicineId) => {
  return api.get(`/pharmacy/billing/batches/${medicineId}/`);
};
