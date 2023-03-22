import { configureStore } from '@reduxjs/toolkit';
import authReducer, { loadAuthData } from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

store.dispatch(loadAuthData());

export default store;