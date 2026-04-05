import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetChannelsQuery, useGetMessagesQuery } from '../services/api';
import { setCurrentChannel } from '../store/channelsSlice';
import { useSocket } from '../services/useSocket';
import MessageForm from './MessageForm';
import ChannelsList from './ChannelsList';

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  const { 
    data: channels = [], 
    isLoading: channelsLoading,
  } = useGetChannelsQuery();
  
  const { 
    data: initialMessages = [], 
    isLoading: messagesLoading,
  } = useGetMessagesQuery();
  
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  useEffect(() => {
    if (isConnected) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('connecting');
    }
  }, [isConnected]);

  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (newMessage) => {
      console.log('New message via WebSocket:', newMessage);
      setMessages(prev => [...prev, newMessage]);
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, isConnected]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (socket && !socket.connected) {
        setConnectionStatus('reconnecting');
        socket.connect();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [socket]);

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
  const channelMessages = messages.filter(m => m.channelId === currentChannelId);

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
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    {currentChannel.name === 'general' ? 'general' : `# ${currentChannel.name}`}
                  </h5>
                  {connectionStatus === 'connected' && (
                    <small className="text-success">● Подключено</small>
                  )}
                  {connectionStatus === 'connecting' && (
                    <small className="text-warning">● Подключение...</small>
                  )}
                  {connectionStatus === 'reconnecting' && (
                    <small className="text-danger">● Переподключение...</small>
                  )}
                </div>
              </div>
              
              <div className="flex-grow-1 overflow-auto p-3">
                {channelMessages.length === 0 ? (
                  <div className="text-center text-muted">
                    Нет сообщений. Напишите первое!
                  </div>
                ) : (
                  channelMessages.map((msg) => (
                    <div key={msg.id} className="mb-2">
                      <strong className="text-primary me-2">{msg.username}:</strong>
                      <span>{msg.text}</span>
                    </div>
                  ))
                )}
              </div>
              
              <MessageForm currentChannelId={currentChannelId} />
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
