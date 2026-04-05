const MessagesList = ({ messages }) => {
  if (!messages || messages.length === 0) {
    return (
      <div className="text-center text-muted p-3">
        Нет сообщений. Напишите первое!
      </div>
    );
  }

  return (
    <div className="p-3">
      {messages.map((message) => (
        <div key={message.id} className="mb-2">
          <strong className="text-primary me-2">{message.username}:</strong>
          <span>{message.text}</span>
          <small className="text-muted ms-2">
            {new Date(message.createdAt).toLocaleTimeString()}
          </small>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
