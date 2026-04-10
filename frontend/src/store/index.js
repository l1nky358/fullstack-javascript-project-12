import { configureStore } from '@reduxjs/toolkit'
import { api } from '../services/api'
import channelsReducer from './channelsSlice'
import authReducer from '../slices/authSlice'

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    channels: channelsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export default store
