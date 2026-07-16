import { axiosClient } from '@/shared/lib/axios';
import { semesterApi } from '@/features/courses/api/semester-api';
import type { algorithmCountResponse } from '../types/dashboard-types';

export const dashboardApi = {
  // GET /courses/quantity → số môn học
  getCourseQuantity: async (): Promise<number> => {
    const res = await axiosClient.get('/courses/quantity');
    return res.data;
  },

  // GET /classes/quantity → số lớp học
  getClassQuantity: async (): Promise<number> => {
    const res = await axiosClient.get('/classes/quantity');
    return res.data;
  },

  // GET /semesters/active → học kỳ đang active
  getActiveSemester: () => {
    return semesterApi.getActive();
  },
  getAlgorithmCounts: async (): Promise<algorithmCountResponse> => {
    const res = await axiosClient.get('/schedules/stats');
    return res.data;
  }
};
