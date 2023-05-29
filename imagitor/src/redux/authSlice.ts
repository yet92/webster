/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  AnyAction,
} from "@reduxjs/toolkit";

const SERVER_URL = "http://localhost:4000";
console.log(`DOES SERVER URL EQUALS TO ${SERVER_URL}?`);

export const loadUserWithToken = createAsyncThunk(
  "auth/fetchByToken",
  async (token: string, thunkAPI) => {
    const response = await fetch(`${SERVER_URL}/api/auth/credentials/test_JWT_STRATEGY`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }        
      });
    const json = await response.json();
    console.log("JSON", json);
    return {response, json, token};
  }
);

export type User = {
    id: number;
    login?: string;
    email: string;
    avatar?: string;
    accessToken?: string;
};

export type userState = {
    me: User;
    loading: boolean;
    isAuthenticated: boolean;
    error: string | null;
};
const initialState: userState = {
  me: {
    id: -1,
    login: "",
    email: "",
    avatar: "",
  },
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loadUser: (state) => {
      state.loading = true;
      const userJson = localStorage.getItem("user");
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
        localStorage.setItem("user", JSON.stringify(state.me));
      }
    },

    logout: (state) => {
      state.loading = true;
      state.me = { email: "", id: -1, login: "" };
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserWithToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserWithToken.fulfilled, (state, action) => {
        console.log("FULFILLED: ", action);
        const json = action.payload.json;
        state.me = {id: json.user.id, email: json.user.email, accessToken: action.payload.token, avatar: json.user.avatar};
        state.isAuthenticated = true;
        if (state.me.accessToken) {
          localStorage.setItem("user", JSON.stringify(state.me));
        }
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

// export const { addTodo, toggleComplete, removeTodo } = authSlice.actions;
export const { login, loadUser, logout } = authSlice.actions;


export default authSlice.reducer;

function isError(action: AnyAction) {
  return action.type.endsWith("rejected");
}
