import { useSelector } from 'react-redux';
import { useGetChannelsQuery, useGetMessagesQuery } from '../services/api';
import ChannelsList from './ChannelsList';
import MessagesList from './MessagesList';
import MessageForm from './MessageForm';

const Chat = () => {
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const { data: channels = [] } = useGetChannelsQuery();
  const { data: messages = [] } = useGetMessagesQuery();

  const currentMessages = messages.filter(m => m.channelId === currentChannelId);

  return (
    <div className="d-flex h-100">
      <ChannelsList channels={channels} currentChannelId={currentChannelId} />
      <div className="flex-grow-1 d-flex flex-column">
        <MessagesList messages={currentMessages} />
        <MessageForm channelId={currentChannelId} />
      </div>
    </div>
  );
};

export default Chat;