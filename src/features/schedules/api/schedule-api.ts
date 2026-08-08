import { axiosClient } from '@/shared/lib/axios';
import type {
  ConfirmedSchedule,
  ScheduleSolution,
} from '../types/schedule-types';

interface GenerateSchedulesResponse {
  schedules?: ScheduleSolution[];
}

export const scheduleApi = {
  generateSchedules: async (): Promise<GenerateSchedulesResponse> => {
    const res = await axiosClient.post('/schedules/generate');
    return res.data;
  },

  saveSchedule: async (payload: { schedule_id: number }): Promise<ConfirmedSchedule> => {
    const res = await axiosClient.post('/schedules/save', payload);
    return res.data;
  },

  // GET /schedules/current — Lấy trực tiếp lịch học đã được xác nhận
  getCurrentSchedule: async (): Promise<ConfirmedSchedule | null> => {
    const res = await axiosClient.get('/schedules/current');
    return res.data;
  },
};
