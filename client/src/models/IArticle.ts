import { IUser } from './IUser';

export interface IArticle {
  title: string;
  body: string;
  author: IUser;
  date: string;
  comments: string[];
  views: number;
  pictureUrl: string;
  _id: string;
}
