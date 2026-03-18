import { io } from 'socket.io-client';

const socket = io('http://localhost:5001', {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  transports: ['websocket', 'polling']
});

export default socket;