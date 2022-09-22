import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IComment } from '../../models/IComment';
import { RootState } from '../store';
import CommentService from '../../services/CommentService';

interface CommentState {
  items: IComment[];
  answers: IComment[];
  status: 'idle' | 'loading' | 'succeeded' | 'rejected';
}

const initialState: CommentState = {
  items: [],
  answers: [],
  status: 'idle',
};

export interface AddCommentPayload {
  body: string;
  articleId: string;
  userId: string;
  date: string;
}

export interface PatchCommentPayload {
  commentId: string;
  body: string;
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

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId: string) => {
    const response = await CommentService.deleteComment(commentId);
    return response.data;
  },
);

export const patchComment = createAsyncThunk(
  'comments/patchComment',
  async (data: PatchCommentPayload) => {
    const { commentId, body } = data;
    const response = await CommentService.patchComment(commentId, body);
    console.log(response.data);
    return response.data;
  },
);

export const replyComment = createAsyncThunk(
  'comments/replyComment',
  async (data: AddReplyPayload) => {
    const { body, articleId, userId, date, answerTo } = data;
    const response = await CommentService.replyComment(body, articleId, userId, date, answerTo);
    console.log(response.data);
    return response.data;
  },
);

export const getArticleComments = createAsyncThunk(
  'comments/getArticleComments',
  async (articleId: string) => {
    const response = await CommentService.getArticleComments(articleId);
    return response.data;
  },
);

export const getCommentReplies = createAsyncThunk(
  'comments/getCommentReplies',
  async (commentId: string) => {
    const response = await CommentService.getCommentReplies(commentId);
    return response.data;
  },
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    answersReset: (state, action) => {
      state.answers = state.answers.filter((item) => item.answerTo._id !== action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addComment.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.items.sort((a, b) => b.date.localeCompare(a.date));
      })
      .addCase(patchComment.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? (item = action.payload) : item,
        );
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        state.answers = state.answers.filter((item) => item.answerTo !== action.payload);
      })
      .addCase(getArticleComments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getArticleComments.fulfilled, (state, action) => {
        state.items = action.payload;
        state.items.sort((a, b) => b.date.localeCompare(a.date));
        state.status = 'succeeded';
      })
      .addCase(getCommentReplies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCommentReplies.fulfilled, (state, action) => {
        state.answers = state.answers.concat(action.payload);
        state.status = 'succeeded';
      })
      .addCase(replyComment.fulfilled, (state, action) => {
        state.answers.push(action.payload);
        state.items
          .find((item) => item._id === action.payload.answerTo._id)
          ?.replies.push(action.payload._id);
        state.status = 'succeeded';
      });
  },
});

export const selectArticleComments = (state: RootState) =>
  state.comments.items.filter((item) => !item.answerTo);
export const selectCommentReplies = (state: RootState, commentId: string) =>
  state.comments.answers.filter((answer) => answer.answerTo._id === commentId);

export const { answersReset } = commentsSlice.actions;

export default commentsSlice.reducer;
