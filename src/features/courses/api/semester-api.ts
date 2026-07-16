import { axiosClient } from '@/shared/lib/axios';

export const semesterApi = {
  getAll: () => {
    return axiosClient.get('/semesters');
  },
  getActive: () => {
    return axiosClient.get('/semesters/active');
  },
  setActive: (id: string) => {
    return axiosClient.patch(`/semesters/${id}/activate`);
  },
  create: (data: { semester_id: string; name: string; start_date: string; end_date: string }) => {
    return axiosClient.post('/semesters', data);
  }
};
