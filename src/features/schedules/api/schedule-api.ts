import { axiosClient } from '@/shared/lib/axios';

export interface SaveSchedulePayload {
  schedule_id: number;
}

export interface ActiveSemesterResponse {
  semester_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export const scheduleApi = {
  generateSchedules: async () => {
    const res = await axiosClient.post('/schedules/generate');
    return res.data;
  },

  saveSchedule: async (payload: SaveSchedulePayload) => {
    const res = await axiosClient.post('/schedules/save', payload);
    return res.data;
  },

  // GET /schedules/current — Lấy trực tiếp lịch học đã được xác nhận
  getCurrentSchedule: async () => {
    const res = await axiosClient.get('/schedules/current');
    return res.data;
  },
};
