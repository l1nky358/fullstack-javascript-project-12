import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useState, useEffect } from 'react';
import { containsProfanity, cleanProfanity } from '../utils/profanity';
import ChannelMenu from './ChannelMenu';
import { useGetChannelsQuery } from '../services/api';

const STORAGE_KEY = 'chat_channels';

const loadChannels = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [
    { id: 1, name: 'general', removable: false },
    { id: 2, name: 'random', removable: false },
  ];
};

const saveChannels = (channels) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
};

const ChannelsList = ({ channels, currentChannelId }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showProfanityWarning, setShowProfanityWarning] = useState(false);
  const [pendingChannelName, setPendingChannelName] = useState('');
  const [localChannels, setLocalChannels] = useState(loadChannels());
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameChannelId, setRenameChannelId] = useState(null);
  const [renameChannelName, setRenameChannelName] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    saveChannels(localChannels);
  }, [localChannels]);

  useEffect(() => {
    if (channels && channels.length > 0) {
      setLocalChannels(channels);
    }
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

  const handleAddChannel = (e) => {
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
  };

  const handleRename = (channelId, newName) => {
    if (!newName || newName.trim().length < 3 || newName.trim().length > 20) {
      setErrorMessage('От 3 до 20 символов');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    const trimmedName = newName.trim();
    
    setLocalChannels(prev => prev.map(ch => 
      ch.id === channelId ? { ...ch, name: trimmedName } : ch
    ));
    setSuccessMessage('Канал переименован');
    setTimeout(() => setSuccessMessage(''), 3000);
    setRenameModalOpen(false);
  };

  const handleRemove = (channelId) => {
    const channel = localChannels.find(ch => ch.id === channelId);
    if (!channel?.removable) {
      setErrorMessage('Нельзя удалить этот канал');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    
    setLocalChannels(prev => prev.filter(ch => ch.id !== channelId));
    setSuccessMessage('Канал удалён');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleProfanityConfirm = () => {
    setShowProfanityWarning(false);
    const cleanedName = cleanProfanity(pendingChannelName);
    addChannelToList(cleanedName);
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
    setOpenMenuId(null);
  };

  const handleRenameSubmit = () => {
    if (renameChannelName.trim().length >= 3 && renameChannelName.trim().length <= 20) {
      handleRename(renameChannelId, renameChannelName.trim());
    } else {
      setErrorMessage('От 3 до 20 символов');
      setTimeout(() => setErrorMessage(''), 3000);
      setRenameModalOpen(false);
    }
  };

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="col-3 border-end p-3">
      {successMessage && (
        <div className="alert alert-success" style={{ marginBottom: '10px' }}>
          {successMessage}
        </div>
      )}
      
      {errorMessage && (
        <div className="alert alert-danger" style={{ marginBottom: '10px' }}>
          {errorMessage}
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
            <li key={channel.id} className="mb-2 d-flex justify-content-between align-items-center" style={{ gap: '8px' }}>
              <button
                className={`btn ${currentChannelId === channel.id ? 'btn-primary' : 'btn-link'}`}
                onClick={() => dispatch(setCurrentChannel(channel.id))}
                style={{ flex: 1, textAlign: 'left' }}
              >
                {channel.name === 'general' ? 'general' : `# ${channel.name}`}
              </button>
              {showMenu && (
                <div style={{ position: 'relative' }}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={() => toggleMenu(channel.id)}
                  >
                    Управление каналом
                  </button>
                  {openMenuId === channel.id && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                        zIndex: 1000,
                        minWidth: '150px'
                      }}
                    >
                      <button
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '8px 16px',
                          textAlign: 'left',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer'
                        }}
                        onClick={() => openRenameModal(channel)}
                      >
                        Переименовать
                      </button>
                      <button
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '8px 16px',
                          textAlign: 'left',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          color: 'red'
                        }}
                        onClick={() => handleRemove(channel.id)}
                      >
                        Удалить
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Затемняющий фон при открытом меню */}
      {openMenuId !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setOpenMenuId(null)} />
      )}

      {/* Модальное окно переименования */}
      {renameModalOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
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
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
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
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
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
