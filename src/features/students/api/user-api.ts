import { axiosClient } from '@/shared/lib/axios';

const API_URL_PREFIX = 'auth';
export const userRoleUserApi = {
  get: async () => {
    const res = await axiosClient.get(`${API_URL_PREFIX}/me`);

    return res.data;
  },
};
