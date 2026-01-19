import api from "./axiosInstance"

//  Category
export const getCategories = () => {
  return api.get("inventory/categories/");
};

export const createCategory = (data) => {
  return api.post("inventory/categories/create/", data);
};

export const updateCategory = (id, data) => {
  return api.put(`inventory/categories/${id}/update/`, data);
};

export const deleteCategory = (id) => {
  return api.delete(`inventory/categories/${id}/delete/`);
};



// Supplier
export const getSuppliers = () => {
  return api.get("inventory/suppliers/");
};

export const createSupplier = (data) => {
  return api.post("inventory/suppliers/create/", data);
};

export const updateSupplier = (id, data) => {
  return api.put(`inventory/suppliers/${id}/update/`, data);
};

export const deleteSupplier = (id) => {
  return api.delete(`inventory/suppliers/${id}/delete/`);
};




// Store
export const getStores = () => {
  return api.get("inventory/stores/");
};

export const createStore = (data) => {
  return api.post("inventory/stores/create/", data);
};

export const updateStore = (id, data) => {
  return api.put(`inventory/stores/${id}/update/`, data);
};

export const deleteStore = (id) => {
  return api.delete(`inventory/stores/${id}/delete/`);
};






export const getItems = () => {
  return api.get("inventory/items/");
}

export const createItem = (data) => {
  return api.post("inventory/items/create/", data);
};

export const updateItem = (id, data) => {
  return api.put(`inventory/items/${id}/update/`, data);
}

export const deleteItem = (id) => {
  return api.delete(`inventory/items/${id}/delete/`);
}




// Item Stock
export const getItemStock = () => {
  return api.get("inventory/stock/");
}

export const createItemStock = (data) => {
  return api.post("inventory/stock/create/", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export const updateItemStock = (id, data) => {
  return api.put(`inventory/stock/${id}/update/`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteItemStock = (id) => {
  return api.delete(`inventory/stock/${id}/delete/`);
};


// Issue Item
export const getIssueItems = () => {
  return api.get("inventory/issueitems/")
}

export const createIssueItem = (data) => {
  return api.post("inventory/issueitems/create/", data)
}

export const deleteIssueItem = (id) => {
  return api.delete(`inventory/issueitems/${id}/delete/`);
};


export const returnIssueItem = (issue_id) => {
  return api.post("inventory/issueitems/return/", { issue_id })
}

export const getStoreStock = (itemId, storeId) => {
  return api.get(`inventory/store-stock/?item_id=${itemId}&store_id=${storeId}`)
}
