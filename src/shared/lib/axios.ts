import axios from 'axios';
import { HTTP_STATUS } from '../types/http-status';

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Gửi token kèm theo request
axiosClient.interceptors.request.use((config) => {
  // Đảm bảo tên key trùng khớp với auth-slice (ví dụ: 'accessToken')
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return config;
});

// Xử lý khi có lỗi phản hồi từ Server
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Nếu gặp lỗi 401 Unauthorized (Token sai hoặc hết hạn)
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      // 1. Xóa token lỗi khỏi localStorage
      localStorage.removeItem('accessToken');

      // 2. Chuyển hướng người dùng về trang Đăng nhập
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);