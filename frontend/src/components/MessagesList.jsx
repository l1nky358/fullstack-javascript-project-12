const MessagesList = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center text-muted">
        Нет сообщений. Напишите первое!
      </div>
    );
  }

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id} className="mb-2">
          <strong className="text-primary me-2">{message.username}:</strong>
          <span>{message.body || message.text}</span>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
