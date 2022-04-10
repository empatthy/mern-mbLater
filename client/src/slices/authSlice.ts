import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../models/IUser';
import axios from 'axios';
import AuthService from '../services/AuthService';
import { AuthResponse } from '../models/response/AuthResponse';
import { API_URL } from '../http';
import { RootState } from '../store/store';

interface AuthState {
  user: IUser;
  isAuth: boolean;
  isLoading: boolean;
}

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegistrationPayload = {
  name: string;
  email: string;
  password: string;
};

const initialState: AuthState = {
  user: {} as IUser,
  isAuth: false,
  isLoading: false,
};

export const login = createAsyncThunk('auth/login', async (data: LoginPayload) => {
  const response = await AuthService.login(data.email, data.password);
  localStorage.setItem('token', response.data.accessToken);
  return response.data;
});

export const registration = createAsyncThunk(
  'auth/registration',
  async (data: RegistrationPayload) => {
    const response = await AuthService.registration(data.name, data.email, data.password);
    localStorage.setItem('token', response.data.accessToken);
    return response.data;
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await AuthService.logout();
  localStorage.removeItem('token');
  return response;
});

export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
  const response = await axios.get<AuthResponse>(`${API_URL}/api/auth/refresh`, {
    withCredentials: true,
  });
  localStorage.setItem('token', response.data.accessToken);
  return response.data;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuth = true;
        state.isLoading = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(registration.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuth = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = {} as IUser;
        state.isAuth = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuth = true;
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const selectIsAuth = (state: RootState) => state.auth.isAuth;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectUserId = (state: RootState) => state.auth.user.id;

export default authSlice.reducer;
