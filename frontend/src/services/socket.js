import { io } from 'socket.io-client';

export const createSocket = (token) => {
  const socket = io('/', {
    auth: { token },
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket', 'polling']
  });

  return socket;
};