import { IUser } from './IUser';

export interface IArticle {
  title: string;
  description: string;
  body: string;
  author: IUser;
  date: string;
  likes: number;
  dislikes: number;
  comments: string;
  _id: string;
}
