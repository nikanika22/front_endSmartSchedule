import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ScheduleSolution } from '../types/schedule-types';
import { generateScheduleThunk } from './schedules-thunk';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface SchedulesState {
  solutions: ScheduleSolution[];
  activeTabKey: string;
  generateStatus: Status;
  error: string | null;
}

const initialState: SchedulesState = {
  solutions: [],
  activeTabKey: '0',
  generateStatus: 'idle',
  error: null,
};

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    setActiveTabKey(state, action: PayloadAction<string>) {
      state.activeTabKey = action.payload;
    },
    resetSchedules(state) {
      state.solutions = [];
      state.activeTabKey = '0';
      state.generateStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateScheduleThunk.pending, (state) => {
        state.generateStatus = 'loading';
        state.error = null;
        state.solutions = [];
      })
      .addCase(generateScheduleThunk.fulfilled, (state, action) => {
        state.generateStatus = 'succeeded';
        state.solutions = action.payload.schedules ?? [];
        state.activeTabKey = '0';
      })
      .addCase(generateScheduleThunk.rejected, (state, action) => {
        state.generateStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setActiveTabKey, resetSchedules } = schedulesSlice.actions;
export default schedulesSlice.reducer;
