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
    <div className="channels-list d-flex flex-column h-100">
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
        <h6 className="mb-0">{t('chat.channels')}</h6>
        <button 
          className="btn btn-sm btn-outline-primary"
          onClick={() => setShowAddModal(true)}
          aria-label={t('channels.modals.add.title')}
        >
          {t('chat.addChannel')}
        </button>
      </div>
      
      <ul className="list-unstyled p-2 mb-0 flex-grow-1 overflow-auto">
        {channels.map((channel) => (
          <li key={channel.id} className="mb-1">
            <div className={`d-flex justify-content-between align-items-center p-1 rounded ${channel.id === currentChannelId ? 'bg-primary text-white' : ''}`}>
              <button
                className="btn btn-link text-decoration-none flex-grow-1 text-start"
                onClick={() => onChannelSelect(channel.id)}
                style={{ color: channel.id === currentChannelId ? 'white' : 'inherit' }}
                aria-label={channel.name}
                role="button"
              >
                # {channel.name}
              </button>
              
              <ChannelMenu
                channel={channel}
                onRename={() => setRenameChannel(channel)}
                onRemove={() => setRemoveChannel(channel)}
              />
            </div>
          </li>
        ))}
      </ul>

      {showAddModal && <AddChannelModal onClose={() => setShowAddModal(false)} />}
      {renameChannel && <RenameChannelModal channel={renameChannel} onClose={() => setRenameChannel(null)} />}
      {removeChannel && <RemoveChannelModal channel={removeChannel} onClose={() => setRemoveChannel(null)} />}
    </div>
  );
};

export default ChannelsList;
