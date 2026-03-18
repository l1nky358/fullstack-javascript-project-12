import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { sendMessage } from './slices/messagesSlice';
import { showSuccess, showError } from './Toast';
import { containsProfanity, cleanProfanity } from './utils/profanity';

const MessageForm = ({ currentChannelId }) => {
  const [text, setText] = useState('');
  const [showProfanityWarning, setShowProfanityWarning] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim() || !currentChannelId) return;

    const messageText = text.trim();

    if (containsProfanity(messageText)) {
      setPendingMessage(messageText);
      setShowProfanityWarning(true);
      return;
    }

    setText('');
    
    try {
      await dispatch(sendMessage({
        text: messageText,
        channelId: currentChannelId,
      })).unwrap();
      showSuccess(t('toast.messageSent'));
    } catch (error) {
      showError(t('toast.error.failedToSend'));
      setText(messageText);
    }
  };

  const handleProfanityConfirm = async () => {
    if (pendingMessage) {
      const cleanedText = cleanProfanity(pendingMessage);
      setShowProfanityWarning(false);
      setPendingMessage('');
      
      try {
        await dispatch(sendMessage({
          text: cleanedText,
          channelId: currentChannelId,
        })).unwrap();
        showSuccess(t('toast.messageSent'));
      } catch (error) {
        showError(t('toast.error.failedToSend'));
      }
    }
  };

  const handleProfanityCancel = () => {
    setShowProfanityWarning(false);
    setPendingMessage('');
    setText('');
  };

  if (showProfanityWarning) {
    return (
      <div className="border-top p-3">
        <div className="alert alert-warning">
          <p className="mb-2">{t('messages.profanityWarning')}</p>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-secondary"
              onClick={handleProfanityCancel}
            >
              {t('channels.modals.add.cancel')}
            </button>
            <button 
              className="btn btn-warning"
              onClick={handleProfanityConfirm}
            >
              *****
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-top p-3">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder={currentChannelId ? t('chat.messagePlaceholder') : t('chat.selectChannel')}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!currentChannelId}
            aria-label={t('chat.newMessage')}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!text.trim() || !currentChannelId}
          >
            {t('chat.send')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;