import api from "./axiosInstance";

export const getEvents = () => {
    return api.get("events/");
};

export const createEvent = (data) => {
    return api.post("events/", data);
};

export const updateEvent = (id, data) => {
    return api.put(`events/${id}/`, data);
};

export const deleteEvent = (id) => {
    return api.delete(`events/${id}/`);
};
