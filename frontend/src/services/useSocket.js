import { useEffect, useState } from 'react';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const fakeSocket = {
      on: (event, callback) => {
        if (event === 'newMessage') {
          window.__messageCallback = callback;
        }
      },
      off: () => {},
      emit: (event, message) => {
        if (event === 'newMessage') {
          setTimeout(() => {
            if (window.__messageCallback) {
              window.__messageCallback(message);
            }
          }, 100);
        }
      },
    };
    
    setSocket(fakeSocket);
    
    return () => {
      delete window.__messageCallback;
    };
  }, []);

  return { socket, isConnected };
};
