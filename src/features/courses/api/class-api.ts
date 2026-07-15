import { axiosClient } from '@/shared/lib/axios';
import type { Class } from '../types/course-type';

export const classApi = {
  create: (data: Partial<Class>) => {
    return axiosClient.post('/classes', data);
  },
  update: (id: string, data: Partial<Class>) => {
    return axiosClient.patch(`/classes/${id}`, data);
  },
  delete: (id: string) => {
    return axiosClient.delete(`/classes/${id}`);
  }
};
