import api from './axiosInstance';

export const getDashboardData = async () => {
    return await api.get('dashboard/');
};
