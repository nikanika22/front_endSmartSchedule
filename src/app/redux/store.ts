import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/auth/store/auth-slice';
import schedulesReducer from '@/features/schedules/store/schedules-slice';
import scheduleConfigReducer from '@/features/schedule-config/store/schedule-config-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    schedules: schedulesReducer,
    scheduleConfig: scheduleConfigReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
