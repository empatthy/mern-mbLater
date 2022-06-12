import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IArticle } from '../models/IArticle';
import axios from 'axios';
import { API_URL } from '../http';
import { RootState } from '../store/store';
import ArtileService from '../services/ArticleService';
import ArticleService from '../services/ArticleService';

/* const articlesAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localCompare(a.date)
}); */

interface ArticlesState {
  items: IArticle[];
  status: 'idle' | 'loading' | 'succeeded' | 'rejected';
}

export type addArticlePayload = {
  title: string;
  description: string;
  body: string;
  author: string;
  date: string;
};

const initialState: ArticlesState = {
  items: [],
  status: 'idle',
};

export const fetchArticles = createAsyncThunk('articles/fetchArticles', async () => {
  const response = await ArtileService.fetchArticles();
  return response.data;
});

export const fetchUserArticles = createAsyncThunk(
  'articles/fetchUserArticles',
  async (userId: string) => {
    const response = await ArticleService.fetchUserArticles(userId);
    return response.data;
  },
);

export const addArticle = createAsyncThunk(
  'articles/addArticle',
  async (data: addArticlePayload) => {
    const response = await ArticleService.addArticle(data);
    return response.data;
  },
);

export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (articleId: string) => {
    const response = await ArticleService.deleteArticle(articleId);
    return response.data;
  },
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.items = action.payload;
        state.items.sort((a, b) => b.date.localeCompare(a.date));
        state.status = 'succeeded';
      })
      .addCase(fetchArticles.rejected, (state) => {
        state.status = 'rejected';
      })
      .addCase(fetchUserArticles.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserArticles.fulfilled, (state, action) => {
        state.items = action.payload;
        state.items.sort((a, b) => b.date.localeCompare(a.date));
        state.status = 'succeeded';
      })
      .addCase(fetchUserArticles.rejected, (state) => {
        state.status = 'rejected';
      })
      .addCase(addArticle.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.items.sort((a, b) => b.date.localeCompare(a.date));
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.items.sort((a, b) => b.date.localeCompare(a.date));
      });
  },
});

export const selectAllArticles = (state: RootState) => state.articles.items;
export const selectArticlesStatus = (state: RootState) => state.articles.status;
export const selectUsersArticles = (state: RootState, userId: string) =>
  state.articles.items.filter((item) => item.author._id === userId);

export default articlesSlice.reducer;
