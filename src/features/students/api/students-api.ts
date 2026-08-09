import { axiosClient } from '@/shared/lib/axios';
import type { Student } from '../types/students-type';

export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    const res = await axiosClient.get('/students');
    const payload = res.data;
    return payload;
  },

  remove: async (studentId: number): Promise<void> => {
    await axiosClient.delete(`/students/${studentId}`);
  },
};
