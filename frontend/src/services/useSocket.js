import { useEffect, useState } from 'react';
import { initSocket, closeSocket, getSocket } from '../socket';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = initSocket(token);
    
    const onConnect = () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
    };
    
    const onDisconnect = () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    };
    
    const onConnectError = (error) => {
      console.error('Socket error:', error);
      setIsConnected(false);
    };
    
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    
    if (socket.connected) {
      setIsConnected(true);
    }
    
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      closeSocket();
    };
  }, []);

  return { socket: getSocket(), isConnected };
};
