import { axiosClient } from '@/shared/lib/axios';

const API_URL_PREFIX = '/enrollments';

export const enrollmentApi = {
  create: async (payload: { course_id: string }) => {
    const res = await axiosClient.post(`${API_URL_PREFIX}`, payload);
    return res.data;
  },

  getMyEnrollments: async () => {
    const res = await axiosClient.get(`${API_URL_PREFIX}/my`);
    return res.data.data as {
      course_id: string;
      course_name: string;
      credits: number;
      department: string;
      enrolled_at: string;
      semester_id: string;
    }[];
  },

  deleteMyEnrollments: async () => {
    const res = await axiosClient.delete(`${API_URL_PREFIX}/my`);
    return res.data;
  },
};
