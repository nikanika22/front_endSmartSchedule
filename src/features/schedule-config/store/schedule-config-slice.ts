import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { PersonalEvent, PreferredSlot } from '../types';
import {
  fetchScheduleConfigThunk,
  savePreferencesThunk,
  createPersonalEventThunk,
  deletePersonalEventThunk,
} from './schedule-config-thunk';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface ScheduleConfigState {
  personalEvents: PersonalEvent[];
  preferredSlot: PreferredSlot | null;
  avoidDays: number[];
  fetchStatus: Status;
  saveStatus: Status;
  mutateStatus: Status; // create / delete events
  error: string | null;
}

const initialState: ScheduleConfigState = {
  personalEvents: [],
  preferredSlot: null,
  avoidDays: [],
  fetchStatus: 'idle',
  saveStatus: 'idle',
  mutateStatus: 'idle',
  error: null,
};

const scheduleConfigSlice = createSlice({
  name: 'scheduleConfig',
  initialState,
  reducers: {
    setPreferredSlot(state, action: PayloadAction<PreferredSlot | null>) {
      state.preferredSlot = action.payload;
    },
    setAvoidDays(state, action: PayloadAction<number[]>) {
      state.avoidDays = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // --- fetchScheduleConfigThunk ---
    builder
      .addCase(fetchScheduleConfigThunk.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchScheduleConfigThunk.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.personalEvents = action.payload.events;
        state.preferredSlot = action.payload.preferences.preferred_slot || null;
        state.avoidDays = action.payload.preferences.avoid_days || [];
      })
      .addCase(fetchScheduleConfigThunk.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload as string;
      });

    // --- savePreferencesThunk ---
    builder
      .addCase(savePreferencesThunk.pending, (state) => {
        state.saveStatus = 'loading';
        state.error = null;
      })
      .addCase(savePreferencesThunk.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        // Sync local state với những gì vừa lưu
        if (action.payload.preference) {
          state.preferredSlot = action.payload.preference.preferred_slot;
        }
        if (action.payload.avoidDays) {
          state.avoidDays = action.payload.avoidDays.days;
        }
      })
      .addCase(savePreferencesThunk.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.payload as string;
      });

    // --- createPersonalEventThunk ---
    builder
      .addCase(createPersonalEventThunk.pending, (state) => {
        state.mutateStatus = 'loading';
        state.error = null;
      })
      .addCase(createPersonalEventThunk.fulfilled, (state, action) => {
        state.mutateStatus = 'succeeded';
        // Optimistic add: thêm event mới vào list ngay lập tức
        if (action.payload) {
          state.personalEvents.push(action.payload as PersonalEvent);
        }
      })
      .addCase(createPersonalEventThunk.rejected, (state, action) => {
        state.mutateStatus = 'failed';
        state.error = action.payload as string;
      });

    // --- deletePersonalEventThunk ---
    builder
      .addCase(deletePersonalEventThunk.pending, (state) => {
        state.mutateStatus = 'loading';
        state.error = null;
      })
      .addCase(deletePersonalEventThunk.fulfilled, (state, action) => {
        state.mutateStatus = 'succeeded';
        // Optimistic remove: filter ngay trong store
        state.personalEvents = state.personalEvents.filter(
          (e) => e.event_id !== action.payload,
        );
      })
      .addCase(deletePersonalEventThunk.rejected, (state, action) => {
        state.mutateStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setPreferredSlot, setAvoidDays, clearError } = scheduleConfigSlice.actions;
export default scheduleConfigSlice.reducer;
