import { createAsyncThunk } from '@reduxjs/toolkit';
import { scheduleApi } from '../api/schedule-api';
import type { GenerateSchedulePayload, SaveSchedulePayload } from '../api/schedule-api';

// Thunk 1: Generate 3 schedule suggestions (triggered from CoursePage after enroll)
export const generateScheduleThunk = createAsyncThunk(
  'schedules/generate',
  async (payload: GenerateSchedulePayload, thunkAPI) => {
    try {
      const semesterRes = await scheduleApi.getActiveSemester();
      const semesterId = payload.semester_id || semesterRes?.semester_id;
      const result = await scheduleApi.generateSchedules({
        ...payload,
        semester_id: semesterId,
      });
      return { semester: semesterRes, result };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Không thể sinh thời khóa biểu. Vui lòng thử lại.',
      );
    }
  },
);

// Thunk 2: Fetch the confirmed schedule (used on F5 / direct URL entry)
export const fetchConfirmedScheduleThunk = createAsyncThunk(
  'schedules/fetchConfirmed',
  async (_, thunkAPI) => {
    try {
      const [allSchedules, semester] = await Promise.all([
        scheduleApi.getAllSchedules(),
        scheduleApi.getActiveSemester(),
      ]);
      const confirmed = Array.isArray(allSchedules)
        ? allSchedules.find((s: any) => s.is_selected === true) ?? null
        : null;
      return { confirmed, semester };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Không thể tải thông tin lịch học.',
      );
    }
  },
);

// Thunk 3: Confirm & save the selected schedule
export const confirmScheduleThunk = createAsyncThunk(
  'schedules/confirm',
  async (payload: SaveSchedulePayload, thunkAPI) => {
    try {
      const res = await scheduleApi.saveSchedule(payload);
      return res;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Không thể lưu lịch học. Vui lòng thử lại.',
      );
    }
  },
);
