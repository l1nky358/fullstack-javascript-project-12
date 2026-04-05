import { useState } from 'react';
import { useAddMessageMutation } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const MessageForm = ({ currentChannelId }) => {
  const [text, setText] = useState('');
  const [addMessage, { isLoading }] = useAddMessageMutation();
  const { username } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim() || !currentChannelId) return;

    const messageText = text.trim();
    setText('');
    
    try {
      await addMessage({
        text: messageText,
        channelId: currentChannelId,
        username: username,
      }).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
      setText(messageText);
    }
  };

  return (
    <div className="border-top p-3">
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Введите сообщение..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!currentChannelId || isLoading}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!text.trim() || !currentChannelId || isLoading}
          >
            Отправить
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageForm;
