import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IComment } from '../models/IComment';
import { RootState } from '../store/store';
import CommentService from '../services/CommentService';

interface NotificationsState {}
