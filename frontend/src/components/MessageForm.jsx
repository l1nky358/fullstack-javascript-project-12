import { useState } from 'react';
import { useAddMessageMutation } from '../services/api';

const MessageForm = ({ currentChannelId }) => {
  const [text, setText] = useState('');
  const [addMessage] = useAddMessageMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !currentChannelId) return;

    const messageText = text.trim();
    console.log('Sending message:', { text: messageText, channelId: currentChannelId });
    
    try {
      const result = await addMessage({
        text: messageText,
        channelId: currentChannelId,
      }).unwrap();
      console.log('Message sent:', result);
      setText('');
    } catch (error) {
      console.error('Error:', error);
    }
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
        />
        <button type="submit" className="btn btn-primary">
          Отправить
        </button>
      </div>
    </form>
  );
};

export default MessageForm;
