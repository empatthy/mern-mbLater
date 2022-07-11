import { AxiosResponse } from 'axios';
import { INotification } from '../models/INotification';
import $api from '../http';

export default class NotificationService {
  static async createNotification(
    senderId: string,
    receiverId: string,
    notificationType: number,
    date: string,
    to: string,
  ): Promise<AxiosResponse<INotification>> {
    return await $api.post<INotification>('/api/notification/createNotification', {
      senderId,
      receiverId,
      notificationType,
      date,
      to,
    });
  }

  static async removeNotification(senderId: string, to: string) {
    return await $api.delete('/api/notification/removeNotification', {
      data: {
        senderId,
        to,
      },
    });
  }

  static async getNotifications(userId: string): Promise<AxiosResponse<INotification[]>> {
    return await $api.get<INotification[]>('/api/notification/getNotifications', {
      params: {
        userId,
      },
    });
  }

  static async allNotificationsRead(receiverId: string) {
    return await $api.post('/api/notification/allNotificationsRead', receiverId);
  }
}
