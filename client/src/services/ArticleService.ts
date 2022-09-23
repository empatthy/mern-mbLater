import $api from '../http';
import { AxiosResponse } from 'axios';
import { IArticle } from '../models/IArticle';
import { ArticlePayload, patchArticlePayload } from '../redux/slices/articlesSlice';

export default class ArticleService {
  static fetchArticles(): Promise<AxiosResponse<IArticle[]>> {
    return $api.get<IArticle[]>('/api/article/articles');
  }

  static getArticle(articleId: string): Promise<AxiosResponse<IArticle>> {
    return $api.get<IArticle>(`/api/article/${articleId}`);
  }

  static fetchUserArticles(userId: string): Promise<AxiosResponse<IArticle[]>> {
    return $api.get<IArticle[]>(`/api/article/userArticles/${userId}`);
  }

  static addArticle(data: ArticlePayload): Promise<AxiosResponse<IArticle>> {
    return $api.post<IArticle>('/api/article/add', data);
  }

  static patchArticle(
    articleId: string,
    articlePayload: patchArticlePayload,
  ): Promise<AxiosResponse<IArticle>> {
    return $api.patch<IArticle>(`/api/article/${articleId}`, articlePayload);
  }

  static deleteArticle(articleId: string): Promise<AxiosResponse> {
    return $api.delete(`/api/article/delete/${articleId}`);
  }
}
