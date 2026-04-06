import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useState } from 'react';
import { useAddChannelMutation } from '../services/api';

const ChannelsList = ({ channels, currentChannelId }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [addChannel] = useAddChannelMutation();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [localChannels, setLocalChannels] = useState(channels);

  useState(() => {
    setLocalChannels(channels);
  }, [channels]);

  const handleAddChannel = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    const channelName = newChannelName.trim();
    
    if (channelName.length < 3 || channelName.length > 20) {
      setErrorMessage('От 3 до 20 символов');
      return;
    }
    
    const newChannel = {
      id: Date.now(),
      name: channelName,
      removable: true
    };
    
    setLocalChannels(prev => [...prev, newChannel]);
    setSuccessMessage('Канал создан');
    setNewChannelName('');
    setShowModal(false);
    setTimeout(() => setSuccessMessage(''), 3000);
    
    try {
      await addChannel(channelName).unwrap();
    } catch (error) {
      console.error('API error:', error);
    }
  };

  return (
    <div className="col-3 border-end p-3">
      {successMessage && (
        <div className="alert alert-success" style={{ marginBottom: '10px' }}>
          {successMessage}
        </div>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Каналы</h2>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={() => {
            setErrorMessage('');
            setNewChannelName('');
            setShowModal(true);
          }}
        >
          +
        </button>
      </div>
      
      <ul className="list-unstyled">
        {localChannels.map(channel => (
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

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Добавить канал</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleAddChannel}>
                <div className="modal-body">
                  <label htmlFor="channelName" className="form-label">Имя канала</label>
                  <input
                    type="text"
                    id="channelName"
                    className="form-control"
                    placeholder="Введите имя канала"
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    autoFocus
                  />
                  {errorMessage && (
                    <div className="text-danger mt-2" style={{ fontSize: '14px' }}>
                      {errorMessage}
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Отмена</button>
                  <button type="submit" className="btn btn-primary">Добавить</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelsList;
