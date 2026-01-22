import api from "./axiosInstance";

/* ================= Birth Records ================= */

export const getBirthRecords = (search = "") => {
  const params = search ? { search } : {};
  return api.get("/birth-record/", { params });
};

export const getBirthRecordDetail = (id) => {
  return api.get(`/birth-record/${id}/`);
};

export const createBirthRecord = (data) => {
  const formData = new FormData();

  // Append all fields
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    }
  });

  return api.post("/birth-record/create/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateBirthRecord = (id, data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    }
  });

  return api.patch(`/birth-record/${id}/update/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteBirthRecord = (id) => {
  return api.delete(`/birth-record/${id}/delete/`);
};

/* ================= Death Records ================= */

export const getDeathRecords = (search = "") => {
  const params = search ? { search } : {};
  return api.get("/death-record/", { params });
};

export const getDeathRecordDetail = (id) => {
  return api.get(`/death-record/${id}/`);
};

export const createDeathRecord = (data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    }
  });

  return api.post("/death-record/create/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateDeathRecord = (id, data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined && data[key] !== "") {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key]);
      }
    }
  });

  return api.patch(`/death-record/${id}/update/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteDeathRecord = (id) => {
  return api.delete(`/death-record/${id}/delete/`);
};
