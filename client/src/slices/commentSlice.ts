import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IComment } from '../models/IComment';
import { RootState } from '../store/store';
import CommentService from '../services/CommentService';

interface CommentState {
  items: IComment[];
  status: 'idle' | 'loading' | 'succeeded' | 'rejected';
}

const initialState: CommentState = {
  items: [],
  status: 'idle',
};

export interface AddCommentPayload {
  body: string;
  articleId: string;
  userId: string;
  date: string;
}

export interface AddReplyPayload {
  body: string;
  articleId: string;
  userId: string;
  date: string;
  answerTo: string;
}

export const addComment = createAsyncThunk(
  'comments/addComment',
  async (data: AddCommentPayload) => {
    const { body, articleId, userId, date } = data;
    const response = await CommentService.addComment(body, articleId, userId, date);
    return response.data;
  },
);

/* export const replyComment = createAsyncThunk(
  'comments/replyComment',
  async (data: AddReplyPayload) => {
    const { body, articleId, userId, date, answerTo } = data;
    const response = await CommentService.replyComment(body, articleId, userId, date, answerTo);
    return response.data;
  },
); */

export const getArticleComments = createAsyncThunk(
  'comments/getArticleComments',
  async (articleId: string) => {
    const response = await CommentService.getArticleComments(articleId);
    return response.data;
  },
);

/* export const getCommentReplies = createAsyncThunk(
  'comments/getCommentReplies',
  async (commentId: string) => {
    const response = await CommentService.getCommentReplies(commentId);
    return response.data;
  },
); */

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.items.sort((a, b) => b.date.localeCompare(a.date));
      })
      .addCase(getArticleComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getArticleComments.fulfilled, (state, action) => {
        state.items = action.payload;
        state.items.sort((a, b) => b.date.localeCompare(a.date));
        state.status = 'succeeded';
      });
  },
});

export const selectArticleComments = (state: RootState) => state.comments.items;

export default commentsSlice.reducer;
