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

export const addMedicine = (data) =>{
    return api.post("/pharmacy/medicines/create/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export const getMedicines = () =>{
    return api.get("/pharmacy/medicines/");
}

export const deleteMedicine = (id) =>{
    return api.delete(`/pharmacy/medicines/${id}/delete/`);
}