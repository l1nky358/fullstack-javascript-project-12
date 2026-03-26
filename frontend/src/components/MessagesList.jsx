import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { cleanProfanity } from './utils/profanity';

const MessagesList = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const { t } = useTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="messages-container">
      {messages.length === 0 ? (
        <div className="text-center text-muted mt-4">
          {t('chat.noMessages')}
        </div>
      ) : (
        messages.map((message) => (
          <div key={message.id} className="message-item mb-3">
            <strong className="text-primary me-2">{message.username}:</strong>
            <span>{cleanProfanity(message.text)}</span>
            <small className="text-muted ms-2">
              {new Date(message.createdAt).toLocaleTimeString()}
            </small>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
