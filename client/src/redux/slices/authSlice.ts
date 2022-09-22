import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../models/IUser';
import axios from 'axios';
import AuthService from '../../services/AuthService';
import FileService from '../../services/FileService';
import { AuthResponse } from '../../models/response/AuthResponse';
import { API_URL } from '../../http';
import { RootState } from '../store';

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

export type UploadAvatarPayload = {
  userId: string;
  formData: FormData;
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

export const uploadAvatar = createAsyncThunk(
  'auth/uploadAvatar',
  async (data: UploadAvatarPayload) => {
    const { userId, formData } = data;
    const response = await FileService.uploadAvatar(userId, formData);
    return response.data;
  },
);

export const removeAvatar = createAsyncThunk('auth/removeAvatar', async (userId: string) => {
  const response = await FileService.removeAvatar(userId);
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
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.user.avatarUrl = action.payload;
      })
      .addCase(removeAvatar.fulfilled, (state) => {
        state.user.avatarUrl = '';
      });
  },
});

export const selectIsAuth = (state: RootState) => state.auth.isAuth;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectUserId = (state: RootState) => state.auth.user._id;
export const selectUserName = (state: RootState) => state.auth.user.name;

export default authSlice.reducer;
