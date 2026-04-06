import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useState } from 'react';
import { useAddChannelMutation, useRenameChannelMutation, useRemoveChannelMutation } from '../services/api';
import { containsProfanity, cleanProfanity } from '../utils/profanity';

const ChannelsList = ({ channels, currentChannelId }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [addChannel] = useAddChannelMutation();
  const [renameChannel] = useRenameChannelMutation();
  const [removeChannel] = useRemoveChannelMutation();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showProfanityWarning, setShowProfanityWarning] = useState(false);
  const [pendingChannelName, setPendingChannelName] = useState('');
  const [editingChannel, setEditingChannel] = useState(null);
  const [localChannels, setLocalChannels] = useState(channels);

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

  const handleRename = async (channelId, newName) => {
    if (!newName || newName.trim().length < 3 || newName.trim().length > 20) {
      return;
    }
    
    const trimmedName = newName.trim();
    
    try {
      await renameChannel({ id: channelId, name: trimmedName }).unwrap();
      setLocalChannels(prev => prev.map(ch => 
        ch.id === channelId ? { ...ch, name: trimmedName } : ch
      ));
      setSuccessMessage('Канал переименован');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Rename error:', error);
    }
    setEditingChannel(null);
  };

  const handleRemove = async (channelId) => {
    try {
      await removeChannel(channelId).unwrap();
      setLocalChannels(prev => prev.filter(ch => ch.id !== channelId));
      setSuccessMessage('Канал удалён');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Remove error:', error);
    }
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
            {channel.removable && editingChannel !== channel.id && (
              <div className="dropdown">
                <button
                  className="btn btn-sm btn-link"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-label="Управление каналом"
                >
                  ⋮
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button className="dropdown-item" onClick={() => setEditingChannel(channel.id)}>
                      Переименовать
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={() => handleRemove(channel.id)}>
                      Удалить
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

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
