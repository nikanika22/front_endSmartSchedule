import { axiosClient } from '@/shared/lib/axios';

const API_URL_PREFIX = '/courses';

export const getCourseOptions = async () => {
  const res = await axiosClient.get(`${API_URL_PREFIX}/options`, {});

  return res.data;
};

export const courseApi = {
  getAll: async (params?: any) => {
    const res = await axiosClient.get(`${API_URL_PREFIX}`);
    const courses = res.data || [];
    // Hỗ trợ phân trang phía client
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const items = courses.slice(startIndex, endIndex);

    return {
      data: {
        items: items,
        pagination: {
          total: courses.length,
          page: page,
          limit: limit,
        }
      }
    };
  },

  getDetail: async (id: string) => {
    const res = await axiosClient.get(`${API_URL_PREFIX}/${id}`);
    return res.data;
  },

  create: async (payload: any) => {
    const res = await axiosClient.post(`${API_URL_PREFIX}`, payload);
    return res.data;
  },

  update: async (id: string, payload: any) => {
    const res = await axiosClient.patch(`${API_URL_PREFIX}/${id}`, payload);
    return res.data;
  },
  
  remove: async (id: string) => {
    const res = await axiosClient.delete(`${API_URL_PREFIX}/${id}`);
    return res.data;
  },
};
