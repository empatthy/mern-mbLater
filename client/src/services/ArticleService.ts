import $api from '../http';
import { AxiosResponse } from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
import { IArticle } from '../models/IArticle';
import { addArticlePayload } from '../slices/articlesSlice';

export default class ArticleService {
  /* static fetchArticles(): Promise<AxiosResponse<IArticle[]>> {
    return $api.get<IArticle[]>('api/auth/articles');
  } */
}
