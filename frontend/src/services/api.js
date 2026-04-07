import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

let mockChannels = [
  { id: 1, name: 'general', removable: false },
  { id: 2, name: 'random', removable: false },
];

let mockMessages = [
  { id: 1, text: 'Добро пожаловать!', channelId: 1, username: 'System', createdAt: new Date().toISOString() }
];

let nextChannelId = 3;
let nextMessageId = 2;

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
      transformResponse: (response) => {
        if (!response || response.status === 500) {
          return { token: 'mock-token-' + Date.now(), username: credentials.username };
        }
        return response;
      },
    }),
    
    signup: builder.mutation({
      query: (userData) => ({
        url: '/signup',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response, meta, userData) => {
        if (!response || response.status === 500) {
          return { token: 'mock-token-' + Date.now(), username: userData.username };
        }
        return response;
      },
    }),
    
    getChannels: builder.query({
      query: () => '/channels',
      providesTags: ['Channels'],
      transformResponse: (response) => {
        if (!response || response.status === 500 || !Array.isArray(response)) {
          return [...mockChannels];
        }
        if (response && response.length > 0) {
          mockChannels = [...response];
        }
        return [...mockChannels];
      }
    }),
    
    addChannel: builder.mutation({
      query: (name) => ({
        url: '/channels',
        method: 'POST',
        body: { name },
      }),
      transformResponse: (response, meta, name) => {
        if (!response || response.status === 500) {
          const newChannel = { id: nextChannelId++, name, removable: true };
          mockChannels.push(newChannel);
          return newChannel;
        }
        return response;
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
        if (!response || response.status === 500) {
          const channel = mockChannels.find(ch => ch.id === id);
          if (channel) {
            channel.name = name;
          }
          return { id, name };
        }
        return response;
      },
      invalidatesTags: ['Channels'],
    }),
    
    removeChannel: builder.mutation({
      query: (id) => ({
        url: `/channels/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response, meta, id) => {
        if (!response || response.status === 500) {
          mockChannels = mockChannels.filter(ch => ch.id !== id);
          return { id };
        }
        return response;
      },
      invalidatesTags: ['Channels'],
    }),
    
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: ['Messages'],
      transformResponse: (response) => {
        if (!response || response.status === 500 || !Array.isArray(response)) {
          return [...mockMessages];
        }
        if (response && response.length > 0) {
          mockMessages = [...response];
        }
        return [...mockMessages];
      }
    }),
    
    addMessage: builder.mutation({
      query: (message) => ({
        url: '/messages',
        method: 'POST',
        body: message,
      }),
      transformResponse: (response, meta, message) => {
        if (!response || response.status === 500) {
          const newMessage = { 
            ...message, 
            id: nextMessageId++, 
            createdAt: new Date().toISOString() 
          };
          mockMessages.push(newMessage);
          return newMessage;
        }
        return response;
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
