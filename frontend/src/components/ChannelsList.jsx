import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useState } from 'react';
import { useAddChannelMutation, useRenameChannelMutation, useRemoveChannelMutation } from '../services/api';
import ChannelMenu from './ChannelMenu';
import { showGlobalNotification } from './NotificationManager';

const ChannelsList = ({ channels, currentChannelId, onChannelChange }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [addChannel] = useAddChannelMutation();
  const [renameChannel] = useRenameChannelMutation();
  const [removeChannel] = useRemoveChannelMutation();
  const [editingChannel, setEditingChannel] = useState(null);

  const handleAddChannel = async (e) => {
    e.preventDefault();
    const trimmedName = newChannelName.trim();
    
    if (!trimmedName) {
      showGlobalNotification('Введите имя канала', 'error');
      return;
    }
    
    if (trimmedName.length < 3 || trimmedName.length > 20) {
      showGlobalNotification('Имя канала должно быть от 3 до 20 символов', 'error');
      return;
    }
    
    try {
      const result = await addChannel(trimmedName).unwrap();
      console.log('Channel created:', result);
      
      // Обновляем список каналов
      if (onChannelChange) {
        await onChannelChange();
      }
      
      // Показываем уведомление
      showGlobalNotification('Канал создан', 'success');
      
      // Очищаем форму и закрываем модалку
      setNewChannelName('');
      setShowModal(false);
      
    } catch (error) {
      console.error('Error creating channel:', error);
      showGlobalNotification(error?.data?.message || 'Ошибка при создании канала', 'error');
    }
  };

  const handleRename = async (channelId, newName) => {
    try {
      await renameChannel({ id: channelId, name: newName }).unwrap();
      if (onChannelChange) onChannelChange();
      showGlobalNotification('Канал переименован', 'success');
      setEditingChannel(null);
    } catch (error) {
      showGlobalNotification('Ошибка при переименовании', 'error');
    }
  };

  const handleRemove = async (channelId) => {
    try {
      await removeChannel(channelId).unwrap();
      if (onChannelChange) onChannelChange();
      showGlobalNotification('Канал удалён', 'success');
    } catch (error) {
      showGlobalNotification('Ошибка при удалении', 'error');
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
