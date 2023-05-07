import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  AnyAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../utils/constants';

type User = {
  id: string;
  login: string;
  email: string;
  avatar: string;
  accessToken?: string;
};

type userState = {
  me: User;
  loading: boolean;
  isAuthenticated: boolean;
  error: string | null;
};

export const checkAuth = createAsyncThunk<
  User,
  undefined,
  { rejectValue: string }
>('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${API_URL}/auth/refresh`, {
      withCredentials: true,
    });
    localStorage.setItem('token', response.data.accessToken);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

const initialState: userState = {
  me: {
    id: '',
    login: '',
    email: '',
    avatar: '',
  },
  isAuthenticated: false,
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.me = { ...action.payload, accessToken: undefined };
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

// export const { addTodo, toggleComplete, removeTodo } = todoSlice.actions;

export default todoSlice.reducer;

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}
