import { io } from 'socket.io-client';

const socket = io('/', {
  autoConnect: false,
  reconnection: true,
});

export const initSocket = (token) => {
  socket.auth = { token };
  socket.connect();
  return socket;
};

export const getSocket = () => socket;

export const closeSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
