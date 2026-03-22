import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async () => {
    const response = await api.get('/channels');
    return response.data;
  }
);

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  async (channelData) => {
    const response = await api.post('/channels', channelData);
    return response.data;
  }
);

export const renameChannel = createAsyncThunk(
  'channels/renameChannel',
  async ({ id, name }) => {
    const response = await api.patch(`/channels/${id}`, { name });
    return response.data;
  }
);

export const removeChannel = createAsyncThunk(
  'channels/removeChannel',
  async (id) => {
    await api.delete(`/channels/${id}`);
    return id;
  }
);

const channelsSlice = createSlice({
  name: 'channels',
  initialState: {
    items: [],
    currentChannelId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        if (!state.currentChannelId && action.payload.length > 0) {
          state.currentChannelId = action.payload[0].id;
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.currentChannelId = action.payload.id;
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        const index = state.items.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.items = state.items.filter(c => c.id !== action.payload);
        if (state.currentChannelId === action.payload) {
          state.currentChannelId = state.items[0]?.id || null;
        }
      });
  },
});

export const { setCurrentChannel } = channelsSlice.actions;
export default channelsSlice.reducer;