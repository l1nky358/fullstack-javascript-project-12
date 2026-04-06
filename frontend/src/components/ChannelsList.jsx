import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useState } from 'react';
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

  const showNotification = (message, isError = false) => {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: ${isError ? '#dc3545' : '#28a745'};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 10000;
      font-size: 16px;
      font-weight: 500;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      animation: slideDown 0.3s ease-out;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 2700);
  };

  const handleAddChannel = async (e) => {
    e.preventDefault();
    const trimmedName = newChannelName.trim();
    
    if (!trimmedName) {
      showNotification('Введите имя канала', true);
      return;
    }
    
    if (trimmedName.length < 3 || trimmedName.length > 20) {
      showNotification('Имя канала должно быть от 3 до 20 символов', true);
      return;
    }
    
    try {
      await addChannel(trimmedName).unwrap();
      
      if (onChannelChange) {
        onChannelChange();
      }
      
      showNotification('Канал создан');
      
      setNewChannelName('');
      setShowModal(false);
      
    } catch (error) {
      console.error('Error creating channel:', error);
      showNotification('Ошибка при создании канала', true);
    }
  };

  const handleRename = async (channelId, newName) => {
    try {
      await renameChannel({ id: channelId, name: newName }).unwrap();
      if (onChannelChange) onChannelChange();
      showNotification('Канал переименован');
      setEditingChannel(null);
    } catch (error) {
      showNotification('Ошибка при переименовании', true);
    }
  };

  const handleRemove = async (channelId) => {
    try {
      await removeChannel(channelId).unwrap();
      if (onChannelChange) onChannelChange();
      showNotification('Канал удалён');
    } catch (error) {
      showNotification('Ошибка при удалении', true);
    }
  };

  return (
    <div className="col-3 border-end p-3">
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
          }
          to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
          }
        }
      `}</style>
      
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
