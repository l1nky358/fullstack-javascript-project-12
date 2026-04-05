import { useState } from 'react';
import { useAddMessageMutation } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const MessageForm = ({ currentChannelId, onMessageSent }) => {
  const [text, setText] = useState('');
  const [addMessage, { isLoading }] = useAddMessageMutation();
  const { username } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentChannelId) return;

    const messageText = text.trim();
    setText('');
    
    if (onMessageSent) {
      onMessageSent(messageText, username);
    }
    
    try {
      await addMessage({
        text: messageText,
        channelId: currentChannelId,
        username: username,
      }).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-top p-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Введите сообщение..."
          aria-label="Новое сообщение"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!text.trim() || isLoading}
        >
          Отправить
        </button>
      </div>
    </form>
  );
};

export default MessageForm;
