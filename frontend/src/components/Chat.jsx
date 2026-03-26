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
  const channelsLoading = useSelector((state) => state.channels.loading);
  const messagesLoading = useSelector((state) => state.messages.loading);

  const currentChannel = channels.find(c => c.id === currentChannelId);
  const channelMessages = messages
    .filter(m => m.channelId === currentChannelId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  useEffect(() => {
    if (!channelsLoading && channels.length > 0 && !currentChannelId) {
      dispatch(setCurrentChannel(channels[0].id));
    }
  }, [channels, channelsLoading, currentChannelId, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    Promise.all([
      dispatch(fetchChannels()),
      dispatch(fetchMessages())
    ]).then(() => {
      // Ждем дополнительную секунду чтобы Redux обновился
      setTimeout(() => {
        if (channels.length > 0 && !currentChannelId) {
          dispatch(setCurrentChannel(channels[0].id));
        }
      }, 100);
    }).catch((error) => {
      console.error('Error loading data:', error);
      showError(t('toast.error.failedToLoad'));
    });
  }, [dispatch, navigate, t]);

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
