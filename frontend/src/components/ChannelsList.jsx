import { useDispatch } from 'react-redux';
import { setCurrentChannel } from '../store/channelsSlice';
import { useState } from 'react';
import { useAddChannelMutation, useRenameChannelMutation, useRemoveChannelMutation } from '../services/api';
import ChannelMenu from './ChannelMenu';
import { showSuccess, showError } from './Toast';
import { useTranslation } from 'react-i18next';

const ChannelsList = ({ channels, currentChannelId }) => {
  const { t } = useTranslation();
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
    if (!newChannelName.trim()) return;
    
    try {
      await addChannel(newChannelName.trim()).unwrap();
      
      const successText = 'Канал создан';
      setSuccessMessage(successText);
      showSuccess(successText);
      
      setNewChannelName('');
      setShowModal(false);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      showError(t('toast.error.failedToCreate'));
    }
  };

  const handleRename = async (channelId, newName) => {
    if (!newName.trim()) return;
    try {
      await renameChannel({ id: channelId, name: newName.trim() }).unwrap();
      showSuccess(t('toast.channelRenamed'));
      setEditingChannel(null);
    } catch (error) {
      showError(t('toast.error.failedToRename'));
    }
  };

  const handleRemove = async (channelId) => {
    try {
      await removeChannel(channelId).unwrap();
      showSuccess(t('toast.channelRemoved'));
    } catch (error) {
      showError(t('toast.error.failedToRemove'));
    }
  };

  return (
    <div className="col-3 border-end p-3">
      {/* Принудительное сообщение для теста */}
      {successMessage && (
        <div 
          className="alert alert-success" 
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
        <h2 className="h5 mb-0">{t('chat.channels')}</h2>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={() => setShowModal(true)}
        >
          {t('chat.addChannel')}
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

      {/* Модальное окно добавления канала */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t('channels.modals.add.title')}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleAddChannel}>
                <div className="modal-body">
                  <label htmlFor="channelName" className="form-label">{t('channels.modals.add.name')}</label>
                  <input
                    type="text"
                    id="channelName"
                    className="form-control"
                    placeholder={t('channels.modals.add.placeholder')}
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    {t('channels.modals.add.cancel')}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {t('channels.modals.add.submit')}
                  </button>
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
