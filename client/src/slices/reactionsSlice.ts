import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IReaction } from '../models/IReaction';
import { RootState } from '../store/store';
import ReactionService from '../services/ReactionService';

interface ReactionsState {
  items: IReaction[];
  status: 'idle' | 'loading' | 'succeeded' | 'rejected';
}

const initialState: ReactionsState = {
  items: [],
  status: 'idle',
};

export type AddReactionPayload = {
  articleId: string;
  userId: string;
  reactionType: boolean;
};

export type RemoveReactionPayload = {
  articleId: string;
  userId: string;
};

export const addReaction = createAsyncThunk(
  'reactions/addReaction',
  async (data: AddReactionPayload) => {
    const { articleId, userId, reactionType } = data;
    const response = await ReactionService.addReaction(articleId, userId, reactionType);
    return response.data;
  },
);

export const getAllReactions = createAsyncThunk('reactions/getAllReactions', async () => {
  const response = await ReactionService.getAllReactions();
  return response.data;
});

export const getArticleReactions = createAsyncThunk(
  'reactions/getArticleReactions',
  async (articleId: string) => {
    const response = await ReactionService.getArticleReactions(articleId);
    return response.data;
  },
);

export const removeReaction = createAsyncThunk(
  'reactions/removeReaction',
  async (data: RemoveReactionPayload) => {
    const { articleId, userId } = data;
    const response = await ReactionService.removeReaction(articleId, userId);
    console.log(response.data);
    return response.data;
  },
);

const reactionsSlice = createSlice({
  name: 'reactions',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addReaction.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(getAllReactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllReactions.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getAllReactions.rejected, (state) => {
        state.status = 'rejected';
      })
      .addCase(getArticleReactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getArticleReactions.fulfilled, (state, action) => {
        state.items.push(...action.payload);
        state.status = 'succeeded';
      })
      .addCase(getArticleReactions.rejected, (state) => {
        state.status = 'rejected';
      })
      .addCase(removeReaction.fulfilled, (state, action) => {
        const { articleId, userId } = action.payload;
        const itemToRemove = state.items.find(
          (item) => item.article === articleId && item.user === userId,
        );
        state.items = state.items.filter((item) => item._id !== itemToRemove?._id);
      });
  },
});

export const selectArticleReactions = (state: RootState, articleId: string | undefined) =>
  state.reactions.items.filter((item) => item.article === articleId);

export default reactionsSlice.reducer;
