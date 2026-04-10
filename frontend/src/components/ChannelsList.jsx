import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useState, useEffect } from 'react';
import { useAddChannelMutation, useRenameChannelMutation, useRemoveChannelMutation } from '../services/api';
import { containsProfanity, cleanProfanity } from '../utils/profanity';
import ChannelMenu from './ChannelMenu';

const ChannelsList = ({ channels, currentChannelId, onChannelChange }) => {
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
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameChannelId, setRenameChannelId] = useState(null);
  const [renameChannelName, setRenameChannelName] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [channelToRemove, setChannelToRemove] = useState(null);

  const addChannelToList = async (channelName) => {
    setSuccessMessage('Канал создан');
    setNewChannelName('');
    setShowModal(false);
    setTimeout(() => setSuccessMessage(''), 3000);
    
    try {
      await addChannel(channelName).unwrap();
      if (onChannelChange) onChannelChange();
    } catch (error) {
      console.error('Add error:', error);
    }
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

  const handleRename = async (channelId, newName) => {
    if (!newName || newName.trim().length < 3 || newName.trim().length > 20) {
      setErrorMessage('От 3 до 20 символов');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    try {
      await renameChannel({ id: channelId, name: newName.trim() }).unwrap();
      setSuccessMessage('Канал переименован');
      setTimeout(() => setSuccessMessage(''), 3000);
      if (onChannelChange) onChannelChange();
    } catch (error) {
      setErrorMessage('Ошибка при переименовании');
      setTimeout(() => setErrorMessage(''), 3000);
    }
    setRenameModalOpen(false);
  };

  const handleRemove = async (channelId) => {
    const channel = channels.find(ch => ch.id === channelId);
    if (channel?.name === 'general' || channel?.name === 'random') {
      setErrorMessage('Нельзя удалить этот канал');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }
    try {
      await removeChannel(channelId).unwrap();
      setSuccessMessage('Канал удалён');
      setTimeout(() => setSuccessMessage(''), 3000);
      if (onChannelChange) onChannelChange();
    } catch (error) {
      setErrorMessage('Ошибка при удалении');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const openRemoveConfirm = (channelId) => {
    setChannelToRemove(channelId);
    setShowRemoveConfirm(true);
  };

  const confirmRemove = async () => {
    if (channelToRemove) {
      await handleRemove(channelToRemove);
      setShowRemoveConfirm(false);
      setChannelToRemove(null);
    }
  };

  const handleProfanityConfirm = () => {
    setShowProfanityWarning(false);
    addChannelToList(cleanProfanity(pendingChannelName));
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
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Каналы</h2>
        <button className="btn btn-sm btn-outline-primary" onClick={() => setShowModal(true)}>+</button>
      </div>
      
      <ul className="list-unstyled">
        {channels.map(channel => {
          const showMenu = channel.name !== 'general' && channel.name !== 'random';
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
                <ChannelMenu 
                  channel={channel}
                  onRename={() => openRenameModal(channel)}
                  onRemove={() => openRemoveConfirm(channel.id)}
                />
              )}
            </li>
          );
        })}
      </ul>

      {openMenuId !== null && <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setOpenMenuId(null)} />}

      {/* Модальное окно подтверждения удаления */}
      {showRemoveConfirm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Удалить канал</h5>
                <button className="btn-close" onClick={() => setShowRemoveConfirm(false)}></button>
              </div>
              <div className="modal-body">
                <p>Вы уверены, что хотите удалить этот канал?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowRemoveConfirm(false)}>Отмена</button>
                <button className="btn btn-danger" onClick={confirmRemove}>Удалить</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно переименования */}
      {renameModalOpen && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Переименовать канал</h5>
                <button className="btn-close" onClick={() => setRenameModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <label htmlFor="renameChannelName" className="form-label">Имя канала</label>
                <input
                  type="text"
                  id="renameChannelName"
                  className="form-control"
                  value={renameChannelName}
                  onChange={(e) => setRenameChannelName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleRenameSubmit()}
                  autoFocus
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setRenameModalOpen(false)}>Отмена</button>
                <button className="btn btn-primary" onClick={handleRenameSubmit}>Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления канала */}
      {showModal && !showProfanityWarning && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Добавить канал</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
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

      {/* Модальное окно предупреждения о нецензурных словах */}
      {showProfanityWarning && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Предупреждение</h5>
                <button className="btn-close" onClick={handleProfanityCancel}></button>
              </div>
              <div className="modal-body">
                <p>Название канала содержит недопустимые слова. Отправить с заменой на *****?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleProfanityCancel}>Отмена</button>
                <button className="btn btn-warning" onClick={handleProfanityConfirm}>*****</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelsList;
