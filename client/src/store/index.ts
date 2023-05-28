import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import errorsSlice from './errorsSlice';
import projectsSlice from './projectsSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    errors: errorsSlice,
    projects: projectsSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
