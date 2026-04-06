import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useState } from 'react';
import { useAddChannelMutation, useRenameChannelMutation, useRemoveChannelMutation } from '../services/api';
import ChannelMenu from './ChannelMenu';

const ChannelsList = ({ channels, currentChannelId }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [addChannel] = useAddChannelMutation();
  const [renameChannel] = useRenameChannelMutation();
  const [removeChannel] = useRemoveChannelMutation();
  const [editingChannel, setEditingChannel] = useState(null);

  const handleAddChannel = async (e) => {
    e.preventDefault();
    console.log('=== handleAddChannel called ===');
    console.log('Channel name:', newChannelName);
    
    if (!newChannelName.trim()) {
      console.log('Channel name is empty, returning');
      return;
    }
    
    console.log('Calling addChannel mutation...');
    try {
      const result = await addChannel(newChannelName.trim()).unwrap();
      console.log('SUCCESS! Channel created:', result);
      
      // Создаем уведомление прямо здесь
      const notificationDiv = document.createElement('div');
      notificationDiv.textContent = 'Канал создан';
      notificationDiv.style.position = 'fixed';
      notificationDiv.style.top = '10px';
      notificationDiv.style.left = '50%';
      notificationDiv.style.transform = 'translateX(-50%)';
      notificationDiv.style.backgroundColor = 'green';
      notificationDiv.style.color = 'white';
      notificationDiv.style.padding = '10px';
      notificationDiv.style.zIndex = '99999';
      notificationDiv.style.fontSize = '20px';
      notificationDiv.style.fontWeight = 'bold';
      document.body.appendChild(notificationDiv);
      
      console.log('Notification added to DOM');
      
      setTimeout(() => {
        notificationDiv.remove();
        console.log('Notification removed');
      }, 5000);
      
      setNewChannelName('');
      setShowModal(false);
      
    } catch (error) {
      console.error('ERROR creating channel:', error);
      console.error('Error details:', JSON.stringify(error));
      
      // Показываем ошибку на странице
      const errorDiv = document.createElement('div');
      errorDiv.textContent = `Ошибка: ${error.message || 'Unknown error'}`;
      errorDiv.style.position = 'fixed';
      errorDiv.style.top = '10px';
      errorDiv.style.left = '50%';
      errorDiv.style.transform = 'translateX(-50%)';
      errorDiv.style.backgroundColor = 'red';
      errorDiv.style.color = 'white';
      errorDiv.style.padding = '10px';
      errorDiv.style.zIndex = '99999';
      document.body.appendChild(errorDiv);
      
      setTimeout(() => errorDiv.remove(), 5000);
    }
  };

  const handleRename = async (channelId, newName) => {
    try {
      await renameChannel({ id: channelId, name: newName }).unwrap();
      setEditingChannel(null);
    } catch (error) {
      console.error('Rename error:', error);
    }
  };

  const handleRemove = async (channelId) => {
    try {
      await removeChannel(channelId).unwrap();
    } catch (error) {
      console.error('Remove error:', error);
    }
  };

  return (
    <div className="col-3 border-end p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Каналы</h2>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={() => setShowModal(true)}
        >
          +
        </button>
      </div>
      
      <ul className="list-unstyled">
        {channels.map(channel => (
          <li key={channel.id} className="mb-2 d-flex justify-content-between align-items-center">
            {editingChannel === channel.id ? (
              <input
                type="text"
                className="form-control form-control-sm"
                defaultValue={channel.name}
                autoFocus
                onBlur={(e) => handleRename(channel.id, e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleRename(channel.id, e.target.value);
                  }
                }}
              />
            ) : (
              <button
                className={`btn w-100 text-start ${currentChannelId === channel.id ? 'btn-primary' : 'btn-link'}`}
                onClick={() => dispatch(setCurrentChannel(channel.id))}
              >
                {channel.name === 'general' ? 'general' : `# ${channel.name}`}
              </button>
            )}
            {channel.removable && (
              <ChannelMenu 
                channel={channel}
                onRename={() => setEditingChannel(channel.id)}
                onRemove={() => handleRemove(channel.id)}
              />
            )}
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
