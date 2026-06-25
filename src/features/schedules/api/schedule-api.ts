import { axiosClient } from '@/shared/lib/axios';

export interface GenerateSchedulePayload {
  semester_id: string;
  max_solutions?: number;
}

export interface SaveSchedulePayload {
  schedule_id: number;
  semester_id: string;
}

export interface ActiveSemesterResponse {
  semester_id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export const scheduleApi = {
  getActiveSemester: async (): Promise<ActiveSemesterResponse> => {
    const res = await axiosClient.get('/semesters/active');
    return res.data;
  },

  generateSchedules: async (payload: GenerateSchedulePayload) => {
    const res = await axiosClient.post('/schedules/generate', payload);
    return res.data;
  },

  saveSchedule: async (payload: SaveSchedulePayload) => {
    const res = await axiosClient.post('/schedules/save', payload);
    return res.data;
  },

  // GET /schedules — trả tất cả schedules, dùng để filter is_selected=true
  getAllSchedules: async () => {
    const res = await axiosClient.get('/schedules');
    return res.data;
  },
};
