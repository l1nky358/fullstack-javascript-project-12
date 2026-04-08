import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Только для сообщений
const MESSAGES_KEY = 'chat_messages';

const loadMessages = () => {
  const saved = localStorage.getItem(MESSAGES_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    { id: 1, body: 'Добро пожаловать!', channelId: 1, username: 'System', createdAt: new Date().toISOString() }
  ];
};

const saveMessages = (messages) => {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
};

let messages = loadMessages();
let nextMsgId = Math.max(...messages.map(m => m.id), 0) + 1;

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
    }),
    addChannel: builder.mutation({
      query: (name) => ({
        url: '/channels',
        method: 'POST',
        body: { name },
      }),
      invalidatesTags: ['Channels'],
    }),
    renameChannel: builder.mutation({
      query: ({ id, name }) => ({
        url: `/channels/${id}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: ['Channels'],
    }),
    removeChannel: builder.mutation({
      query: (id) => ({
        url: `/channels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Channels'],
    }),
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: ['Messages'],
      transformResponse: (response) => {
        if (response && Array.isArray(response) && response.length > 0) {
          saveMessages(response);
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
        const newMessage = { ...message, id: nextMsgId++, createdAt: new Date().toISOString() };
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
