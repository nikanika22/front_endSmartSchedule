import { axiosClient } from '@/shared/lib/axios';

export const uploadApi = {
  uploadCourses: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosClient.post('/courses/upload-courses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  uploadClasses: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosClient.post('/courses/upload-classes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
