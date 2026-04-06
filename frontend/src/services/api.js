let channels = [
  { id: 1, name: 'general', removable: false },
  { id: 2, name: 'random', removable: true },
];

let messages = [
  { id: 1, text: 'Добро пожаловать!', channelId: 1, username: 'System', createdAt: new Date().toISOString() }
];

let nextId = 3;
let nextMsgId = 2;

export const api = {
  reducerPath: 'api',
  reducer: (state) => state || {},
  middleware: () => (next) => (action) => next(action),
};

export const useGetChannelsQuery = () => {
  return { 
    data: channels, 
    isLoading: false, 
    error: null, 
    refetch: () => {} 
  };
};

export const useAddChannelMutation = () => {
  const addChannel = async (name) => {
    const newChannel = { id: nextId++, name, removable: true };
    channels.push(newChannel);
    return { unwrap: () => Promise.resolve(newChannel) };
  };
  return [addChannel, { isLoading: false }];
};

export const useRenameChannelMutation = () => {
  const renameChannel = async ({ id, name }) => {
    const channel = channels.find(c => c.id === id);
    if (channel) channel.name = name;
    return { unwrap: () => Promise.resolve({ id, name }) };
  };
  return [renameChannel, { isLoading: false }];
};

export const useRemoveChannelMutation = () => {
  const removeChannel = async (id) => {
    channels = channels.filter(c => c.id !== id);
    return { unwrap: () => Promise.resolve({ id }) };
  };
  return [removeChannel, { isLoading: false }];
};

export const useGetMessagesQuery = () => {
  return { 
    data: messages, 
    isLoading: false, 
    error: null, 
    refetch: () => {} 
  };
};

export const useAddMessageMutation = () => {
  const addMessage = async (message) => {
    const newMessage = { ...message, id: nextMsgId++, createdAt: new Date().toISOString() };
    messages.push(newMessage);
    return { unwrap: () => Promise.resolve(newMessage) };
  };
  return [addMessage, { isLoading: false }];
};

export const useLoginMutation = () => {
  const login = async (credentials) => {
    return { unwrap: () => Promise.resolve({ token: 'mock-token', username: credentials.username }) };
  };
  return [login, { isLoading: false }];
};

export const useSignupMutation = () => {
  const signup = async (userData) => {
    return { unwrap: () => Promise.resolve({ token: 'mock-token', username: userData.username }) };
  };
  return [signup, { isLoading: false }];
};
