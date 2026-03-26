import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentChannelId: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
  },
});

export const { setCurrentChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
