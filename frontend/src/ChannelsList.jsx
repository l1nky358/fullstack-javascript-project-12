import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ChannelMenu from './ChannelMenu';
import AddChannelModal from './modals/AddChannelModal';
import RenameChannelModal from './modals/RenameChannelModal';
import RemoveChannelModal from './modals/RemoveChannelModal';

const ChannelsList = ({ channels, currentChannelId, onChannelSelect }) => {
  const { t } = useTranslation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [renameChannel, setRenameChannel] = useState(null);
  const [removeChannel, setRemoveChannel] = useState(null);

  return (
    <div className="channels-list">
      <div className="channels-header">
        <span className="channels-title">{t('chat.channels')}</span>
        <button 
          className="add-channel-btn"
          onClick={() => setShowAddModal(true)}
          title={t('channels.modals.add.title')}
        >
          +
        </button>
      </div>
      
      <div className="channels-container">
        {channels.map((channel) => (
          <div 
            key={channel.id} 
            className={`channel-item ${channel.id === currentChannelId ? 'active' : ''}`}
            onClick={() => onChannelSelect(channel.id)}
          >
            <div className="channel-content">
              <span className="channel-prefix">#</span>
              <span className="channel-name" title={channel.name}>
                {channel.name}
              </span>
              <ChannelMenu
                channel={channel}
                onRename={() => setRenameChannel(channel)}
                onRemove={() => setRemoveChannel(channel)}
              />
            </div>
          </div>
        ))}
      </div>

      {showAddModal && <AddChannelModal onClose={() => setShowAddModal(false)} />}
      {renameChannel && <RenameChannelModal channel={renameChannel} onClose={() => setRenameChannel(null)} />}
      {removeChannel && <RemoveChannelModal channel={removeChannel} onClose={() => setRemoveChannel(null)} />}
    </div>
  );
};

export default ChannelsList;