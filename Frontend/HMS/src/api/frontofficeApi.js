import api from "./axiosInstance";

// ==================== PURPOSE ====================
export const getPurposes = () => {
  return api.get("/front-office/purpose/");
}

export const createPurpose = (data) => {
  return api.post("/front-office/purpose/create/", data);
}

export const updatePurpose = (id, data) => {
  return api.put(`/front-office/purpose/${id}/update/`, data);
}

export const deletePurpose = (id) => {
  return api.delete(`/front-office/purpose/${id}/delete`);
}

// ==================== COMPLAINT TYPE ====================
export const getComplaintTypes = () => {
  return api.get("/front-office/complain-types/");
};

export const createComplaintType = (data) => {
  return api.post("/front-office/complain-types/create", data);
};

export const updateComplaintType = (id, data) => {
  return api.put(`/front-office/complain-types/${id}/update/`, data);
};

export const deleteComplaintType = (id) => {
  return api.delete(`/front-office/complain-types/${id}/delete/`);
};

// ==================== SOURCE ====================
export const getSources = () => {
  return api.get("/front-office/sources/");
};

export const createSource = (data) => {
  return api.post("/front-office/sources/create/", data);
};

export const updateSource = (id, data) => {
  return api.put(`/front-office/sources/${id}/update/`, data);
};

export const deleteSource = (id) => {
  return api.delete(`/front-office/sources/${id}/delete/`);
};




export const getVisitors = () => {
  return api.get("/front-office/visitor/");
}

export const createVisitor = (data) => {
  return api.post("/front-office/visitor/create/", data);
}

export const updateVisitor = (id, data) => {
  return api.put(`/front-office/visitor/${id}/update/`, data);
};

export const detailVisitor = (id, data) => {
  return api.get(`/front-office/visitor/${id}/details/`);
}

export const deleteVisitor = (id) => {
  return api.delete(`/front-office/visitor/${id}/delete/`);
}




export const getComplaints = () => {
  return api.get("/front-office/complain/");
};

export const getComplaintDetails = (id) => {
  return api.get(`/front-office/complain/${id}/details/`);
};

export const createComplaint = (data) => {
  return api.post("/front-office/complain/create/", data);
};

export const updateComplaint = (id, data) => {
  return api.put(`/front-office/complain/${id}/update/`, data);
};

export const deleteComplaint = (id) => {
  return api.delete(`/front-office/complain/${id}/delete/`);
};





export const createDispatch = (data) => {
  return api.post("/front-office/dispach/create/", data);
};

export const getDispatchList = () => {
  return api.get("/front-office/dispach/");
};

export const deleteDispatch = (id) => {
  return api.delete(`/front-office/dispach/${id}/delete/`);
};

export const updateDispatch = (id, data) => {
  return api.put(`/front-office/dispach/${id}/update/`, data);
};

export const getDispatchDetail = (id) => {
  return api.get(`/front-office/dispach/${id}/details/`);
};



export const createReceive = (data) => {
  return api.post("/front-office/receive/create/", data);
};

export const getReceiveList = () => {
  return api.get("/front-office/receive/");
}

export const deleteReceive = (id) => {
  return api.delete(`/front-office/receive/${id}/delete/`);
}

export const updateReceive = (id, data) =>
  api.put(`/front-office/receive/${id}/update/`, data);
