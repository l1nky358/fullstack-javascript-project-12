import { useState } from 'react';
import { useAddMessageMutation } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const MessageForm = ({ currentChannelId }) => {
  const [text, setText] = useState('');
  const [addMessage, { isLoading }] = useAddMessageMutation();
  const { username } = useAuth();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentChannelId) return;

    const messageText = text.trim();
    setError(null);
    
    const loadingMessage = {
      id: 'temp-' + Date.now(),
      text: messageText,
      channelId: currentChannelId,
      username: username,
      createdAt: new Date().toISOString(),
      isSending: true
    };
    
    setText('');
    
    try {
      await addMessage({
        text: messageText,
        channelId: currentChannelId,
        username: username,
      }).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Не удалось отправить сообщение. Попробуйте снова.');
      setText(messageText);
      
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-top p-3">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Введите сообщение..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!text.trim() || isLoading}
        >
          {isLoading ? 'Отправка...' : 'Отправить'}
        </button>
      </div>
      {error && (
        <div className="text-danger mt-2 small">
          {error}
        </div>
      )}
    </form>
  );
};

export default MessageForm;
