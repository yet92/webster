import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ClientError {
  id?: number;
  message: string;
}

export interface ErrorsState {
  errors: ClientError[];
}

const initialState: ErrorsState = {
  errors: [],
};

export const errorsSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    addError: (state, action: PayloadAction<ClientError>) => {
      const error = action.payload;
      error.id = state.errors.length;
      state.errors.push(error);
    },

    deleteError: (state, id: PayloadAction<number>) => {
      state.errors = state.errors.filter((err) => err.id != id.payload);
    },

    clearErrors: (state) => {
      state.errors = [];
    },
  },
});

export const { addError, deleteError, clearErrors } = errorsSlice.actions;
export default errorsSlice.reducer;
