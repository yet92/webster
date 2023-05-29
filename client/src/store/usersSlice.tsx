import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAllUsers, fetchOneUser } from '../pages/users/utils/fetchUsers';
import { User } from './authSlice';

type UsersState = {
  users: User[];
  loading: boolean;
  currentUser: User;
  error: string | null;
};

const initialState: UsersState = {
  users: [],
  loading: false,
  currentUser: { id: -1, login: '', email: '' },
  error: null,
};

export const fetchUsersAsync = createAsyncThunk<User[]>(
  'users/fetchUsers',
  async (_, thunkAPI) => {
    try {
      const { json } = await fetchAllUsers();
      return json.data as unknown as User[];
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch users');
    }
  }
);

export const fetchUserAsync = createAsyncThunk<User, string>(
  'users/fetchUser',
  async (userId: string, thunkAPI) => {
    try {
      const { json } = await fetchOneUser(userId);
      return json.data as unknown as User;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch user');
    }
  }
);
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload as unknown as User[];
      })
      .addCase(fetchUsersAsync.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUserAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload as unknown as User;
      })
      .addCase(fetchUserAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default usersSlice.reducer;
