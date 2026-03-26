import { configureStore } from '@reduxjs/toolkit';
import { api } from '../services/api';
import channelsReducer from './channelsSlice';

export const store = configureStore({
  reducer: {
    channels: channelsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;