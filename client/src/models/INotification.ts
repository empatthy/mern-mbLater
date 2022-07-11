import { IUser } from './IUser';

export interface INotification {
  sender: IUser;
  receiver: IUser;
  notificationType: number;
  date: string;
  to: string;
  new: boolean;
  read: boolean;
  _id: string;
}
