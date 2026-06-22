import { axiosClient } from '@/shared/lib/axios';

const API_URL_PREFIX = '/enrollments';

export const enrollmentApi = {
  create: async (payload: { course_id: string }) => {
    const res = await axiosClient.post(`${API_URL_PREFIX}`, payload);
    return res.data;
  },
};
