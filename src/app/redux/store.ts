import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/auth/store/auth-slice';
import schedulesReducer from '@/features/schedules/store/schedules-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    schedules: schedulesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
