import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetChannelsQuery, useGetMessagesQuery } from '../services/api';
import { setCurrentChannel } from '../store/channelsSlice';
import MessageForm from './MessageForm';
import ChannelsList from './ChannelsList';
import MessagesList from './MessagesList';

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { 
    data: channels = [], 
    isLoading: channelsLoading,
    error: channelsError 
  } = useGetChannelsQuery();
  
  const { 
    data: messages = [], 
    isLoading: messagesLoading,
    error: messagesError 
  } = useGetMessagesQuery();
  
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const currentChannel = channels.find(c => c.id === currentChannelId);
  const channelMessages = messages
    .filter(m => m.channelId === currentChannelId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (channelsError) {
      console.error('Error loading channels:', channelsError);
      // showError(t('toast.error.failedToLoad'));  // ОТКЛЮЧЕНО
    }
    if (messagesError) {
      console.error('Error loading messages:', messagesError);
      // showError(t('toast.error.failedToLoad'));  // ОТКЛЮЧЕНО
    }
  }, [channelsError, messagesError, t]);

  useEffect(() => {
    if (!channelsLoading && channels.length > 0 && !currentChannelId) {
      dispatch(setCurrentChannel(channels[0].id));
    }
  }, [channelsLoading, channels, currentChannelId, dispatch]);

  if (channelsLoading || messagesLoading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">{t('chat.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid h-100 overflow-hidden p-0">
      <div className="row h-100 g-0">
        <div className="col-3 col-md-2 bg-light border-end">
          <ChannelsList 
            channels={channels}
            currentChannelId={currentChannelId}
            onChannelSelect={(id) => dispatch(setCurrentChannel(id))}
          />
        </div>
        
        <div className="col-9 col-md-10 d-flex flex-column h-100">
          {currentChannel ? (
            <>
              <div className="bg-light p-3 border-bottom">
                <h5 className="mb-0"># {currentChannel.name}</h5>
              </div>
              
              <div className="flex-grow-1 overflow-auto p-3">
                <MessagesList messages={channelMessages} />
              </div>
              
              <div className="p-3 border-top">
                <MessageForm currentChannelId={currentChannelId} />
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
              <div className="text-center text-muted">
                <h4>👋 {t('chat.selectChannel')}</h4>
                <p>{t('chat.createFirstChannel')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
