import api from './axiosInstance';

// Get doctors list
export const getDoctors = async () => {
  return api.get('doctors/');
};

// Get admin profiles (typically one for the logged in user)
export const getAdminProfiles = async () => {
  return api.get('admin-profiles/');
};

// Update admin profile using PATCH to support partial updates and FormData
export const updateAdminProfile = async (id, data) => {
  // If data is FormData, we send it as is. If it's a plain object, we could optionally convert it or send as JSON.
  // The axiosInstance handles Content-Type correctly for FormData.
  return api.patch(`admin-profiles/${id}/`, data);
};