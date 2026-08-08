import { createAsyncThunk } from '@reduxjs/toolkit';
import { scheduleApi } from '../api/schedule-api';

export const generateScheduleThunk = createAsyncThunk(
  'schedules/generate',
  async (_, thunkAPI) => {
    try {
      return await scheduleApi.generateSchedules();
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        'Không thể sinh thời khóa biểu. Vui lòng thử lại.';
      console.log('Lỗi sinh TKB:', errorMsg);
      return thunkAPI.rejectWithValue(errorMsg);
    }
  },
);

