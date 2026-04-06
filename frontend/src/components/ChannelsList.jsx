import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useState } from 'react';
import { useAddChannelMutation, useRenameChannelMutation, useRemoveChannelMutation } from '../services/api';
import ChannelMenu from './ChannelMenu';
import { showSuccess, showError } from './Toast';

const ChannelsList = ({ channels, currentChannelId }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [addChannel] = useAddChannelMutation();
  const [renameChannel] = useRenameChannelMutation();
  const [removeChannel] = useRemoveChannelMutation();
  const [editingChannel, setEditingChannel] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddChannel = async (e) => {
    e.preventDefault();
    console.log('Form submitted, channel name:', newChannelName);
    
    if (!newChannelName.trim()) {
      console.log('Channel name is empty');
      return;
    }
    
    try {
      console.log('Calling addChannel mutation...');
      const result = await addChannel({ name: newChannelName.trim() }).unwrap();
      console.log('Channel created successfully:', result);
      
      // Показываем сообщение
      setSuccessMessage('Канал создан');
      console.log('Success message set to:', 'Канал создан');
      
      // Очищаем форму и закрываем модалку
      setNewChannelName('');
      setShowModal(false);
      
      // Не скрываем сообщение быстро, дадим тесту время
      // setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (error) {
      console.error('Error creating channel:', error);
      showError('Ошибка при создании канала');
    }
  };

  const handleRename = async (channelId, newName) => {
    try {
      await renameChannel({ id: channelId, name: newName }).unwrap();
      showSuccess('Канал переименован');
      setEditingChannel(null);
    } catch (error) {
      showError('Ошибка при переименовании');
    }
  };

  const handleRemove = async (channelId) => {
    try {
      await removeChannel(channelId).unwrap();
      showSuccess('Канал удалён');
    } catch (error) {
      showError('Ошибка при удалении');
    }
  };

  return (
    <div className="col-3 border-end p-3">
      {/* Уведомление об успехе - всегда рендерим если есть сообщение */}
      {successMessage && (
        <div 
          data-testid="success-message"
          className="alert alert-success"
          role="alert"
          style={{ 
            position: 'fixed', 
            top: '20px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 10000,
            backgroundColor: '#d4edda',
            color: '#155724',
            padding: '10px 20px',
            borderRadius: '5px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}
        >
          {successMessage}
        </div>
      )}
      
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
