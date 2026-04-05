import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetChannelsQuery, useGetMessagesQuery } from '../services/api';
import { setCurrentChannel } from '../store/channelsSlice';
import MessageForm from './MessageForm';
import ChannelsList from './ChannelsList';
import MessagesList from './MessagesList';

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { 
    data: channels = [], 
    isLoading: channelsLoading,
    error: channelsError,
    refetch: refetchChannels
  } = useGetChannelsQuery();
  
  const { 
    data: messages = [], 
    isLoading: messagesLoading,
    refetch: refetchMessages
  } = useGetMessagesQuery();
  
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

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
    const interval = setInterval(() => {
      if (currentChannelId) {
        refetchMessages();
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, [currentChannelId, refetchMessages]);

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
  const channelMessages = messages.filter(m => m.channelId === currentChannelId);

  return (
    <div className="container-fluid h-100 overflow-hidden p-0">
      <div className="row h-100 g-0">
        <div className="col-3 border-end p-3">
          <h2>Каналы</h2>
          <ul className="list-unstyled">
            {channels.map(channel => (
              <li key={channel.id} className="mb-2">
                <button
                  className={`btn w-100 text-start ${
                    currentChannelId === channel.id ? 'btn-primary' : 'btn-link'
                  }`}
                  onClick={() => dispatch(setCurrentChannel(channel.id))}
                >
                  # {channel.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="col-9 col-md-10 d-flex flex-column h-100">
          {currentChannel ? (
            <>
              <div className="bg-light p-3 border-bottom">
                <h5 className="mb-0"># {currentChannel.name}</h5>
              </div>
              
              <div className="flex-grow-1 overflow-auto p-3">
                {channelMessages.length === 0 ? (
                  <div className="text-center text-muted">
                    Нет сообщений. Напишите первое!
                  </div>
                ) : (
                  channelMessages.map((message) => (
                    <div key={message.id} className="mb-2">
                      <strong className="text-primary me-2">{message.username}:</strong>
                      <span>{message.text}</span>
                    </div>
                  ))
                )}
              </div>
              
              <MessageForm 
                currentChannelId={currentChannelId}
                onMessageSent={refetchMessages}
              />
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
