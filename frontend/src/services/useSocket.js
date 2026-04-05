import { useEffect, useState } from 'react';
import { initSocket, getSocket, closeSocket } from '../socket';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = getSocket();
    
    const onConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
    };
    
    const onDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };
    
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    
    if (!socket.connected) {
      initSocket(token);
    } else {
      setIsConnected(true);
    }
    
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      closeSocket();
    };
  }, []);

  return { socket: getSocket(), isConnected };
};
