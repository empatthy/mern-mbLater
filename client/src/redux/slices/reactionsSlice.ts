import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IReaction } from '../../models/IReaction';
import { RootState } from '../store';
import ReactionService from '../../services/ReactionService';

interface ReactionsState {
  items: IReaction[];
  status: 'idle' | 'loading' | 'succeeded' | 'rejected';
}

const initialState: ReactionsState = {
  items: [],
  status: 'idle',
};

export type AddReactionPayload = {
  to: string;
  userId: string;
  reactionType: boolean;
};

export type RemoveReactionPayload = {
  to: string;
  userId: string;
};

export const addReaction = createAsyncThunk(
  'reactions/addReaction',
  async (data: AddReactionPayload) => {
    const { to, userId, reactionType } = data;
    const response = await ReactionService.addReaction(to, userId, reactionType);
    return response.data;
  },
);

export const getAllReactions = createAsyncThunk('reactions/getAllReactions', async () => {
  const response = await ReactionService.getAllReactions();
  return response.data;
});

export const getItemReactions = createAsyncThunk(
  'reactions/getItemReactions',
  async (to: string) => {
    const response = await ReactionService.getItemReactions(to);
    return response.data;
  },
);

export const removeReaction = createAsyncThunk(
  'reactions/removeReaction',
  async (data: RemoveReactionPayload) => {
    const { to, userId } = data;
    const response = await ReactionService.removeReaction(to, userId);
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
      .addCase(getItemReactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getItemReactions.fulfilled, (state, action) => {
        state.items.push(...action.payload);
        state.status = 'succeeded';
      })
      .addCase(getItemReactions.rejected, (state) => {
        state.status = 'rejected';
      })
      .addCase(removeReaction.fulfilled, (state, action) => {
        const { to, userId } = action.payload;
        const itemToRemove = state.items.find((item) => item.to === to && item.user === userId);
        state.items = state.items.filter((item) => item._id !== itemToRemove?._id);
      });
  },
});

export const selectItemReactions = (state: RootState, to: string | undefined) =>
  state.reactions.items.filter((item) => item.to === to);

export default reactionsSlice.reducer;
