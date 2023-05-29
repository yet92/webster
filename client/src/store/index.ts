import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import collectionsSlice from './collectionSlice';
import errorsSlice from './errorsSlice';
import projectsSlice from './projectsSlice';
import usersSlice from './usersSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    errors: errorsSlice,
    projects: projectsSlice,
    users: usersSlice,
    collections: collectionsSlice,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
