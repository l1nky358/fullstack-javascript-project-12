import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchChannels, setCurrentChannel } from './slices/channelsSlice';
import { fetchMessages } from './slices/messagesSlice';
import MessageForm from './MessageForm';
import ChannelsList from './ChannelsList';
import MessagesList from './MessagesList';
import { showError } from './Toast';

const Chat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const channels = useSelector((state) => state.channels.items);
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const messages = useSelector((state) => state.messages.items);
  const loading = useSelector((state) => state.channels.loading || state.messages.loading);

  const currentChannel = channels.find(c => c.id === currentChannelId);
  const channelMessages = messages
    .filter(m => m.channelId === currentChannelId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  useEffect(() => {
    if (!loading && channels.length > 0 && !currentChannelId) {
      dispatch(setCurrentChannel(channels[0].id));
    }
  }, [channels, loading, currentChannelId, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    Promise.all([
      dispatch(fetchChannels()),
      dispatch(fetchMessages())
    ]).catch(() => {
      showError(t('toast.error.failedToLoad'));
    });
  }, [dispatch, navigate, t]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="chat-card">
        <div className="row">
          <div className="channels-sidebar">
            <ChannelsList 
              channels={channels}
              currentChannelId={currentChannelId}
              onChannelSelect={(id) => dispatch(setCurrentChannel(id))}
            />
          </div>
          
          <div className="messages-area">
            {currentChannel ? (
              <>
                <div className="messages-header">
                  <h5 className="current-channel-title">
                    {currentChannel.name}
                  </h5>
                  <span className="messages-count">
                    {channelMessages.length} {t('chat.messages')}
                  </span>
                </div>
                
                <div className="messages-container">
                  <MessagesList messages={channelMessages} />
                </div>
                
                <div className="message-form">
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
    </div>
  );
};

export default Chat;