import { AxiosResponse } from 'axios';
import { IReaction } from '../models/IReaction';
import $api from '../http';

export default class ReactionService {
  static async addReaction(
    articleId: string,
    userId: string,
    reactionType: boolean,
  ): Promise<AxiosResponse<IReaction>> {
    return await $api.post<IReaction>('/api/reaction/addReaction', {
      articleId,
      userId,
      reactionType,
    });
  }

  static async getAllReactions(): Promise<AxiosResponse<IReaction[]>> {
    return await $api.get<IReaction[]>('/api/reaction/getAllReactions');
  }

  static async getArticleReactions(articleId: string): Promise<AxiosResponse<IReaction[]>> {
    return await $api.get<IReaction[]>(`/api/reaction/getArticleReactions/${articleId}`);
  }

  static async removeReaction(articleId: string, userId: string) {
    return await $api.delete(`/api/reaction/removeReaction`, {
      data: {
        articleId,
        userId,
      },
    });
  }
}
