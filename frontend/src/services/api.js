import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Загрузка каналов из localStorage
const loadChannels = () => {
  const saved = localStorage.getItem('chat_channels');
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    { id: 1, name: 'general', removable: false },
    { id: 2, name: 'random', removable: false },
  ];
};

// Сохранение каналов в localStorage
const saveChannels = (channels) => {
  localStorage.setItem('chat_channels', JSON.stringify(channels));
};

let channels = loadChannels();
let nextId = Math.max(...channels.map(c => c.id), 0) + 1;

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Channels', 'Messages'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/signup',
        method: 'POST',
        body: userData,
      }),
    }),
    getChannels: builder.query({
      query: () => '/channels',
      providesTags: ['Channels'],
      transformResponse: (response) => {
        if (response && Array.isArray(response) && response.length > 0) {
          channels = response;
          saveChannels(channels);
          return response;
        }
        return loadChannels();
      }
    }),
    addChannel: builder.mutation({
      query: (name) => ({
        url: '/channels',
        method: 'POST',
        body: { name },
      }),
      transformResponse: (response, meta, name) => {
        const newChannel = { id: nextId++, name, removable: true };
        channels.push(newChannel);
        saveChannels(channels);
        return newChannel;
      },
      invalidatesTags: ['Channels'],
    }),
    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `/channels/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      transformResponse: (response, meta, { id, name }) => {
        const channel = channels.find(ch => ch.id === id);
        if (channel) channel.name = name;
        saveChannels(channels);
        return { id, name };
      },
      invalidatesTags: ['Channels'],
    }),
    removeChannel: builder.mutation({
      query: (id) => ({
        url: `/channels/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response, meta, id) => {
        channels = channels.filter(ch => ch.id !== id);
        saveChannels(channels);
        return { id };
      },
      invalidatesTags: ['Channels'],
    }),
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: ['Messages'],
    }),
    addMessage: builder.mutation({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
      invalidatesTags: ['Messages'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useGetChannelsQuery,
  useAddChannelMutation,
  useRenameChannelMutation,
  useRemoveChannelMutation,
  useGetMessagesQuery,
  useAddMessageMutation,
} = api;
