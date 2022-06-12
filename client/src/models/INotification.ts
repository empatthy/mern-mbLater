import { IUser } from './IUser';
import { IArticle } from './IArticle';

export interface INotification {
  user: IUser;
  type: 'commentReaction' | 'commentReply';
  date: string;
  message: string;
}
