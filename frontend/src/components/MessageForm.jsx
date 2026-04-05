import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const MessageForm = ({ currentChannelId, socket }) => {
  const [text, setText] = useState('');
  const { username } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentChannelId || !socket) return;

    const messageText = text.trim();
    
    const newMessage = {
      text: messageText,
      channelId: currentChannelId,
      username: username,
      createdAt: new Date().toISOString(),
    };

    socket.emit('newMessage', newMessage, (response) => {
      if (response && response.status === 'ok') {
        console.log('Message sent successfully');
        setText('');
      } else {
        console.error('Failed to send message:', response);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border-top">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Введите сообщение..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!socket}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!text.trim() || !socket}
        >
          Отправить
        </button>
      </div>
    </form>
  );
};

export default MessageForm;
