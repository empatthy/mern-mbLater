import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IArticle } from '../models/IArticle';
import axios from 'axios';
import { API_URL } from '../http';
import { RootState } from '../store/store';

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
  const response = await axios.get(`${API_URL}/api/article/articles`);
  return response.data;
});

export const addArticle = createAsyncThunk(
  'articles/addArticle',
  async (data: addArticlePayload) => {
    const response = await axios.post(`${API_URL}/api/article/add`, data);
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
        state.status = 'succeeded';
      })
      .addCase(fetchArticles.rejected, (state) => {
        state.status = 'rejected';
      })
      .addCase(addArticle.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export const selectAllArticles = (state: RootState) => state.articles.items;
export const selectArticlesStatus = (state: RootState) => state.articles.status;

export default articlesSlice.reducer;
