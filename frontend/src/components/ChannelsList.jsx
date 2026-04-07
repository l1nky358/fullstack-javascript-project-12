import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useState } from 'react';
import { useAddChannelMutation } from '../services/api';
import { containsProfanity, cleanProfanity } from '../utils/profanity';

const ChannelsList = ({ channels, currentChannelId }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [addChannel] = useAddChannelMutation();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showProfanityWarning, setShowProfanityWarning] = useState(false);
  const [pendingChannelName, setPendingChannelName] = useState('');
  const [editingChannel, setEditingChannel] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [localChannels, setLocalChannels] = useState(channels);
  const [openMenuChannelId, setOpenMenuChannelId] = useState(null);

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

  // Локальное переименование без API
  const handleRename = (channelId, newName) => {
    if (!newName || newName.trim().length < 3 || newName.trim().length > 20) {
      setEditingChannel(null);
      setRenameValue('');
      setOpenMenuChannelId(null);
      return;
    }
    
    const trimmedName = newName.trim();
    
    setLocalChannels(prev => prev.map(ch => 
      ch.id === channelId ? { ...ch, name: trimmedName } : ch
    ));
    setSuccessMessage('Канал переименован');
    setTimeout(() => setSuccessMessage(''), 3000);
    
    setEditingChannel(null);
    setRenameValue('');
    setOpenMenuChannelId(null);
  };

  // Локальное удаление без API
  const handleRemove = (channelId) => {
    const channel = localChannels.find(ch => ch.id === channelId);
    if (channel?.name === 'general') {
      setErrorMessage('Нельзя удалить канал general');
      setTimeout(() => setErrorMessage(''), 3000);
      setOpenMenuChannelId(null);
      return;
    }
    
    setLocalChannels(prev => prev.filter(ch => ch.id !== channelId));
    setSuccessMessage('Канал удалён');
    setTimeout(() => setSuccessMessage(''), 3000);
    setOpenMenuChannelId(null);
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

  const startRename = (channel) => {
    setEditingChannel(channel.id);
    setRenameValue(channel.name);
    setOpenMenuChannelId(null);
  };

  const toggleMenu = (channelId) => {
    setOpenMenuChannelId(openMenuChannelId === channelId ? null : channelId);
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
            {editingChannel === channel.id ? (
              <input
                type="text"
                className="form-control form-control-sm"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                autoFocus
                onBlur={() => handleRename(channel.id, renameValue)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleRename(channel.id, renameValue);
                  }
                }}
              />
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <button
                  className={`btn ${currentChannelId === channel.id ? 'btn-primary' : 'btn-link'}`}
                  onClick={() => dispatch(setCurrentChannel(channel.id))}
                  style={{ flex: 1, textAlign: 'left' }}
                >
                  {channel.name === 'general' ? 'general' : `# ${channel.name}`}
                </button>
                
                {/* Кнопка с тремя точками */}
                <div style={{ position: 'relative' }}>
                  <button
                    className="btn btn-sm btn-link"
                    onClick={() => toggleMenu(channel.id)}
                    aria-label="Управление каналом"
                  >
                    ⋮
                  </button>
                  
                  {/* Выпадающее меню */}
                  {openMenuChannelId === channel.id && (
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
                        className="dropdown-item"
                        onClick={() => startRename(channel)}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '8px 16px',
                          textAlign: 'left',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        Переименовать
                      </button>
                      {channel.removable && (
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleRemove(channel.id)}
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
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* Закрытие меню при клике вне */}
      {openMenuChannelId !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setOpenMenuChannelId(null)}
        />
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