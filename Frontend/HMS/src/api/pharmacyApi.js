import api from "./axiosInstance"


// Category APIs
export const getMedicineCategories = () => {
  return api.get("pharmacy/category/");
}
export const createMedicineCategory = (data) => {
  return api.post("pharmacy/category/create/", data);
}
export const updateMedicineCategory = (id, data) => {
  return api.put(`pharmacy/category/${id}/update/`, data);
}
export const deleteMedicineCategory = (id) => {
  return api.delete(`pharmacy/category/${id}/delete/`);
}

// Company APIs
export const getCompanies = () => {
  return api.get("pharmacy/company/");
}
export const createCompany = (data) => {
  return api.post("pharmacy/company/create/", data);
}
export const updateCompany = (id, data) => {
  return api.put(`pharmacy/company/${id}/update/`, data);
}
export const deleteCompany = (id) => {
  return api.delete(`pharmacy/company/${id}/delete/`);
}

// Medicine Group APIs
export const getMedicineGroups = () => {
  return api.get("pharmacy/groups/");
}
export const createMedicineGroup = (data) => {
  return api.post("pharmacy/groups/create/", data);
}
export const updateMedicineGroup = (id, data) => {
  return api.put(`pharmacy/groups/${id}/update/`, data);
}
export const deleteMedicineGroup = (id) => {
  return api.delete(`pharmacy/groups/${id}/delete/`);
}

// Unit APIs
export const getUnits = () => {
  return api.get("pharmacy/units/");
}
export const createUnit = (data) => {
  return api.post("pharmacy/units/create/", data);
}
export const updateUnit = (id, data) => {
  return api.put(`pharmacy/units/${id}/update/`, data);
}
export const deleteUnit = (id) => {
  return api.delete(`pharmacy/units/${id}/delete/`);
}

// Supplier APIs
export const getSuppliers = () => {
  return api.get("pharmacy/suppliers/");
}
export const createSupplier = (data) => {
  return api.post("pharmacy/suppliers/create/", data);
}
export const updateSupplier = (id, data) => {
  return api.put(`pharmacy/suppliers/${id}/update/`, data);
}
export const deleteSupplier = (id) => {
  return api.delete(`pharmacy/suppliers/${id}/delete/`);
}

// Medicine Dosage APIs
export const getMedicineDosages = () => {
  return api.get("pharmacy/medicinedosages/");
}
export const createMedicineDosage = (data) => {
  return api.post("pharmacy/medicinedosages/create/", data);
}
export const updateMedicineDosage = (id, data) => {
  return api.put(`pharmacy/medicinedosages/${id}/update/`, data);
}
export const deleteMedicineDosage = (id) => {
  return api.delete(`pharmacy/medicinedosages/${id}/delete/`);
}

// Dosage APIs (Interval/Duration)
export const getDosages = () => {
  return api.get("pharmacy/dosages/");
}
export const createDosage = (data) => {
  return api.post("pharmacy/dosages/create/", data);
}
export const updateDosage = (id, data) => {
  return api.put(`pharmacy/dosages/${id}/update/`, data);
}
export const deleteDosage = (id) => {
  return api.delete(`pharmacy/dosages/${id}/delete/`);
}


export const addMedicine = (data) => {
  return api.post("pharmacy/medicines/create/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export const updateMedicine = (id, data) => {
  return api.patch(`pharmacy/medicines/${id}/update/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};


export const getMedicines = (params) => {
  return api.get("pharmacy/medicines/", { params });
}

export const deleteMedicine = (id) => {
  return api.delete(`pharmacy/medicines/${id}/delete/`);
}

export const getMedicineDetail = (id) => {
  return api.get(`pharmacy/medicines/${id}/`);
};

export const getMedicineStock = (id) => {
  return api.get(`pharmacy/medicines/${id}/stock/`);
};



// ---------------- Purchases ----------------
export const createPurchase = (data) => {
  return api.post("pharmacy/purchases/create/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export const getPurchases = (params) => {
  return api.get("pharmacy/purchases/", params ? { params } : undefined);
}

export const getPurchase = (id) => {
  return api.get(`pharmacy/purchases/${id}/`);
}

export const deletePurchase = (id) => {
  return api.delete(`pharmacy/purchases/${id}/delete/`);
}

// ---------------- Bills ----------------
export const generatePharmacyBill = (data) => {
  return api.post("pharmacy/bills/create/", data);
}

export const getPharmacyBills = () => {
  return api.get("pharmacy/bills/");
}

export const updatePharmacyBill = (id, data) => {
  return api.patch(`pharmacy-bills/${id}/update/`, data);
};


export const deletePharmacyBill = (id) => {
  return api.delete(`pharmacy/bills/${id}/delete/`);
}

export const getBillingMedicines = () => {
  return api.get("pharmacy/billing/medicines/");
};

export const getBillingBatches = (medicineId) => {
  return api.get(`pharmacy/billing/batches/${medicineId}/`);
};
