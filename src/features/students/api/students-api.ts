import { axiosClient } from '@/shared/lib/axios';
import type { Student } from '../types/students-type';

export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    const res = await axiosClient.get('/students');
    // Backend có thể trả về { data: [...] } hoặc trực tiếp [...]
    const payload = res.data;
    return Array.isArray(payload) ? payload : (payload?.data ?? []);
  },

  remove: async (studentId: number): Promise<void> => {
    await axiosClient.delete(`/students/${studentId}`);
  },
};
