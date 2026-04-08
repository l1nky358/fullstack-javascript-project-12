import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetChannelsQuery, useGetMessagesQuery } from '../services/api';
import { setCurrentChannel } from '../store/channelsSlice';

export const useSocketEvents = (socket) => {
  const dispatch = useDispatch();
  const { refetch: refetchChannels } = useGetChannelsQuery();
  const { refetch: refetchMessages } = useGetMessagesQuery();

  useEffect(() => {
    if (!socket) return;

    // Новое сообщение
    socket.on('newMessage', (payload) => {
      console.log('📨 New message:', payload);
      refetchMessages();
    });

    // Новый канал
    socket.on('newChannel', (payload) => {
      console.log('➕ New channel:', payload);
      refetchChannels();
    });

    // Переименование канала
    socket.on('renameChannel', (payload) => {
      console.log('✏️ Channel renamed:', payload);
      refetchChannels();
    });

    // Удаление канала
    socket.on('removeChannel', (payload) => {
      console.log('❌ Channel removed:', payload);
      refetchChannels();
    });

    return () => {
      socket.off('newMessage');
      socket.off('newChannel');
      socket.off('renameChannel');
      socket.off('removeChannel');
    };
  }, [socket, refetchChannels, refetchMessages]);
};
