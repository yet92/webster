/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  AnyAction,
} from "@reduxjs/toolkit";


export type PageState = {
    current: number
};
const initialState: PageState = {
  current:-1
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setCurrent: (state, page: PayloadAction<number>) => {
      state.current = page.payload;
    },

    clear: (state) => {
      state.current = -1;
    }
  },
});

// export const { addTodo, toggleComplete, removeTodo } = authSlice.actions;
export const { setCurrent, clear } = pageSlice.actions;


export default pageSlice.reducer;
