const MessagesList = ({ messages }) => {
  console.log('Messages in list:', messages);
  
  if (!messages || messages.length === 0) {
    return <div className="text-center p-3">Нет сообщений</div>;
  }

  return (
    <div className="p-3">
      {messages.map((msg) => (
        <div key={msg.id} className="mb-2">
          <strong>{msg.username}:</strong> {msg.text}
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
