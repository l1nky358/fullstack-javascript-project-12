import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetChannelsQuery, useGetMessagesQuery } from '../services/api';
import { setCurrentChannel } from '../store/channelsSlice';
import { useSocket } from '../services/useSocket';
import MessageForm from './MessageForm';
import ChannelsList from './ChannelsList';
import MessagesList from './MessagesList';

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const [liveMessages, setLiveMessages] = useState([]);

  const { 
    data: channels = [], 
    isLoading: channelsLoading,
    error: channelsError 
  } = useGetChannelsQuery();
  
  const { 
    data: initialMessages = [], 
    isLoading: messagesLoading 
  } = useGetMessagesQuery();
  
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  useEffect(() => {
    if (initialMessages) {
      setLiveMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (message) => {
      console.log('New message via socket:', message);
      setLiveMessages((prev) => [...prev, message]);
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, isConnected]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (!channelsLoading && channels.length > 0 && !currentChannelId) {
      const generalChannel = channels.find(ch => ch.name === 'general');
      dispatch(setCurrentChannel(generalChannel?.id || channels[0].id));
    }
  }, [channelsLoading, channels, currentChannelId, dispatch]);

  useEffect(() => {
    if (channelsError) {
      console.error('Error loading channels:', channelsError);
    }
  }, [channelsError]);

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  const currentChannel = channels.find(c => c.id === currentChannelId);
  const channelMessages = liveMessages.filter(m => m.channelId === currentChannelId);

  return (
    <div className="container-fluid h-100 overflow-hidden p-0">
      <div className="row h-100 g-0">
        <ChannelsList 
          channels={channels}
          currentChannelId={currentChannelId}
        />
        
        <div className="col-9 col-md-10 d-flex flex-column h-100">
          {currentChannel ? (
            <>
              <div className="bg-light p-3 border-bottom">
                <h5 className="mb-0"># {currentChannel.name}</h5>
                {!isConnected && (
                  <small className="text-danger ms-2">Отключено от сервера</small>
                )}
              </div>
              
              <div className="flex-grow-1 overflow-auto">
                <MessagesList messages={channelMessages} />
              </div>
              
              <MessageForm currentChannelId={currentChannelId} socket={socket} />
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center text-muted">
                <h4>Добро пожаловать!</h4>
                <p>Выберите канал из списка слева</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
