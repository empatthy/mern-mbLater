import { AxiosResponse } from 'axios';
import { IReaction } from '../models/IReaction';
import $api from '../http';

export default class ReactionService {
  static async addReaction(
    to: string,
    userId: string,
    reactionType: boolean,
  ): Promise<AxiosResponse<IReaction>> {
    return await $api.post<IReaction>('/api/reaction/addReaction', {
      to,
      userId,
      reactionType,
    });
  }

  static async getAllReactions(): Promise<AxiosResponse<IReaction[]>> {
    return await $api.get<IReaction[]>('/api/reaction/getAllReactions');
  }

  static async getItemReactions(to: string): Promise<AxiosResponse<IReaction[]>> {
    return await $api.get<IReaction[]>(`/api/reaction/getItemReactions/${to}`);
  }

  static async removeReaction(to: string, userId: string) {
    return await $api.delete(`/api/reaction/removeReaction`, {
      data: {
        to,
        userId,
      },
    });
  }
}
