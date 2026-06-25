import { createAsyncThunk } from '@reduxjs/toolkit';
import { scheduleConfigApi } from '../api/schedule-config.api';
import type { UpdatePreferenceDto, AvoidDaysDto, CreatePersonalEventDto } from '../types';

// Thunk 1: Fetch toàn bộ config (personal events + preferences)
export const fetchScheduleConfigThunk = createAsyncThunk(
  'scheduleConfig/fetchAll',
  async (_, thunkAPI) => {
    try {
      const [eventsRes, prefsRes] = await Promise.all([
        scheduleConfigApi.getPersonalEvents(),
        scheduleConfigApi.getPreferences()
      ]);
      const events = Array.isArray(eventsRes)
        ? eventsRes
        : (eventsRes as any)?.data ?? [];
      const preferences = (prefsRes as any)?.data ?? { preferred_slot: null, avoid_days: [] };
      return { events, preferences };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Không thể tải cấu hình lịch học.',
      );
    }
  },
);

// Thunk 2: Lưu preferences (preferred_slot + avoid_days) cùng lúc
export const savePreferencesThunk = createAsyncThunk(
  'scheduleConfig/savePreferences',
  async (
    payload: { preference?: UpdatePreferenceDto; avoidDays?: AvoidDaysDto },
    thunkAPI,
  ) => {
    try {
      const promises: Promise<any>[] = [];
      if (payload.preference) {
        promises.push(scheduleConfigApi.updatePreferences(payload.preference));
      }
      if (payload.avoidDays) {
        promises.push(scheduleConfigApi.addAvoidDays(payload.avoidDays));
      }
      await Promise.all(promises);
      return payload;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Không thể lưu thiết lập.',
      );
    }
  },
);

// Thunk 3: Thêm personal event mới
export const createPersonalEventThunk = createAsyncThunk(
  'scheduleConfig/createEvent',
  async (data: CreatePersonalEventDto, thunkAPI) => {
    try {
      const res = await scheduleConfigApi.createPersonalEvent(data);
      return res;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Không thể thêm sự kiện cá nhân.',
      );
    }
  },
);

// Thunk 4: Xóa personal event
export const deletePersonalEventThunk = createAsyncThunk(
  'scheduleConfig/deleteEvent',
  async (eventId: number, thunkAPI) => {
    try {
      await scheduleConfigApi.deletePersonalEvent(eventId);
      return eventId; // trả về id để slice filter ra khỏi list
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 'Không thể xóa sự kiện cá nhân.',
      );
    }
  },
);
