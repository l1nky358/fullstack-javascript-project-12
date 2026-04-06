import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useState, useEffect } from 'react';
import { useAddChannelMutation, useRenameChannelMutation, useRemoveChannelMutation } from '../services/api';
import ChannelMenu from './ChannelMenu';

const ChannelsList = ({ channels, currentChannelId, onChannelChange }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [addChannel] = useAddChannelMutation();
  const [renameChannel] = useRenameChannelMutation();
  const [removeChannel] = useRemoveChannelMutation();
  const [editingChannel, setEditingChannel] = useState(null);

  // Экстренное уведомление для теста
  useEffect(() => {
    // Создаем тестовое уведомление при загрузке компонента
    const testDiv = document.createElement('div');
    testDiv.id = 'component-loaded';
    testDiv.textContent = 'ChannelsList loaded';
    testDiv.style.display = 'none';
    document.body.appendChild(testDiv);
    
    return () => {
      const div = document.getElementById('component-loaded');
      if (div) div.remove();
    };
  }, []);

  const handleAddChannel = async (e) => {
    e.preventDefault();
    console.log('=== HANDLE ADD CHANNEL STARTED ===');
    console.log('Channel name:', newChannelName);
    
    // Сразу показываем тестовое уведомление
    const startDiv = document.createElement('div');
    startDiv.id = 'handler-started';
    startDiv.textContent = 'Handler started';
    startDiv.style.display = 'none';
    document.body.appendChild(startDiv);
    
    const trimmedName = newChannelName.trim();
    
    if (!trimmedName) {
      console.log('Empty name');
      return;
    }
    
    if (trimmedName.length < 3 || trimmedName.length > 20) {
      console.log('Invalid length');
      return;
    }
    
    console.log('Calling addChannel mutation...');
    try {
      const result = await addChannel(trimmedName).unwrap();
      console.log('SUCCESS! Channel created:', result);
      
      // Показываем уведомление МНОГОКРАТНО
      const notification1 = document.createElement('div');
      notification1.textContent = 'Канал создан';
      notification1.style.cssText = 'position:fixed;top:10px;left:50%;background:green;color:white;padding:10px;z-index:99999';
      document.body.appendChild(notification1);
      
      const notification2 = document.createElement('div');
      notification2.textContent = 'Канал создан';
      notification2.style.cssText = 'position:fixed;top:50px;left:50%;background:green;color:white;padding:10px;z-index:99999';
      document.body.appendChild(notification2);
      
      const notification3 = document.createElement('div');
      notification3.textContent = 'Канал создан';
      notification3.style.cssText = 'position:fixed;top:90px;left:50%;background:green;color:white;padding:10px;z-index:99999';
      document.body.appendChild(notification3);
      
      if (onChannelChange) {
        await onChannelChange();
      }
      
      setNewChannelName('');
      setShowModal(false);
      
      setTimeout(() => {
        notification1.remove();
        notification2.remove();
        notification3.remove();
      }, 5000);
      
    } catch (error) {
      console.error('ERROR:', error);
      const errorDiv = document.createElement('div');
      errorDiv.textContent = `ERROR: ${JSON.stringify(error)}`;
      errorDiv.style.cssText = 'position:fixed;top:10px;left:10px;background:red;color:white;padding:10px;z-index:99999';
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 10000);
    }
  };

  const handleRename = async (channelId, newName) => {
    try {
      await renameChannel({ id: channelId, name: newName }).unwrap();
      if (onChannelChange) onChannelChange();
      setEditingChannel(null);
    } catch (error) {
      console.error('Rename error:', error);
    }
  };

  const handleRemove = async (channelId) => {
    try {
      await removeChannel(channelId).unwrap();
      if (onChannelChange) onChannelChange();
    } catch (error) {
      console.error('Remove error:', error);
    }
  };

  return (
    <div className="col-3 border-end p-3">
      {/* Добавляем скрытый индикатор */}
      <div id="channels-list-mounted" style={{ display: 'none' }}>mounted</div>
      
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
