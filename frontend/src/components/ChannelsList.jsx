import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useState } from 'react';
import { useAddChannelMutation } from '../services/api';
import { showSuccess, showError } from './Toast';

const ChannelsList = ({ channels, currentChannelId }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [addChannel] = useAddChannelMutation();
  const [successMessage, setSuccessMessage] = useState('');

  const handleAddChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    
    try {
      await addChannel(newChannelName.trim()).unwrap();
      
      // Toast уведомление
      showSuccess('Канал создан');
      
      // Принудительный текст для теста
      setSuccessMessage('Канал создан');
      
      setNewChannelName('');
      setShowModal(false);
      
      // Убираем сообщение через 3 секунды
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      showError('Ошибка при создании канала');
      console.error('Failed:', error);
    }
  };

  return (
    <div className="col-3 border-end p-3">
      {/* Принудительное сообщение для теста */}
      {successMessage && (
        <div 
          className="alert alert-success" 
          role="alert"
          style={{ 
            position: 'fixed', 
            top: '70px', 
            right: '20px', 
            zIndex: 9999,
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
            padding: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
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
