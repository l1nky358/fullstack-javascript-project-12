import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Ключи для localStorage
const CHANNELS_KEY = 'chat_channels';
const MESSAGES_KEY = 'chat_messages';

// Загрузка каналов
const loadChannels = () => {
  const saved = localStorage.getItem(CHANNELS_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    { id: 1, name: 'general', removable: false },
    { id: 2, name: 'random', removable: false },
  ];
};

// Сохранение каналов
const saveChannels = (channels) => {
  localStorage.setItem(CHANNELS_KEY, JSON.stringify(channels));
};

// Загрузка сообщений
const loadMessages = () => {
  const saved = localStorage.getItem(MESSAGES_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    { id: 1, text: 'Добро пожаловать!', channelId: 1, username: 'System', createdAt: new Date().toISOString() }
  ];
};

// Сохранение сообщений
const saveMessages = (messages) => {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
};

let channels = loadChannels();
let messages = loadMessages();
let nextChannelId = Math.max(...channels.map(c => c.id), 0) + 1;
let nextMessageId = Math.max(...messages.map(m => m.id), 0) + 1;

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
        if (response && Array.isArray(response)) {
          channels = [...response];
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
        const newChannel = { id: nextChannelId++, name, removable: true };
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
        if (channel) {
          channel.name = name;
          saveChannels(channels);
        }
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
      transformResponse: (response) => {
        if (response && Array.isArray(response)) {
          messages = [...response];
          saveMessages(messages);
          return response;
        }
        return loadMessages();
      }
    }),
    addMessage: builder.mutation({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
      transformResponse: (response, meta, message) => {
        const newMessage = { ...message, id: nextMessageId++, createdAt: new Date().toISOString() };
        messages.push(newMessage);
        saveMessages(messages);
        return newMessage;
      },
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
