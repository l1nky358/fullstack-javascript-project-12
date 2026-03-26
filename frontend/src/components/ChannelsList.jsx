import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import ChannelMenu from './ChannelMenu';

const ChannelsList = ({ channels, currentChannelId }) => {
  const dispatch = useDispatch();

  const handleChannelClick = (id) => {
    dispatch(setCurrentChannel(id));
  };

  return (
    <div className="col-3 border-end p-3">
      <h2>Каналы</h2>
      <ul className="list-unstyled">
        {channels.map(channel => (
          <li key={channel.id} className="mb-2 d-flex justify-content-between align-items-center">
            <button
              className={`btn ${currentChannelId === channel.id ? 'btn-primary' : 'btn-link'}`}
              onClick={() => handleChannelClick(channel.id)}
            >
              # {channel.name}
            </button>
            {channel.removable && <ChannelMenu channel={channel} />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelsList;