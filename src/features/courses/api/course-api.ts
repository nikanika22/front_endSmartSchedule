import { axiosClient } from '@/shared/lib/axios';

const API_URL_PREFIX = '/courses';
export const courseApi = {
  getAll: async (params?: any) => {
    const res = await axiosClient.get(`${API_URL_PREFIX}`);
    let courses = res.data || [];

    // Filter phía Client — trên toàn bộ data đã load về browser
    if (params?.keySearch) {
      const key = params.keySearch.toLowerCase().trim();
      courses = courses.filter(
        (item: any) =>
          item.course_name?.toLowerCase().includes(key) ||
          item.course_id?.toLowerCase().includes(key)
      );
    }

    // Phân trang trên mảng đã được filter
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const items = courses.slice(startIndex, endIndex);

    return {
      data: {
        items: items,
        pagination: {
          total: courses.length, // tổng sau filter (để pagination hiển thị đúng)
          page: page,
          limit: limit,
        },
      },
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
