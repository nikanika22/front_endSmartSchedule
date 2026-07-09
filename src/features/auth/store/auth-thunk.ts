import { createAsyncThunk } from '@reduxjs/toolkit';

import { loginApi, registerApi } from '../api/auth-api';
import type { LoginPayLoad,RegisterApiPayload } from '../types/auth-type';
import { userRoleUserApi } from '@/features/students/api/user-api';
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayLoad, thunkAPI) => {
    try {
      const res = await loginApi(payload);
      return res;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  },
);

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (payload: RegisterApiPayload, thunkAPI) => {
    try {
      const res = await registerApi(payload);
      return res;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Đăng ký tài khoản thất bại',
      );
    }
  },
);
export const getMeThunk = createAsyncThunk('auth/me', async (_, thunkAPI) => {
  try {
    const res = await userRoleUserApi.get();
    return res.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || 'Lấy thông tin người dùng thất bại',
    );
  }
});

