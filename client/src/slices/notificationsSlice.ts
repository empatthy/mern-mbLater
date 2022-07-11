import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store/store';
import { INotification } from '../models/INotification';
import NotificationService from '../services/NotificationService';

interface NotificationsState {
  items: INotification[];
  status: 'idle' | 'loading' | 'succeeded' | 'rejected';
}

const initialState: NotificationsState = {
  items: [],
  status: 'idle',
};

export type CreateNotificationPayload = {
  senderId: string;
  receiverId: string;
  notificationType: number;
  date: string;
  to: string;
};

export type RemoveNotificationPayload = {
  senderId: string;
  to: string;
};

export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (data: CreateNotificationPayload) => {
    const { senderId, receiverId, notificationType, date, to } = data;
    const response = await NotificationService.createNotification(
      senderId,
      receiverId,
      notificationType,
      date,
      to,
    );
    return response.data;
  },
);

export const removeNotification = createAsyncThunk(
  'notifications/removeNotification',
  async (data: RemoveNotificationPayload) => {
    const { senderId, to } = data;
    const response = await NotificationService.removeNotification(senderId, to);
    return response.data;
  },
);

export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (userId: string) => {
    const response = await NotificationService.getNotifications(userId);
    return response.data;
  },
);

export const allNotificationsRead = createAsyncThunk(
  'notifications/allNotificationsRead',
  async (receiverId: string) => {
    const response = await NotificationService.allNotificationsRead(receiverId);
    console.log(response.data);
    return response.data;
  },
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(createNotification.fulfilled, (state, action) => {})
      .addCase(getNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.items = action.payload;
        state.items.sort((a, b) => b.date.localeCompare(a.date));
        state.status = 'succeeded';
      })
      .addCase(removeNotification.fulfilled, (state, action) => {
        const { senderId, to } = action.payload;
        state.items = state.items.filter((item) => item.sender._id !== senderId && item._id !== to);
      })
      .addCase(allNotificationsRead.fulfilled, (state) => {
        state.items.forEach((item) => {
          item.read = true;
          item.new = false;
        });
      });
  },
});

export const selectNotifications = (state: RootState) => state.notifications.items;

export default notificationsSlice.reducer;
