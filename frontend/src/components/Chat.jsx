import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGetChannelsQuery, useGetMessagesQuery } from '../services/api';
import { setCurrentChannel } from '../store/channelsSlice';
import MessageForm from './MessageForm';

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
        <div className="col-3 border-end p-3">
          <h5>Каналы</h5>
          {channels.map(ch => (
            <button
              key={ch.id}
              className={`btn w-100 text-start mb-1 ${currentChannelId === ch.id ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => dispatch(setCurrentChannel(ch.id))}
            >
              # {ch.name}
            </button>
          ))}
        </div>
        
        <div className="col-9 d-flex flex-column h-100">
          <div className="border-bottom p-3">
            <h5># {currentChannel?.name}</h5>
          </div>
          
          <div className="flex-grow-1 overflow-auto p-3">
            {channelMessages.length === 0 ? (
              <div className="text-center text-muted">Нет сообщений</div>
            ) : (
              channelMessages.map(msg => (
                <div key={msg.id} className="mb-2">
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
