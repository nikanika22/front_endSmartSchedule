import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ScheduleSolution, ActiveSemester } from '../types/schedule-types';
import {
  generateScheduleThunk,
  fetchConfirmedScheduleThunk,
  confirmScheduleThunk,
} from './schedules-thunk';

type Status = 'idle' | 'loading' | 'succeeded' | 'failed';

interface SchedulesState {
  // 3 phương án đề xuất từ engine (có sau khi generate)
  solutions: ScheduleSolution[];
  // Học kỳ đang active
  activeSemester: ActiveSemester | null;
  // Tab đang xem (index string: '0' | '1' | '2')
  activeTabKey: string;
  // Lịch đã xác nhận (is_selected=true) — null nếu chưa chọn
  confirmedSchedule: any | null;
  // Trạng thái async
  generateStatus: Status;
  fetchStatus: Status;
  confirmStatus: Status;
  error: string | null;
}

const initialState: SchedulesState = {
  solutions: [],
  activeSemester: null,
  activeTabKey: '0',
  confirmedSchedule: null,
  generateStatus: 'idle',
  fetchStatus: 'idle',
  confirmStatus: 'idle',
  error: null,
};

const schedulesSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    setActiveTabKey(state, action: PayloadAction<string>) {
      state.activeTabKey = action.payload;
    },
    // Reset về idle khi user quay lại CoursePage để đăng ký lại
    resetSchedules(state) {
      state.solutions = [];
      state.confirmedSchedule = null;
      state.activeTabKey = '0';
      state.generateStatus = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // --- generateScheduleThunk ---
    builder
      .addCase(generateScheduleThunk.pending, (state) => {
        state.generateStatus = 'loading';
        state.error = null;
        state.solutions = [];
      })
      .addCase(generateScheduleThunk.fulfilled, (state, action) => {
        state.generateStatus = 'succeeded';
        state.activeSemester = action.payload.semester;
        state.solutions = action.payload.result?.schedules ?? [];
        state.activeTabKey = '0';
      })
      .addCase(generateScheduleThunk.rejected, (state, action) => {
        state.generateStatus = 'failed';
        state.error = action.payload as string;
      });

    // --- fetchConfirmedScheduleThunk ---
    builder
      .addCase(fetchConfirmedScheduleThunk.pending, (state) => {
        state.fetchStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchConfirmedScheduleThunk.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.confirmedSchedule = action.payload.confirmed;
        state.activeSemester = action.payload.semester;
      })
      .addCase(fetchConfirmedScheduleThunk.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.error = action.payload as string;
      });

    // --- confirmScheduleThunk ---
    builder
      .addCase(confirmScheduleThunk.pending, (state) => {
        state.confirmStatus = 'loading';
      })
      .addCase(confirmScheduleThunk.fulfilled, (state, action) => {
        state.confirmStatus = 'succeeded';
        // Backend trả về schedule đã update → lưu làm confirmed
        state.confirmedSchedule = action.payload;
        // Xóa solutions vì đã chọn xong
        state.solutions = [];
      })
      .addCase(confirmScheduleThunk.rejected, (state, action) => {
        state.confirmStatus = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setActiveTabKey, resetSchedules } = schedulesSlice.actions;
export default schedulesSlice.reducer;
