import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetChannelsQuery, useGetMessagesQuery } from '../services/api';
import { setCurrentChannel } from '../store/channelsSlice';
import MessageForm from './MessageForm';
import ChannelsList from './ChannelsList';

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { 
    data: channels = [], 
    isLoading: channelsLoading,
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

  if (channelsLoading || messagesLoading) {
    return <div className="text-center p-5">Загрузка...</div>;
  }

  const currentChannel = channels.find(c => c.id === currentChannelId);
  const channelMessages = messages.filter(m => m.channelId === currentChannelId);

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        {/* Используем компонент ChannelsList вместо дублирования кода */}
        <ChannelsList 
          channels={channels}
          currentChannelId={currentChannelId}
        />
        
        <div className="col-9 d-flex flex-column h-100">
          <div className="border-bottom p-3">
            <h5># {currentChannel?.name}</h5>
          </div>
          
          <div className="flex-grow-1 overflow-auto p-3" data-testid="messages">
            {channelMessages.length === 0 ? (
              <div className="text-center text-muted">Нет сообщений</div>
            ) : (
              channelMessages.map(msg => (
                <div key={msg.id} className="mb-2" data-testid="message">
                  <strong>{msg.username}:</strong> {msg.text}
                </div>
              ))
            )}
          </div>
          
          <MessageForm 
            currentChannelId={currentChannelId} 
            onMessageSent={refetchMessages}
          />
        </div>
      </div>
    </div>
  );
};

export default Chat;
