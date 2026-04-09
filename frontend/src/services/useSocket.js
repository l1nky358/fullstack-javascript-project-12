import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { api } from '../services/api';

export const useSocketEvents = (socket) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!socket) return;

    const invalidateChannels = () => {
      dispatch(api.util.invalidateTags(['Channels']));
    };

    const invalidateMessages = () => {
      dispatch(api.util.invalidateTags(['Messages']));
    };

    socket.on('newChannel', invalidateChannels);
    socket.on('renameChannel', invalidateChannels);
    socket.on('removeChannel', invalidateChannels);
    socket.on('newMessage', invalidateMessages);

    return () => {
      socket.off('newChannel', invalidateChannels);
      socket.off('renameChannel', invalidateChannels);
      socket.off('removeChannel', invalidateChannels);
      socket.off('newMessage', invalidateMessages);
    };
  }, [socket, dispatch]);
};
