import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import errorsSlice from './errorsSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    errors: errorsSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
