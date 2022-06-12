import { IUser } from './IUser';
import { IArticle } from './IArticle';

export interface IComment {
  body: string;
  article: IArticle;
  author: IUser;
  date: string;
  answerTo: IComment;
  replies: string[];
  _id: string;
}
