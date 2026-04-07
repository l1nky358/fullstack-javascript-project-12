import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useState } from 'react';
import { useAddChannelMutation } from '../services/api';
import { containsProfanity, cleanProfanity } from '../utils/profanity';
import ChannelMenu from './ChannelMenu';

const ChannelsList = ({ channels, currentChannelId }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [addChannel] = useAddChannelMutation();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showProfanityWarning, setShowProfanityWarning] = useState(false);
  const [pendingChannelName, setPendingChannelName] = useState('');
  const [localChannels, setLocalChannels] = useState(channels);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameChannelId, setRenameChannelId] = useState(null);
  const [renameChannelName, setRenameChannelName] = useState('');

  useState(() => {
    setLocalChannels(channels);
  }, [channels]);

  const addChannelToList = (channelName) => {
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
  };

  const handleAddChannel = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    const channelName = newChannelName.trim();
    
    if (channelName.length < 3 || channelName.length > 20) {
      setErrorMessage('От 3 до 20 символов');
      return;
    }
    
    if (containsProfanity(channelName)) {
      setPendingChannelName(channelName);
      setShowProfanityWarning(true);
      return;
    }
    
    addChannelToList(channelName);
    
    try {
      await addChannel(channelName).unwrap();
    } catch (error) {
      console.error('API error:', error);
    }
  };

  const handleRename = (channelId, newName) => {
    const updatedChannels = localChannels.map(ch => 
      ch.id === channelId ? { ...ch, name: newName } : ch
    );
    setLocalChannels(updatedChannels);
    setSuccessMessage('Канал переименован');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRemove = (channelId) => {
    const channel = localChannels.find(ch => ch.id === channelId);
    if (!channel?.removable) {
      setErrorMessage('Нельзя удалить этот канал');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    const updatedChannels = localChannels.filter(ch => ch.id !== channelId);
    setLocalChannels(updatedChannels);
    setSuccessMessage('Канал удалён');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleProfanityConfirm = () => {
    setShowProfanityWarning(false);
    const cleanedName = cleanProfanity(pendingChannelName);
    addChannelToList(cleanedName);
    
    try {
      addChannel(cleanedName).unwrap();
    } catch (error) {
      console.error('API error:', error);
    }
  };

  const handleProfanityCancel = () => {
    setShowProfanityWarning(false);
    setPendingChannelName('');
    setNewChannelName('');
  };

  const openRenameModal = (channel) => {
    setRenameChannelId(channel.id);
    setRenameChannelName(channel.name);
    setRenameModalOpen(true);
  };

  const handleRenameSubmit = () => {
    if (renameChannelName.trim().length >= 3 && renameChannelName.trim().length <= 20) {
      handleRename(renameChannelId, renameChannelName.trim());
    }
    setRenameModalOpen(false);
    setRenameChannelId(null);
    setRenameChannelName('');
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
        {localChannels.map(channel => {
          const isSystemChannel = channel.name === 'general' || channel.name === 'random';
          const showMenu = !isSystemChannel && channel.removable;
          
          return (
            <li key={channel.id} className="mb-2 d-flex justify-content-between align-items-center">
              <button
                className={`btn w-100 text-start ${currentChannelId === channel.id ? 'btn-primary' : 'btn-link'}`}
                onClick={() => dispatch(setCurrentChannel(channel.id))}
              >
                {channel.name === 'general' ? 'general' : `# ${channel.name}`}
              </button>
              {showMenu && (
                <ChannelMenu 
                  channel={channel}
                  onRename={() => openRenameModal(channel)}
                  onRemove={() => handleRemove(channel.id)}
                />
              )}
            </li>
          );
        })}
      </ul>

      {/* Модальное окно переименования */}
      {renameModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Переименовать канал</h5>
                <button type="button" className="btn-close" onClick={() => setRenameModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <label htmlFor="renameChannelName" className="form-label">Имя канала</label>
                <input
                  type="text"
                  id="renameChannelName"
                  className="form-control"
                  value={renameChannelName}
                  onChange={(e) => setRenameChannelName(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleRenameSubmit();
                    }
                  }}
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setRenameModalOpen(false)}>Отмена</button>
                <button type="button" className="btn btn-primary" onClick={handleRenameSubmit}>Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно предупреждения о нецензурных словах */}
      {showProfanityWarning && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Предупреждение</h5>
                <button type="button" className="btn-close" onClick={handleProfanityCancel}></button>
              </div>
              <div className="modal-body">
                <p>Название канала содержит недопустимые слова.</p>
                <p>Отправить с заменой на *****?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleProfanityCancel}>Отмена</button>
                <button type="button" className="btn btn-warning" onClick={handleProfanityConfirm}>
                  *****
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления канала */}
      {showModal && !showProfanityWarning && (
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
