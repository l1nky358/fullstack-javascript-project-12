import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const CHANNELS_STORAGE_KEY = 'chat_channels';
const MESSAGES_STORAGE_KEY = 'chat_messages';

const loadChannelsFromStorage = () => {
  const saved = localStorage.getItem(CHANNELS_STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    { id: 1, name: 'general', removable: false },
    { id: 2, name: 'random', removable: false },
  ];
};

const saveChannelsToStorage = (channels) => {
  localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(channels));
};

const loadMessagesFromStorage = () => {
  const saved = localStorage.getItem(MESSAGES_STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    { id: 1, text: 'Добро пожаловать!', channelId: 1, username: 'System', createdAt: new Date().toISOString() }
  ];
};

const saveMessagesToStorage = (messages) => {
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
};

let mockChannels = loadChannelsFromStorage();
let nextChannelId = Math.max(...mockChannels.map(c => c.id), 0) + 1;

let mockMessages = loadMessagesFromStorage();
let nextMessageId = Math.max(...mockMessages.map(m => m.id), 0) + 1;

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
        mockChannels = loadChannelsFromStorage();
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
        const newChannel = { id: nextChannelId++, name, removable: true };
        mockChannels.push(newChannel);
        saveChannelsToStorage(mockChannels);
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
        const channel = mockChannels.find(ch => ch.id === id);
        if (channel) {
          channel.name = name;
          saveChannelsToStorage(mockChannels);
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
        mockChannels = mockChannels.filter(ch => ch.id !== id);
        saveChannelsToStorage(mockChannels);
        return { id };
      },
      invalidatesTags: ['Channels'],
    }),
    
    getMessages: builder.query({
      query: () => '/messages',
      providesTags: ['Messages'],
      transformResponse: (response) => {
        mockMessages = loadMessagesFromStorage();
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
        const newMessage = { 
          ...message, 
          id: nextMessageId++, 
          createdAt: new Date().toISOString() 
        };
        mockMessages.push(newMessage);
        saveMessagesToStorage(mockMessages);
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
