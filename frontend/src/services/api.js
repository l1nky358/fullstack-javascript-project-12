import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
        console.log('Channels API response:', response);
        if (!response || response.length === 0) {
          return [
            { id: 1, name: 'general', removable: false },
            { id: 2, name: 'random', removable: true },
          ];
        }
        return response;
      }
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
        if (!response || !Array.isArray(response)) {
          return [
            { id: 1, text: 'Добро пожаловать!', channelId: 1, username: 'System', createdAt: new Date().toISOString() }
          ];
        }
        return response;
      }
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
