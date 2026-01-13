import api from "./axiosInstance"

export const getCategories = () => {
    return api.get("/inventory/categories/");
}

export const getSuppliers = () => {
    return api.get("/inventory/suppliers/");
}

export const getStores = () => {
    return api.get("/inventory/stores/");
}



export const getItems = () => {
    return api.get("/inventory/items/");
}

export const createItem = (data) => {
  return api.post("/inventory/items/create/", data);  
};

export const updateItem = (id, data) => {
    return api.put(`/inventory/items/${id}/update/`, data);
}

export const deleteItem = (id) => { 
    return api.delete(`/inventory/items/${id}/delete/`);
}



export const getItemStock = () => {
    return api.get("/inventory/stock/");
}

export const createItemStock = (data) =>{
   return api.post("/inventory/stock/create/", data, {
        headers: { "Content-Type": "multipart/form-data" },
  });
}

export const updateItemStock = (id, data) => {
  return api.put(`/inventory/stock/${id}/update/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteItemStock = (id) => {
  return api.delete(`/inventory/stock/${id}/delete/`);
};

export const getIssueItems = () =>{ 
   return api.get("/inventory/issueitems/")
}

export const createIssueItem = (data) =>{
    return api.post("/inventory/issueitems/create/", data)
}

export const deleteIssueItem = (id) => {
  return api.delete(`/inventory/issueitems/${id}/delete/`);
};


export const returnIssueItem = (issue_id) =>{
    return api.post("/inventory/issueitems/return/", { issue_id })
}

export const getStoreStock = (itemId, storeId) => {
    return api.get(`/inventory/store-stock/?item_id=${itemId}&store_id=${storeId}`)
}