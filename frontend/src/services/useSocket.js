import { useEffect, useState } from 'react';
import { createSocket } from '../socket';

let socketInstance = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    if (!socketInstance) {
      socketInstance = createSocket(token);
    }

    const handleConnect = () => {
      console.log('Socket connected');
      setIsConnected(true);
      socketInstance.connect();
    };

    const handleDisconnect = () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    };

    const handleConnectError = (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('connect_error', handleConnectError);

    if (!socketInstance.connected) {
      socketInstance.connect();
    }

    setSocket(socketInstance);

    return () => {
      socketInstance.off('connect', handleConnect);
      socketInstance.off('disconnect', handleDisconnect);
      socketInstance.off('connect_error', handleConnectError);
    };
  }, []);

  return { socket, isConnected };
};
