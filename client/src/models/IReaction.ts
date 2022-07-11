import { IArticle } from './IArticle';
import { IUser } from './IUser';

export interface IReaction {
  to: string;
  user: string;
  reactionType: boolean;
  _id: string;
}
