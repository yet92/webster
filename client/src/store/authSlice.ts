import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  AnyAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL, ENVIRONMENT, IMAGITOR_AUTH } from '../utils/constants';
import { Project } from './projectsSlice';

export type User = {
  id: number;
  login: string;
  email: string;
  avatar?: string;
  accessToken?: string;
  projects?: Project[];
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
    id: -1,
    login: '',
    email: '',
    avatar: '',
  },
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loadUser: (state) => {
      state.loading = true;
      const userJson = localStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        if (user) {
          state.me = user;
          state.isAuthenticated = true;
        }
      }
      state.loading = false;
    },

    login: (state, action: PayloadAction<User>) => {
      console.log(action.payload);
      state.me = action.payload;
      state.isAuthenticated = true;
      if (state.me.accessToken) {
        localStorage.setItem('user', JSON.stringify(state.me));
        if (ENVIRONMENT === 'development') {
          window.open(`${IMAGITOR_AUTH}/${state.me.accessToken}`, '_blank');
        }
      }
    },

    logout: (state) => {
      state.loading = true;
      state.me = { email: '', id: -1, login: '' };
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      state.loading = false;
    },
  },
});

// export const { addTodo, toggleComplete, removeTodo } = authSlice.actions;
export const { login, loadUser, logout } = authSlice.actions;

export default authSlice.reducer;

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}
