import { IArticle } from './IArticle';
import { IUser } from './IUser';

export interface IReaction {
  article: string;
  user: string;
  reactionType: boolean;
  _id: string;
}
