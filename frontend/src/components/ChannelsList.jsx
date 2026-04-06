import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';

const ChannelsList = ({ channels, currentChannelId }) => {
  const dispatch = useDispatch();

  return (
    <div className="col-3 border-end p-3">
      <h2>Каналы</h2>
      <ul className="list-unstyled">
        {channels.map(channel => (
          <li key={channel.id} className="mb-2">
            <button
              className={`btn w-100 text-start ${currentChannelId === channel.id ? 'btn-primary' : 'btn-link'}`}
              onClick={() => dispatch(setCurrentChannel(channel.id))}
            >
              {channel.name === 'general' ? 'general' : `# ${channel.name}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelsList;
