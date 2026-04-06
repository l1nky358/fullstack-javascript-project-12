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
        console.log('Raw channels response:', response);
        
        if (!response || !Array.isArray(response) || response.length === 0) {
          return [
            { id: 1, name: 'general', removable: false },
            { id: 2, name: 'random', removable: true },
          ];
        }
        
        return response.map(channel => ({
          ...channel,
          removable: channel.name !== 'general'
        }));
      }
    }),
    addChannel: builder.mutation({
      query: (name) => ({
        url: '/channels',
        method: 'POST',
        body: { name },
      }),
      transformResponse: (response) => {
        console.log('=== ADD CHANNEL RESPONSE ===');
        console.log('Full response:', response);
        console.log('Response id:', response?.id);
        console.log('Response name:', response?.name);
        return response;
      },
      transformErrorResponse: (response) => {
        console.log('=== ADD CHANNEL ERROR ===');
        console.log('Error status:', response.status);
        console.log('Error data:', response.data);
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
