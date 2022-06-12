import $api from '../http';
import { Axios, AxiosResponse } from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
import { IArticle } from '../models/IArticle';
import { addArticlePayload } from '../slices/articlesSlice';

export default class ArticleService {
  static fetchArticles(): Promise<AxiosResponse<IArticle[]>> {
    return $api.get<IArticle[]>('api/article/articles');
  }

  static fetchUserArticles(userId: string): Promise<AxiosResponse<IArticle[]>> {
    return $api.get<IArticle[]>(`/api/article/userArticles/${userId}`);
  }

  static addArticle(data: addArticlePayload): Promise<AxiosResponse<IArticle>> {
    return $api.post(`/api/article/add`, data);
  }

  static deleteArticle(articleId: string): Promise<AxiosResponse> {
    return $api.delete(`/api/article/delete/${articleId}`);
  }
}
