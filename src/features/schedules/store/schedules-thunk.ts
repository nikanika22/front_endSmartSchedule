import { createAsyncThunk } from '@reduxjs/toolkit';
import { scheduleApi } from '../api/schedule-api';
export const generateScheduleThunk = createAsyncThunk(
  'schedules/generate',
  async (_, thunkAPI) => {
    try {
      const result = await scheduleApi.generateSchedules();
      return { result };
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Không thể sinh thời khóa biểu. Vui lòng thử lại.';
      console.log('Lỗi sinh TKB:', errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

