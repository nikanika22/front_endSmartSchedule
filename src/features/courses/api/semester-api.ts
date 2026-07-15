import { axiosClient } from '@/shared/lib/axios';

export const semesterApi = {
  getAll: () => {
    return axiosClient.get('/semesters');
  },
  getActive: () => {
    return axiosClient.get('/semesters/active');
  }
};
